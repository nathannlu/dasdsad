import React, { useState, useEffect } from 'react';
import { useToast } from 'ds/hooks/useToast';
import { useParams } from 'react-router-dom';
import { useWeb3 } from 'libs/web3';

import { useIPFS } from 'services/blockchain/blockchains/hooks/useIPFS';
import { useS3 } from 'services/blockchain/blockchains/hooks/useS3';
import { ContractController, getWalletType } from '@ambition-blockchain/controllers';

export const useContractv2 = (contracts) => {
    const { addToast } = useToast();
	const { id } = useParams();
	const { walletController } = useWeb3();

    const { getResolvedImageUrlFromIpfsUri } = useIPFS();
    const { getResolvedImageUrlFromS3Uri } = useS3();

    const [contract, setContract] = useState(null);
    const [contractState, setContractState] = useState(null);
    const [contractController, setContractController] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // default

    const [unRevealedtNftImage, setUnRevealedtNftImage] = useState({ src: null, isLoading: true });
    const [revealedNftImage, setRevealedNftImage] = useState({ src: null, isLoading: true });

    const [nftPrice, setNftPrice] = useState({ currency: null, price: null });

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

    const init = async () => {
        const contract = contracts.find((c) => c.id === id);
        if (!contract) {
            return;
        }

        setContract(contract);

        // fetch revealed image
        fetchNftImageFromUri(contract?.nftCollection?.baseUri, 'revealed', contract.nftStorageType);

        // fetch unrevealed image
        fetchNftImageFromUri(contract?.nftCollection?.unRevealedBaseUri, 'unrevealed', contract.nftStorageType);

        await walletController?.loadWalletProvider(getWalletType(contract.blockchain));
        await walletController?.compareNetwork(contract?.blockchain, async (error) => {
            if (error) {
                addToast({ severity: 'error', message: error.message });
                return;
            }
        });

        setNftPrice(prevState => ({ ...prevState, currency: contract?.nftCollection?.currency, price: contract?.nftCollection?.price }));
        setIsLoading(false);

        console.log(contract, 'contract');

        if (contract.address) {
            const contractController = new ContractController(contract.address, contract.blockchain, contract.type);
            setContractController(contractController);

            console.log(contractController, 'contractController');

            const contractState = await contractController.populateContractInfo();
            console.log(contractState, 'contractState');

            setContractState(contractState);
        }
    }

    useEffect(() => {
        if (contracts.length) { init(); }
    }, [contracts]);

    return {
        setContract,
        setContractState,
        setContractController,
        setIsModalOpen,
        setIsLoading,
        setUnRevealedtNftImage,
        setRevealedNftImage,
        setNftPrice,
        contract,
        contractState,
        contractController,
        isModalOpen,
        isLoading,
        unRevealedtNftImage,
        revealedNftImage,
        nftPrice
    };
};
