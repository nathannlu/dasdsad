import { useState, useEffect } from 'react';
import { useWeb3 } from 'libs/web3';
import { useWebsite } from 'services/website/provider';
import { useLocation } from 'react-router-dom';

export const useEmbed = () => {
    const { website } = useWebsite();
    const { search } = useLocation();
    const { getPrice, getMaximumSupply, getTotalMinted, mint, getNetworkID, setNetwork } = useWeb3();
    const [price, setPrice] = useState(-1);
    const [maxSupply, setMaxSupply] = useState(-1);
    const [currentSupply, setCurrentSupply] = useState(-1);
    const [prefix, setPrefix] = useState('');
    const [chainId, setChainId] = useState('');
    const [isSwitch, setIsSwitch] = useState(true);
    const [isMinting, setIsMinting] = useState(false);

    // Load Chain ID, Price and Supply Count
    useEffect(() => {
        if (Object.keys(website).length == 0) return;
        const urlParams = new URLSearchParams(search);
        const chaindId = urlParams.get('chainId');
        setChainId(chaindId);
        if (chaindId == '0x1' || chaindId == '0x4') {
            setPrefix('ETH');
        }
        else if (chaindId == '0x89' || chaindId == '0x13881') {
            setPrefix('MATIC');
        }
        (async () => {
            try {
                const price = await getPrice(website.settings.connectedContractAddress);
                setPrice(price);
                const cSupply = await getTotalMinted(website.settings.connectedContractAddress);
                setCurrentSupply(cSupply);
                const mSupply = await getMaximumSupply(website.settings.connectedContractAddress);
                setMaxSupply(mSupply);
            }
            catch (e) {

            }
		})()
    }, [website])

    useEffect(() => {
        if (chainId.length == 0) return;
        if (getNetworkID() === chainId) {
            setIsSwitch(false);
        } else {
            setIsSwitch(true);
        }
    }, [chainId])

    const onMint = async () => {
        if (price == -1 || Object.keys(website).length == 0) return;
        if (getNetworkID() === chainId) {
            try {
                setIsMinting(true);
                await mint(price, website.settings.connectedContractAddress);
                setIsMinting(false);
            }
            catch (e) {
                setIsMinting(false);
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
        onMint,
        onSwitch,
	}
}
