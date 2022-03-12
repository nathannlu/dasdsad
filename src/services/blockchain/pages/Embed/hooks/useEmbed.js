import { useState, useEffect } from "react";
import { useWeb3 } from "libs/web3";
import { useLocation } from "react-router-dom";
import { useGetContract } from "services/blockchain/gql/hooks/contract.hook";
import { useToast } from "ds/hooks/useToast";
import { useContractDetails } from "services/blockchain/pages/Contract/hooks/useContractDetails";
import { mintV2 } from 'solana/helpers/mint.js';

export const useEmbed = () => {
    const { addToast } = useToast();
    const { search } = useLocation();
    const { account, loadWalletProvider, loginToWallet, getNetworkID, compareNetwork, mint, presaleMint, contractVarsState } = useWeb3();
    const [buttonState, setButtonState] = useState(0); // 0 Connect Wallet, 1 Mint, 2 Switch Network, 3 Locked
	const [contractAddress, setContractAddress] = useState('');
    const [chainId, setChainId] = useState('');
    const [bgImage, setBgImage] = useState('');
    const [textColor, setTextColor] = useState('');
    const [prefix, setPrefix] = useState('');
    const [isMinting, setIsMinting] = useState(false);
    const [mintCount, setMintCount] = useState(1);
    const [contract, setContract] = useState(null);
    const [chooseWalletState, setChooseWalletState] = useState(false);
    const {
		max,
		metadataUrl,
		balance,
		soldCount,
		price,
		size,
		isPresaleOpen,
		isPublicSaleOpen,
	} = useContractDetails(contractAddress, chainId);

    // Get contract and load metamask or phantom
    useGetContract({
		address: contractAddress,
		onCompleted: async data => {
            const c = data.getContract;
			setContract(c);
            if (chainId.indexOf('solana') != -1) { // If solana
                await loadWalletProvider('phantom');
                console.log('loaded phantom provider')
            }
            else {
                await loadWalletProvider('metamask');
                console.log('loaded metamask provider')
            }
		},
		onError: err => {
            console.log(err);
            addToast({
				severity: "error",
				message: err.message,
			})
        }	
	});

    // Get all query params
    useEffect(() => {
        if (!search) return;

        const urlParams = new URLSearchParams(search);

        const a = urlParams.get("contract");
		const b = urlParams.get("chainId");
		const c = urlParams.get("bgImage");
		const d = urlParams.get("color");

        a && setContractAddress(a);
		b && setChainId(b);
        c && setBgImage(c);
		d && setTextColor(d);

        if (b === "0x1" || b === "0x4") setPrefix("ETH");
		else if (b === "0x89" || b === "0x13881") setPrefix("MATIC");
        else if (b === "solana") setPrefix("SOL");

    }, [search])

    // Check if connected to wallet
    useEffect(() => {
        if (!account || !account.length) return;
        if (getNetworkID() !== chainId && chainId != 'solana') setButtonState(2);
        // else setButtonState(1);
    }, [account])

    // Check for network change
    useEffect(() => {
        if (!chainId || !chainId.length) return;
        (async () => {
            window.ethereum.on("chainChanged", async (_chainId) => {
                if (chainId !== _chainId && _chainId != 'solana') setButtonState(2);
                // else setButtonState(1);
            });
		})();
    }, [chainId])

    // Connect to wallet
    const onConnectWallet = async (type = 0) => {
        try {
            if (type === 0) { // Metamask
                //await loginToWallet('metamask'); // dont need this
                console.log('loaded metamask account')
                setButtonState(1);
            }
            else if (type === 1) { // Phantom
               // await loginToWallet('phantom'); // dont need this
                console.log('loaded phantom account')
                setButtonState(1);
            }
        }
        catch (e) {
            console.log(e);
            addToast({
				severity: "error",
				message: err.message,
			})
        }
    }

    // Switch Networks
    const onSwitch = async () => {
        try {
            if (!chainId || !chainId.length) throw new Error('Switch Button, cannot find chain Id');

            await compareNetwork(chainId, () => {
                setButtonState(1);
            })
        }
        catch (e) {
            console.log(e);
            addToast({
				severity: "error",
				message: err.message,
			})
        }
    }

    // Mint NFT
    const onMint = async (walletType = 0) => {
        try {
            // if (!price || 
            //     !max || 
            //     !max.length || 
            //     !contractAddress || 
            //     !contractAddress.length || 
            //     !chainId || 
            //     !chainId.length ||
            //     mintCount <= 0 ||
            //     !contract) return;
            
            if (!contract) throw new Error('Cannot find contract');
            if (!account) throw new Error('Cannot find account');
            if (!contractAddress.length) throw new Error('Cannot find contract address');
            if (!chainId.length) throw new Error('Cannot find chain id');

            await compareNetwork(chainId, async () => {
                setIsMinting(true);
                
                if (chainId.indexOf('solana') != -1) { // Phantom
                    console.log("minting solana")
                    await mintV2(contract.blockchain == 'solanadevnet' ? 'testnet' : 'mainnet', contract.address, account);
                    setIsMinting(false);
                }
                else { // Metamask
                    if (isPublicSaleOpen) {
                        await mint(contractAddress, mintCount);
                        setIsMinting(false);
                    } else if (isPresaleOpen) {
                        await presaleMint(
                            (price * mintCount).toString(),
                            contractAddress,
                            contract.nftCollection.whitelist,
                            mintCount
                        );
                        setIsMinting(false);
                    } else {
                        throw new Error('Public sale and Presale is not open');
                    }
                }
            })
        }
        catch (err) {
            setIsMinting(false);
            console.log(e);
            addToast({
				severity: "error",
				message: err.message,
			})
        }
    }

    return {
        buttonState,
        textColor,
        bgImage,
        prefix,
        isMinting,
        mintCount,
        chooseWalletState,
        setButtonState,
        onConnectWallet,
        onSwitch,
        onMint,
        setMintCount,
        setChooseWalletState,

        contract,
        max,
		metadataUrl,
		balance,
		soldCount,
		price,
		size,
		isPresaleOpen,
		isPublicSaleOpen,

        account,
        contractVarsState,
        chainId,
    }
}