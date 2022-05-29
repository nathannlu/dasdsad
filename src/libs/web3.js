import React, { useState, useEffect, useContext, createContext } from 'react';
import Web3 from 'web3/dist/web3.min';
import config from 'config';
import posthog from 'posthog-js';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { WalletController } from '@ambition-blockchain/controllers';

import NFTCollectible from 'services/blockchain/blockchains/ethereum/abis/ambitionNFTPresale.json';

import { useToast } from 'ds/hooks/useToast';

import {
    useGetNonceByAddress,
    useVerifySignature,
    useVerifySignaturePhantom,
} from 'gql/hooks/users.hook';

import { useLoginForm } from '../components/pages/Auth/hooks/useLoginForm';

export const Web3Context = createContext({});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
    const [walletController, setWalletController] = useState(null);
    const [loading, setLoading] = useState(false);

    const [contractVarsState, setContractVarsState] = useState(false);

    const { addToast } = useToast();
    const { handleLoginSuccess } = useLoginForm();

    const [getNonceByAddress] = useGetNonceByAddress({});

    const [verifySignature] = useVerifySignature({
        onCompleted: async (data) => {
            posthog.capture('User logged in with metamask', { $set: { publicAddress: account } });
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

    const initializeWalletController = () => {
        const wc = new WalletController();
        setWalletController(wc);
        return wc;
    }

    // on load
    useEffect(() => {
        const curentWalletType = localStorage.getItem('ambition-wallet');
        const wc = initializeWalletController();

        if (curentWalletType) {
            wc.loadWalletProvider(curentWalletType);
        }

    }, []);

    const loginToWallet = async (walletType) => {
        try {
            const wc = walletController || initializeWalletController();
            await wc.loadWalletProvider(walletType);
            const walletAddress = wc.state.address;

            const res = await getNonceByAddress({ variables: { address: walletAddress } });
            const nonce = res.data.getNonceByAddress;
            const signature = await wc.signNonce(walletType, nonce, walletAddress);

            if (walletType === 'metamask') {
                if (!signature)
                    throw new Error('User Rejected Login with Metamask');
                await verifySignature({ variables: { address: walletAddress, signature } });
            } else if (walletType === 'phantom') {
                if (!signature)
                    throw new Error('User Rejected Login with Phantom');
                await verifySignaturePhantom({ variables: { address: signature.publicKey, signature: signature.signature } });
            } else throw new Error('Wallet not supported');
        } catch (err) {
            console.error(err);
            addToast({
                severity: 'error',
                message: err.message,
            });
        }
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

    const getPublicContractVariables = async (contractAddress, chainid) => {
        if (!contractAddress || !chainid) return;
        const wc = walletController || initializeWalletController();

        if (chainid.indexOf('solana') != -1) {
            // If Solana Contract
            setContractVarsState(false);

            await wc.loadWalletProvider('phantom');

            setContractVarsState(true);
        } else {
            // If Metamask Contract
            setContractVarsState(false);

            await wc.loadWalletProvider('metamask');

            const contract = await retrieveContract(contractAddress);

            const balance = await window.web3.eth.getBalance(contractAddress);
            const balanceInEth = window.web3.utils.fromWei(balance);
            const open = await contract.methods.open().call();

            let presaleOpen = false; // Temporary, presaleOpen is not working
            try {
                presaleOpen = await contract.methods.presaleOpen().call();
            } catch (err) {
                //console.log(err);
            }

            const maxPerMint = await contract.methods.maxPerMint().call();
            const cost = await contract.methods.cost().call();
            const costInEth = window.web3.utils.fromWei(cost);
            const supply = await contract.methods.supply().call();
            const totalSupply = await contract.methods.totalSupply().call();
            const owner = await contract.methods.owner().call();

            let baseTokenUri = '';
            try {
                baseTokenUri = await contract.methods.baseTokenURI().call();
            } catch (e) {
                baseTokenUri = 'Error fetching URI';
            }

            setContractVarsState(true);

            const state = {
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

            console.log({ state });

            return state;
        }

    };

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

    const payGeneratorWithEth = async (size, callback) => {
        try {
            const wc = walletController || initializeWalletController();
            await wc.loadWalletProvider('metamask'); // as we need to deduct ethereum
            const walletAddress = wc.state.address;

            const res = await getNonceByAddress({ variables: { address: walletAddress } });
            const nonce = res.data.getNonceByAddress;
            const signature = await wc.signNonce(walletType, nonce, walletAddress);

            if (!signature) throw new Error('User Rejected Login with Metamask');
            await verifySignature({ variables: { address: walletAddress, signature } });

            await compareNetwork('0x1', () => {
                const web3 = window.web3
                const inEth = 0.000034;
                const amount = inEth * size;

                web3.eth.sendTransaction({
                    from: walletAddress,
                    to: config.company.walletAddress,
                    value: web3.utils.toWei(amount.toFixed(7).toString(), "ether")
                }).on('transactionHash', () => {
                    setLoading(true);
                    addToast({
                        severity: 'info',
                        message: 'Sending transaction. This could take up to a minute...'
                    })
                }).once('confirmation', () => {
                    setLoading(false);
                    callback();
                }).on('error', () => {
                    addToast({ severity: 'error', message: 'Something went wrong! Please contact ambition support.' });
                    setLoading(false);
                });
            });
        }
        catch (err) {
            console.error(err);
            addToast({ severity: 'error', message: err.message });
            setLoading(false);
        }
    }

    const loadMetamaskWallet = () => {
        const wc = walletController || initializeWalletController();
        if (wc.state.wallet !== 'metamask') {
            wc.loadWalletProvider('metamask');
        }
    }

    return (
        <Web3Context.Provider
            value={{
                loginToWallet,
                payGeneratorWithEth,
                loadMetamaskWallet,
                initializeWalletController,
                mint,
                retrieveContract,
                checkOwner,
                presaleMint,
                getPrice,
                getMaximumSupply,
                getTotalMinted,

                getPublicContractVariables,
                contractVarsState,

                walletController,
                loading,
            }}>
            {children}
        </Web3Context.Provider>
    )
}
