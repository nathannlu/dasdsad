import { useState, useEffect } from 'react';
import { useWeb3 } from 'libs/web3';
import { useLocation } from 'react-router-dom';
import { useGetContract } from 'services/blockchain/gql/hooks/contract.hook';
import { useToast } from 'ds/hooks/useToast';

export const useEmbed = () => {
    const { addToast } = useToast();
    const { search } = useLocation();
    const { getPrice, getMaximumSupply, getTotalMinted, mint, getNetworkID, setNetwork, getContractState, getPresaleState, presaleMint } = useWeb3();
    const [contractAddress, setContractAddress] = useState('');
    const [chainId, setChainId] = useState('');
    const [price, setPrice] = useState(-1);
    const [maxSupply, setMaxSupply] = useState(-1);
    const [currentSupply, setCurrentSupply] = useState(-1);
    const [prefix, setPrefix] = useState('');
    const [isSwitch, setIsSwitch] = useState(true);
    const [isMinting, setIsMinting] = useState(false);
    const [contract, setContract] = useState(null);
    const [count, setCount] = useState(1);
    useGetContract({
        address: contractAddress,
        onCompleted: data => {
            setContract(data.getContract);
        },
        onError: err => addToast({
			severity: 'error',
			message: err.message
		})
    });

    // Get query params (ANOTHER CHECK WE COULD ADD IS IF THE CONTRACT ADDRESS IS DEPLOYED ON OUR WEBSITE)
    useEffect(() => {
        if (!search) return;
        const urlParams = new URLSearchParams(search);
        const contractAddress = urlParams.get('contract');
        const chainId = urlParams.get('chainId');
        setContractAddress(contractAddress);
        setChainId(chainId);
    }, [search])

    useEffect(() => {
        if (!chainId.length) return;

        // Check if chain ID is right
        if (getNetworkID() === chainId) {
            setIsSwitch(false);
        } else {
            setIsSwitch(true);
        }

        // Set Prefix for mint button
        if (chainId == '0x1' || chainId == '0x4') setPrefix('ETH');
        else if (chainId == '0x89' || chainId == '0x13881') setPrefix('MATIC');

        // Set price, supply for mint button
        (async () => {
            try {
                const price = await getPrice(contractAddress);
                setPrice(price);
                const cSupply = await getTotalMinted(contractAddress);
                setCurrentSupply(cSupply);
                const mSupply = await getMaximumSupply(contractAddress);
                setMaxSupply(mSupply);
            }
            catch (e) {
				console.log(e)
            }
		})()
    }, [chainId])

    const onMint = async () => {
        if (price == -1 || currentSupply == -1 || maxSupply  == -1 || !contract || count <= 0) return;

        if (getNetworkID() === chainId) {
            try {
                setIsMinting(true);

                // Check if public sale is open
                const isPublicSale = await getContractState(contractAddress);
                if (isPublicSale) {
                    await mint((price * count).toString(), contractAddress, count);
                    setIsMinting(false);
                    return;
                }

                // Check if pre sale is open
                const isPreSale = await getPresaleState(contractAddress);
                if (isPreSale) {
                    await presaleMint((price * count).toString(), contractAddress, contract.nftCollection.whitelist, count);
                    setIsMinting(false);
                }
            }
            catch (e) {
                setIsMinting(false);
                console.log(e)
            }
        } else {
            location.reload();
        }
    }

    const onSwitch = async () => {
        const res = await setNetwork(chainId);
        if (res === 'prompt_successful') {
            setIsSwitch(false);
        }
    }

	return {
        prefix, 
        price, 
        maxSupply, 
        currentSupply,
        isSwitch,
        isMinting,
        contract,
        count,
        setCount,
        onMint,
        onSwitch,
	}
}
