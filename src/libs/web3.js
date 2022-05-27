import React, { useState, useEffect, useContext, createContext } from 'react';
import Web3 from 'web3/dist/web3.min';
import { useToast } from 'ds/hooks/useToast';
import config from 'config';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import NFTCollectible from 'services/blockchain/blockchains/ethereum/abis/ambitionNFTPresale.json';
import {
    useGetNonceByAddress,
    useVerifySignature,
    useVerifySignaturePhantom,
} from 'gql/hooks/users.hook';
import { useLoginForm } from '../components/pages/Auth/hooks/useLoginForm';
import posthog from 'posthog-js';
import { useAuth } from 'libs/auth';
import { loadCandyProgramV2 } from 'solana/helpers/accounts';

export const Web3Context = createContext({});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
    const [wallet, setWallet] = useState('default'); //default, metamask, phantom
    const [account, setAccount] = useState('');
    const [loading, setLoading] = useState(false);
    const [contractVarsState, setContractVarsState] = useState(false);
    const { addToast } = useToast();
    const { handleLoginSuccess } = useLoginForm();
    const [getNonceByAddress] = useGetNonceByAddress({});
    const { logout } = useAuth();
    const [verifySignature] = useVerifySignature({
        onCompleted: async (data) => {
            posthog.capture('User logged in with metamask', {
                $set: {
                    publicAddress: account,
                },
            });
            window.localStorage.setItem('ambition-wallet', 'metamask');
            setWallet('metamask');
            await handleLoginSuccess();
        },
    });
    const [verifySignaturePhantom] = useVerifySignaturePhantom({
        onCompleted: async (data) => {
            posthog.capture('User logged in with phantom', {
                $set: {
                    publicAddress: account,
                },
            });
            window.localStorage.setItem('ambition-wallet', 'phantom');
            setWallet('phantom');
            await handleLoginSuccess();
        },
    });

    useEffect(() => {
        if (!wallet || !wallet.length) return;
        (async () => {
            if (wallet === 'default' || wallet === 'metamask') {
                if (window.ethereum) {
                    window.ethereum.on('accountsChanged', (_account) => {
                        setAccount(_account[0]);
                    });
                }
            }
        })();
    }, [wallet]);

    useEffect(() => {
        const curWallet = localStorage.getItem('ambition-wallet');
        // TODO check why logout() function is called?
        // if (!curWallet || !curWallet.length) logout();
        setWallet(curWallet || 'default');
    }, []);

    const loadWalletProvider = async (walletType) => {
        try {
            if (walletType === 'metamask') {
                if (
                    typeof window.ethereum === 'undefined' ||
                    typeof window.web3 === 'undefined'
                )
                    throw new Error('Metamask is not installed');
                window.web3 =
                    new Web3(window.ethereum) ||
                    new Web3(window.web3.currentProvider);
                const accounts = await window.web3.eth.getAccounts();
                setAccount(accounts[0]);
                return accounts[0];
            } else if (walletType === 'phantom') {
                const provider = window.solana;
                if (!provider?.isPhantom)
                    throw new Error('Phantom is not installed');
                const sol = await window.solana.connect();
                setAccount(sol.publicKey.toString());
                return sol.publicKey.toString();
            } else throw new Error('Wallet not supported');
        } catch (err) {
            console.error(err);
            addToast({
                severity: 'error',
                message: err.message,
            });
        }
    };

    const loginToWallet = async (walletType) => {
        try {
            const payerAccount = await loadWalletProvider(walletType);
            await setAccount(payerAccount);

            console.log(account);

            const res = await getNonceByAddress({
                variables: { address: account },
            });
            const nonce = res.data.getNonceByAddress;
            const signature = await signNonce(walletType, nonce, account);

            if (walletType === 'metamask') {
                if (!signature)
                    throw new Error('User Rejected Login with Metamask');

                await verifySignature({
                    variables: { address: account, signature },
                });
            } else if (walletType === 'phantom') {
                if (!signature)
                    throw new Error('User Rejected Login with Phantom');

                await verifySignaturePhantom({
                    variables: {
                        address: signature.publicKey,
                        signature: signature.signature,
                    },
                });
            } else throw new Error('Wallet not supported');
        } catch (err) {
            console.error(err);
            addToast({
                severity: 'error',
                message: err.message,
            });
        }
    };

    const loginAndPay = async (walletType, size, callback) => {
        try {
            const payerAccount = await loadWalletProvider(walletType);

            const res = await getNonceByAddress({ variables: { address: payerAccount } });
            const nonce = res.data.getNonceByAddress;
            const signature = await signNonce(walletType, nonce, payerAccount);

            if (walletType === 'metamask') {
                if (!signature) throw new Error('User Rejected Login with Metamask');

                await verifySignature({ variables: { address: payerAccount, signature } })
            }
            else if (walletType === 'phantom') {
                if (!signature) throw new Error('User Rejected Login with Phantom');

                await verifySignaturePhantom({ variables: { address: signature.publicKey, signature: signature.signature } });
            }
            else throw new Error('Wallet not supported');

            setAccount(payerAccount, payInEth(size, callback, payerAccount));
        }
        catch (err) {
            console.error(err);
            addToast({
                severity: 'error',
                message: err.message
            })
        }
    }

    const signNonce = async (walletType, nonce, address = '') => {
        try {
            let signature;
            const message = `I am signing my one-time nonce: ${nonce}`;

            if (walletType === 'metamask') {
                signature = await window.web3.eth.personal.sign(
                    window.web3.utils.fromUtf8(message),
                    address
                );
            } else if (walletType === 'phantom') {
                const encodedMessage = new TextEncoder().encode(message);
                signature = await window.solana.request({
                    method: 'signMessage',
                    params: {
                        message: encodedMessage,
                    },
                });
            } else throw new Error('Wallet not supported');

            return signature;
        } catch (err) {
            console.error(err);
            addToast({
                severity: 'error',
                message: err.message,
            });
        }
    };

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            window.ethereum.on('accountsChanged', (accounts) =>
                setAccount(accounts[0])
            );
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            addToast({
                severity: 'warning',
                message:
                    'Non-Ethereum browser detected. You should consider trying MetaMask!',
            });
        }

        console.log('loadweb3 deployed');
    };

    // Load account and load smart contracts
    const loadBlockchainData = async (_contract) => {
			await loadWalletProvider(wallet)

			/*
            if (wallet === 'default' || wallet === 'metamask') {
        if (window.ethereum) {
            //const Contract = _contract
            const web3 = window.web3;

            // Load account
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);
        }
            }

*/
        console.log('loadBlockchainData deployed');
			
    };

    // Mint NFT
    const mint = async (contractAddress, count = 1) => {
        const contract = await retrieveContract(contractAddress);
        const price = await contract.methods.cost().call();

        contract.methods
            .mint(count)
            .send({ from: account, value: price * count }, (err) => {
                if (err) {
                    addToast({
                        severity: 'error',
                        message: err.message,
                    });
                } else {
                    addToast({
                        severity: 'info',
                        message:
                            'Sending transaction to Blockchain. This might take a couple of seconds...',
                    });
                }
            })
            .on('error', (err) => {
                addToast({
                    severity: 'error',
                    message: err.message,
                });
            })
            .once('confirmation', () => {
                addToast({
                    severity: 'success',
                    message: 'NFT successfully minted.',
                });
            });
    };

    // compare array buffers
    function compare(a, b) {
        for (let i = a.length; -1 < i; i -= 1) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    const presaleMint = async (
        price,
        contractAddress,
        whitelist,
        count = 1
    ) => {
        const contract = await retrieveContract(contractAddress);
        const priceInWei = Web3.utils.toWei(price * count);

        const leafNodes = whitelist.map((addr) => keccak256(addr));
        const claimingAddress = await leafNodes.find((node) =>
            compare(keccak256(account), node)
        );

        const merkleTree = new MerkleTree(leafNodes, keccak256, {
            sortPairs: true,
        });

        const hexProof = merkleTree.getHexProof(claimingAddress);

        contract.methods
            .presaleMint(count, hexProof)
            .send({ from: account, value: priceInWei }, (err) => {
                if (err) {
                    addToast({
                        severity: 'error',
                        message: err.message,
                    });
                } else {
                    addToast({
                        severity: 'info',
                        message:
                            'Sending transaction to Blockchain. This might take a couple of seconds...',
                    });
                }
            })
            .on('error', (err) => {
                addToast({
                    severity: 'error',
                    message: err.message,
                });
            })
            .once('confirmation', () => {
                addToast({
                    severity: 'success',
                    message: 'NFT successfully minted.',
                });
            });
    };

    const checkOwner = async (id, contractAddress) => {
        const contract = await retrieveContract(contractAddress);
        const owner = await contract.methods.ownerOf(id).call();
        return owner;
    };

    const getPublicContractVariables = async (contractAddress, chainid, env) => {
        if (!contractAddress || !chainid) return;

			console.log(contractAddress)

        console.log('getting contract variables', chainid);

            if (chainid.indexOf('solana') != -1) { 
                // If Solana Contract
                setContractVarsState(false);

                await loadWalletProvider('phantom');
                const contract = await retrieveSolanaContract(contractAddress, chainid, env);

                console.log(contract);
                setContractVarsState(true);

                const itemsLeft = contract.itemsAvailable;



                return {
                    itemsLeft
                    // contract.itemsAvailable,
                    // contract.
                };
            } else {
                // If Metamask Contract
                setContractVarsState(false);

                await loadWalletProvider('metamask');

                const contract = await retrieveContract(contractAddress);

                const balance = await window.web3.eth.getBalance(contractAddress);
                console.log('balance', balance);
                const balanceInEth = window.web3.utils.fromWei(balance);
                console.log('balanceInEth', balanceInEth);

								                const open = await contract.methods.open().call();
                console.log('open', open);


                let presaleOpen = false; // Temporary, presaleOpen is not working
                try {
                    presaleOpen = await contract.methods.presaleOpen().call();
                } catch (err) {
                    //console.log(err);
                }
                console.log('presaleOpen', presaleOpen);

                const maxPerMint = await contract.methods.maxPerMint().call();
                console.log('maxPerMint', maxPerMint);
                const cost = await contract.methods.cost().call();
                console.log('cost', cost);
                const costInEth = window.web3.utils.fromWei(cost);
                console.log('costInEth', costInEth);
                const supply = await contract.methods.supply().call();
                console.log('supply', supply);
                const totalSupply = await contract.methods.totalSupply().call();
                console.log('totalSupply', totalSupply);
                const owner = await contract.methods.owner().call();
                console.log('owner', owner);

							let baseTokenUri
							try {
							baseTokenUri = await contract.methods
											.baseTokenURI()
											.call();
							}catch (e) { baseTokenUri = 'Error fetching URI'
									
								}
									console.log('baseTokenUri', baseTokenUri);

                setContractVarsState(true);

                return {
                    balance,
                    balanceInEth,
                    baseTokenUri,
                    open,
                    presaleOpen,
                    maxPerMint,
                    cost,
                    costInEth,
                    supply,
                    totalSupply,
                    owner,
                };
            }
        
    };

    const retrieveSolanaContract = async (candyMachineAddress, chain, env) => {

        if (env == 'solanadevnet') {
            env = 'devnet';
        } else if (env == 'solana') {
            env = 'mainnet';
        }

        console.log(candyMachineAddress, chain, env);

        
        // const priceInSol = price / anchor.web3.LAMPORTS_PER_SOL;

        const anchorProgram = await loadCandyProgramV2(null, env);
        // const candyMachineAddress = contractAddress;
        // const connection = anchorProgram.provider.connection;
        const candyMachineObj = await anchorProgram.account.candyMachine.fetch(
            candyMachineAddress,
        );

        const itemsAvailable = candyMachineObj.data.itemsAvailable.toNumber();
        const itemsRedeemed = candyMachineObj.itemsRedeemed.toNumber();
        const itemsRemaining = itemsAvailable - itemsRedeemed;
        const price = candyMachineObj.data.price.toNumber();

        console.log(candyMachineObj);

        return {
            itemsRedeemed, 
            price,
            itemsAvailable,
            itemsRemaining
            
        };
        
    }

    const retrieveContract = (contractAddress) => {
        const web3 = window.web3;
        if (web3.eth) {
            try {
                const contract = new web3.eth.Contract(
                    NFTCollectible.abi,
                    contractAddress
                );
                console.log(contract);
                return contract;
            } catch (e) {
                console.log(e);
            }
        }
    };

    const getPrice = async (contractAddress) => {
        const web3 = window.web3;
        const contract = await retrieveContract(contractAddress);
        const price = await contract.methods.cost().call();
        return web3.utils.fromWei(price);
    };

    const getTotalMinted = async (contractAddress) => {
        const web3 = window.web3;
        const contract = await retrieveContract(contractAddress);

        //        const state = await contract.methods.open().call();
        const minted = await contract.methods.supply().call();

        return minted;
    };

    const getMaximumSupply = async (contractAddress) => {
        const web3 = window.web3;
        try {
            const contract = await retrieveContract(contractAddress);

            //        const state = await contract.methods.open().call();
            const max = await contract.methods.totalSupply().call();

            return max;
        } catch (e) {
            const max2 = await contract.methods.MAX_SUPPLY().call();

            return max2;
        }
    };

    // Compare current network with target network and switches if it doesn't match
    const compareNetwork = async (targetNetwork, callback = null) => {
        if (targetNetwork.indexOf('solana') != -1) {
            if (callback != null) callback();
            return;
        }
        let target = targetNetwork;
        if (targetNetwork.indexOf('x') === -1) {
            if (targetNetwork === 'ethereum') target = '0x1';
            else if (targetNetwork === 'rinkeby') target = '0x4';
            else if (targetNetwork === 'polygon') target = '0x89';
            else if (targetNetwork === 'mumbai') target = '0x13881';
        }
        const curNetwork = getNetworkID();
        if (curNetwork !== target) {
            const status = await setNetwork(target);
            if (status === 'prompt_successful' && callback != null) callback();
            else if (status === 'prompt_cancled') {
                addToast({
                    severity: 'error',
                    message: 'User canceled switching networks',
                });
            }
        } else {
            if (callback != null) callback();
        }
    };

    // Get current network
    const getNetworkID = () => {
        if (wallet == 'phantom') return 'solana';
        return `0x${parseInt(window.ethereum.networkVersion).toString(16)}`;
    };

    // Set current network
    const setNetwork = async (networkID) => {
        return window.ethereum
            .request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: networkID }],
            })
            .then(() => {
                return 'prompt_successful';
            })
            .catch(async (err) => {
                if (err.code === 4001) {
                    // User cancled prompt
                    return 'prompt_cancled';
                } else if (err.code === 4902) {
                    // Unrecognized chain ID
                    let networkData = {
                        chainId: '',
                        chainName: '',
                        nativeCurrency: {
                            name: '',
                            symbol: '',
                            decimals: -1,
                        },
                        rpcUrls: [],
                        blockExplorerUrls: [],
                    };

                    networkData.chainId = networkID;

                    if (networkID === '0x89') {
                        // Polygon
                        networkData.rpcUrls.push('https://polygon-rpc.com');
                        networkData.chainName = 'Polygon Mainnet (Matic)';
                        networkData.nativeCurrency.name = 'Polygon';
                        networkData.nativeCurrency.symbol = 'MATIC';
                        networkData.nativeCurrency.decimals = 18;
                        networkData.blockExplorerUrls.push(
                            'https://polygonscan.com'
                        );
                    } else if (networkID === '0x13881') {
                        // Polygon Mumbai Testnet
                        networkData.rpcUrls.push(
                            'https://rpc-mumbai.maticvigil.com'
                        );
                        networkData.chainName = 'Polygon Mumbai Testnet';
                        networkData.nativeCurrency.name = 'Mumbai';
                        networkData.nativeCurrency.symbol = 'MATIC';
                        networkData.nativeCurrency.decimals = 18;
                        networkData.blockExplorerUrls.push(
                            'https://mumbai.polygonscan.com'
                        );
                    }

                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [networkData],
                    });

                    return 'prompt_successful';
                }
                return 'prompt_cancled';
            });
    };

    const payInEth = async (size, callback, accountFrom = '') => {

        let payerAccount = account;

        if (payerAccount == '') {
            payerAccount = accountFrom;
        }

        await compareNetwork('0x1', () => {
            const web3 = window.web3
            const inEth = 0.000034;
            const amount = inEth * size;

            web3.eth.sendTransaction({
                from: payerAccount,
                to: config.company.walletAddress,
                value: web3.utils.toWei(amount.toFixed(7).toString(), "ether")
            })
                .on('transactionHash', () => {
                    setLoading(true);
                    addToast({
                        severity: 'info',
                        message: 'Sending transaction. This could take up to a minute...'
                    })
                })
                .once('confirmation', () => {
                    setLoading(false);
                    callback()
                })
                .on('error', () => {
                    setLoading(false);
                })
        })
        return [loading]
    }

    const payGeneratorWithEth = async (size, callback) => {
        return await loginAndPay('metamask', size, callback);
    }

    return (
        <Web3Context.Provider
            value={{
                account,
                wallet,
                setAccount,
                setWallet,
                loadWalletProvider,
                loginToWallet,

                loadWeb3,
                loadBlockchainData,
                mint,
                retrieveContract,
                signNonce,
                checkOwner,
                getNetworkID,
                setNetwork,
                compareNetwork,
                presaleMint,

                loading,
                payInEth,
                payGeneratorWithEth,
                getPrice,
                getMaximumSupply,
                getTotalMinted,

                getPublicContractVariables,
                contractVarsState,
            }}>
            {children}
        </Web3Context.Provider>
    )
}
