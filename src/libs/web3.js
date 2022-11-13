import React, { useState, useEffect, useContext, createContext } from 'react';
import Web3 from 'web3/dist/web3.min';
import config from '../config';
import posthog from 'posthog-js';
import { WalletController } from '@ambition-blockchain/controllers';

import NFTCollectible from 'services/blockchain/blockchains/ethereum/abis/ambitionNFTPresale.json';

import { useToast } from 'ds/hooks/useToast';
import { useAnalytics } from 'libs/analytics';

import {
    useGetNonceByAddress,
    useVerifySignature,
    useVerifySignaturePhantom,
} from 'gql/hooks/users.hook';

import { useLoginForm } from '../components/pages/Auth/hooks/useLoginForm';

import { loadCandyProgramV2, getBalance } from 'solana/helpers/accounts';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
export const Web3Context = createContext({});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
    const [walletController, setWalletController] = useState(new WalletController());
    const [loading, setLoading] = useState(false);
    const [walletState, setWalletState] = useState({
		walletType: null,
		walletAddress: null,
	});
	const { trackUserLoggedIn } = useAnalytics();

    const [contractVarsState, setContractVarsState] = useState(false);

    const { addToast } = useToast();
    const { handleLoginSuccess } = useLoginForm();

    const [getNonceByAddress] = useGetNonceByAddress({});

    const [verifySignature] = useVerifySignature({
        onCompleted: async (data) => {
            const walletAddress = walletController?.state.address;
//            posthog.capture('User logged in with metamask', { $set: { publicAddress: walletAddress } });
						trackUserLoggedIn('metamask')

            window.localStorage.setItem('ambition-wallet', 'metamask');
            await handleLoginSuccess();
        },
    });

    const [verifySignaturePhantom] = useVerifySignaturePhantom({
        onCompleted: async (data) => {
            const walletAddress = walletController?.state.address;
//            posthog.capture('User logged in with phantom', { $set: { publicAddress: walletAddress } });
						trackUserLoggedIn('phantom')

            window.localStorage.setItem('ambition-wallet', 'phantom');
            await handleLoginSuccess();
        },
    });

    const init = async () => {
        const curentWalletType = window.localStorage.getItem('ambition-wallet');
        console.log(curentWalletType, '==>curentWalletType<===');
        if (curentWalletType) {
            await walletController.loadWalletProvider(curentWalletType);
        }
    }

    // on load
    useEffect(() => { init(); }, []);

    const loginToWallet = async (walletType) => {
        try {
            await walletController.loadWalletProvider(walletType);
            const walletAddress = walletController.state.address;

            const res = await getNonceByAddress({ variables: { address: walletAddress } });
            const nonce = res.data.getNonceByAddress;
            const signature = await walletController.signNonce(walletType, nonce, walletAddress);

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

    const checkOwner = async (id, contractAddress) => {
        const contract = await retrieveContract(contractAddress);
        const owner = await contract.methods.ownerOf(id).call();
        return owner;
    };

    const getPublicContractVariables = async (contractAddress, chainid, env) => {
        if (!contractAddress || !chainid) return;

        if (chainid.indexOf('solana') != -1) {
            // If Solana Contract
            setContractVarsState(false);

            await walletController.loadWalletProvider('phantom');

            const contract = await retrieveSolanaContract(contractAddress, chainid, env);
            if (contract.error) {
                return contract;
            }

            const balance = (await getBalance(new PublicKey(contractAddress), env) / LAMPORTS_PER_SOL);
            setContractVarsState(true);

            return {
                balanceInEth: balance,
                totalSupply: contract.itemsAvailable,
                supply: contract.itemsRedeemed,
                costInEth: contract.price,
                baseTokenUri: contract.metadataUrl,
                open: contract.publicSale,
                presaleOpen: contract.presale,
                creators: contract.creators
            };

        } else {
            // If Metamask Contract
            setContractVarsState(false);

            await walletController.loadWalletProvider('metamask');
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

    const retrieveSolanaContract = async (candyMachineAddress, chain, env) => {
        if (env == 'solanadevnet') {
            env = 'devnet';
        } else if (env == 'solana') {
            env = 'mainnet';
        }

        const anchorProgram = await loadCandyProgramV2(null, env);

        try {
            const candyMachineObj = await anchorProgram.account.candyMachine.fetch(candyMachineAddress);

            const itemsAvailable = candyMachineObj.data.itemsAvailable.toNumber();
            const itemsRedeemed = candyMachineObj.itemsRedeemed.toNumber();
            const itemsRemaining = itemsAvailable - itemsRedeemed;
            const price = candyMachineObj.data.price.toNumber() / LAMPORTS_PER_SOL;
            const metadataUrl = candyMachineObj.data.hiddenSettings.uri;
            const goLiveDateEpoch = candyMachineObj.data.goLiveDate.toNumber();
            const whiteListSettings = candyMachineObj.data.whitelistMintSettings;
            const currDate = Date.now();
            let goLiveDate = new Date(0);
            goLiveDate.setUTCSeconds(goLiveDateEpoch);

            const presale = (whiteListSettings == null) ? 0 : 1;
            const publicSale = (goLiveDate >= currDate) ? 0 : 1;
            console.log(whiteListSettings);

            const creators = candyMachineObj.data.creators.map(c => ({ address: c.address.toString(), share: c.share }));

            return {
                itemsRedeemed,
                price,
                itemsAvailable,
                itemsRemaining,
                metadataUrl,
                publicSale,
                presale,
                creators
            };
        } catch (e) {
            console.log(e, 'Error! retrieveSolanaContract');

            return {
                error: e.message === `Account does not exist ${candyMachineAddress}` && `This contract has been closed and withdrawn!` || e.message
            }
        }
    }

    const retrieveContract = (contractAddress) => {
        const web3 = window.web3;
        if (web3?.eth) {
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

    /*
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
*/

    const payGeneratorWithEth = async (size, callback) => {
        try {
            await walletController?.loadWalletProvider('metamask'); // as we need to deduct ethereum
            const walletAddress = walletController?.state.address;
            const walletType = walletController?.state.wallet;

            const res = await getNonceByAddress({ variables: { address: walletAddress } });
            const nonce = res.data.getNonceByAddress;
            const signature = await walletController?.signNonce(walletType, nonce, walletAddress);

            if (!signature) throw new Error('User Rejected Login with Metamask');
            await verifySignature({ variables: { address: walletAddress, signature } });

            await walletController?.compareNetwork('ethereum', async (e) => {
                if (e) {
                    addToast({ severity: "error", message: e.message });
                    return;
                }
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
                }).on('error', (e) => {
                    addToast({ severity: 'error', message: e.message });
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

    const encodeConstructor = async (contract) => {
        const web3 = window.web3
        const structs = ["string", "string", "uint256"]
        const args = [contract.name, contract.symbol, contract.nftCollection.size]

        const encodedConstructor = await web3.eth.abi.encodeParameters(structs, args)

        return encodedConstructor.slice(2);
    }

    return (
        <Web3Context.Provider
            value={{
                loginToWallet,
                payGeneratorWithEth,
                retrieveContract,
                walletState,
                setWalletState,
                //                checkOwner,
                getPrice,
                //                getMaximumSupply,
                //              getTotalMinted,
                //                contractVarsState,
                getPublicContractVariables,
                walletController,
                loading,
                encodeConstructor
            }}>
            {children}
        </Web3Context.Provider>
    )
}
