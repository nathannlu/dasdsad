import { useState, useEffect } from 'react';
import { useWeb3 } from 'libs/web3';
import { useToast } from 'ds/hooks/useToast';

export const useContractDetails = (contractAddress, chainid, blockchain, renderError) => {
    const { addToast } = useToast();

    const [balance, setBalance] = useState(null);
    const [soldCount, setSoldCount] = useState(null);
    const [size, setSize] = useState(null);
    const [price, setPrice] = useState();
    const [isPresaleOpen, setIsPresaleOpen] = useState(false);
    const [isPublicSaleOpen, setIsPublicSaleOpen] = useState(false);
    const [max, setMax] = useState('');
    const [metadataUrl, setMetadataUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const { getPublicContractVariables } = useWeb3();

    useEffect(() => {
        (async () => await refresh())();
    }, [contractAddress]);

    const refresh = async () => {
        if (!contractAddress || !chainid) return;

        setLoading(true);

        const contractState = await getPublicContractVariables(contractAddress, chainid, blockchain);
        const isSolana = chainid.indexOf('solana') !== -1;
        
        if (contractState.error) {
            if (isSolana) {
                renderError(contractState.error);
            }

            addToast({ severity: 'error', message: 'Oops! unable to fetch contract details!' });
            return;
        }

        const {
            supply,
            maxSupply,
            totalSupply,
            costInEth,
            balanceInEth,
            presaleOpen,
            open,
            maxPerMint,
            baseTokenUri,
        } = contractState;

        setBalance(balanceInEth);
        setPrice(costInEth);
        setSoldCount(supply);
        setIsPresaleOpen(presaleOpen);
        setIsPublicSaleOpen(open);
        setMetadataUrl(baseTokenUri);
        setMax(maxPerMint);
        setSize(totalSupply);

        setLoading(false);
    };

    return {
        max,
        metadataUrl,
        balance,
        soldCount,
        price,
        size,
        isPresaleOpen,
        isPublicSaleOpen,
        loading,

        refresh,
    };
};
