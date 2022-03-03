import { useState, useEffect } from "react";
import { useWeb3 } from "libs/web3";
import { useLocation } from "react-router-dom";
import { useGetContract } from "services/blockchain/gql/hooks/contract.hook";
import { useToast } from "ds/hooks/useToast";
import { useContractDetails } from "services/blockchain/pages/Contract/hooks/useContractDetails";

export const useEmbed = () => {
    const { addToast } = useToast();
    const { search } = useLocation();
    const { account, loadWeb3, loadBlockchainData, getNetworkID, compareNetwork, mint, presaleMint } = useWeb3();
    const [buttonState, setButtonState] = useState(0); // 0 Connect Wallet, 1 Mint, 2 Switch Network, 3 Locked
	const [contractAddress, setContractAddress] = useState('');
    const [chainId, setChainId] = useState('');
    const [bgImage, setBgImage] = useState('');
    const [textColor, setTextColor] = useState('');
    const [prefix, setPrefix] = useState('');
    const [isMinting, setIsMinting] = useState(false);
    const [mintCount, setMintCount] = useState(1);
    const [contract, setContract] = useState(null);
    const {
		max,
		metadataUrl,
		balance,
		soldCount,
		price,
		size,
		isPresaleOpen,
		isPublicSaleOpen,
	} = useContractDetails(contractAddress);

    useGetContract({
		address: contractAddress,
		onCompleted: data => {
			setContract(data.getContract);
		},
		onError: err => {
            console.log(err);
            addToast({
				severity: "error",
				message: err.message,
			})
        }	
	});

    // Load web3
    useEffect(() => {
        (async () => {
			await loadWeb3();
		})()
    }, [])

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

    }, [search])

    // Check if connected to wallet
    useEffect(() => {
        if (!account || !account.length) return;
        if (getNetworkID() !== chainId) setButtonState(2);
        else setButtonState(1);
    }, [account])

    // Check for network change
    useEffect(() => {
        if (!chainId || !chainId.length) return;
        (async () => {
            window.ethereum.on("chainChanged", async (_chainId) => {
                if (chainId !== _chainId) setButtonState(2);
                else setButtonState(1);
            });
		})();
    }, [chainId])

    // Connect to wallet
    const onConnectWallet = async () => {
        try {
            await loadBlockchainData();
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
    const onMint = async () => {
        try {
            if (!price || 
                !max || 
                !max.length || 
                !contractAddress || 
                !contractAddress.length || 
                !chainId || 
                !chainId.length ||
                mintCount <= 0 ||
                !contract) return;

            await compareNetwork(chainId, async () => {
                setIsMinting(true);
                
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
        setButtonState,
        onConnectWallet,
        onSwitch,
        onMint,
        setMintCount,

        contract,
        max,
		metadataUrl,
		balance,
		soldCount,
		price,
		size,
		isPresaleOpen,
		isPublicSaleOpen,
    }
}