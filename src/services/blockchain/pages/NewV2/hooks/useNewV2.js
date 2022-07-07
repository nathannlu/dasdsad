import React, { useEffect, useState } from 'react';

import { useWeb3 } from 'libs/web3';
import { useToast } from 'ds/hooks/useToast';

import { isTestnetBlockchain, getMainnetBlockchainType, getWalletType, getBlockchainType } from '@ambition-blockchain/controllers';
import { useIPFS } from 'services/blockchain/blockchains/hooks/useIPFS';
import { useS3 } from 'services/blockchain/blockchains/hooks/useS3';
import { useDeployContractForm } from './useDeployContractForm';

export const useNewV2 = (contract) => {
    const { getResolvedImageUrlFromIpfsUri } = useIPFS();
    const { getResolvedImageUrlFromS3Uri } = useS3();
    const { walletController } = useWeb3();
    const { addToast } = useToast();
    const {
        contractState,
        activeBlockchain,
        setActiveBlockchain,
        setIsTestnetEnabled,
        setContractState,
        setDeployContractFormState,
    } = useDeployContractForm();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [unRevealedtNftImage, setUnRevealedtNftImage] = useState({ src: null, isLoading: true });
    const [revealedNftImage, setRevealedNftImage] = useState({ src: null, isLoading: true });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const nftPrice = { currency: contractState?.nftCollection?.currency, price: contractState?.nftCollection?.price };

    /**
     * @param {*} uri baseuri of revealed or unrevealed images
     * @param {*} type revealed or unrevealed
     */
    const fetchNftImageFromUri = async (uri, type, nftStorageType) => {
        try {
            if (!uri) {
                throw new Error(`fetchNftImageFromUri: ipfs uri undefined for ${type} collection.`);
            }
            type === 'revealed' ? setRevealedNftImage(prevState => ({ ...prevState, isLoading: true })) : setUnRevealedtNftImage(prevState => ({ ...prevState, isLoading: true }));
            const src = nftStorageType === 's3' ? await getResolvedImageUrlFromS3Uri(uri) : await getResolvedImageUrlFromIpfsUri(uri);
            type === 'revealed' ? setRevealedNftImage(prevState => ({ ...prevState, src, isLoading: false })) : setUnRevealedtNftImage(prevState => ({ ...prevState, src, isLoading: false }));
        } catch (e) {
            console.log('Error fetchUnrevealedImageSrc:', e);
            type === 'revealed' ? setRevealedNftImage(prevState => ({ ...prevState, src: null, isLoading: false })) : setUnRevealedtNftImage(prevState => ({ ...prevState, src: null, isLoading: false }));
        }
    }

    useEffect(() => {
        if (activeBlockchain === 'solana') {
            setIsDialogOpen(true);
        }
    }, [activeBlockchain]);

    useEffect(() => {
        const uri = contractState?.nftCollection?.baseUri || contract?.nftCollection?.baseUri;
        const nftStorageType = contractState?.nftStorageType || contract?.nftStorageType;
        fetchNftImageFromUri(uri, 'revealed', nftStorageType);
    }, [contract?.nftCollection?.baseUri, contractState.nftCollection.baseUri]);

    useEffect(() => {
        const uri = contractState.nftCollection.unRevealedBaseUri || contract?.nftCollection?.unRevealedBaseUri;
        const nftStorageType = contractState?.nftStorageType || contract?.nftStorageType;
        fetchNftImageFromUri(uri, 'unrevealed', nftStorageType);
    }, [contract?.nftCollection?.unRevealedBaseUri, contractState.nftCollection.unRevealedBaseUri]);

    const setContractStateForEditMode = async () => {
        const blockchain = contract?.blockchain || getBlockchainType(activeBlockchain, isTestnetBlockchain);

        // initiate wallet controller connection
        await walletController?.loadWalletProvider(getWalletType(blockchain));
        await walletController?.compareNetwork(blockchain, async (error) => {
            if (error) {
                addToast({ severity: 'error', message: error.message });
                return;
            }
        });

        if (contract) {
            setContractState(contract);

            setDeployContractFormState(prevState => ({ ...prevState, name: { ...prevState.name, value: contract?.name || '' } }));
            setDeployContractFormState(prevState => ({ ...prevState, symbol: { ...prevState.symbol, value: contract?.symbol || '' } }));
            setDeployContractFormState(prevState => ({ ...prevState, maxSupply: { ...prevState.maxSupply, value: contract?.nftCollection?.size || '' } }));
            setDeployContractFormState(prevState => ({ ...prevState, price: { ...prevState.price, value: contract?.nftCollection?.price || '' } }));

            setActiveBlockchain(getMainnetBlockchainType(contract?.blockchain));
            setIsTestnetEnabled(isTestnetBlockchain(contract?.blockchain));
        }
    }

    useEffect(() => { setContractStateForEditMode(); }, []);

    return {
        setIsModalOpen,
        setUnRevealedtNftImage,
        setRevealedNftImage,
        setIsDialogOpen,
        isModalOpen,
        unRevealedtNftImage,
        revealedNftImage,
        isDialogOpen,
        nftPrice,
    }
}