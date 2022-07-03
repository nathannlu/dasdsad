import { useState, useRef } from 'react';

import config from 'config';
import basePathConverter from 'base-path-converter';
import axios from 'axios';
import posthog from 'posthog-js';

import { useToast } from 'ds/hooks/useToast';
import { MAX_UPLOAD_LIMIT, IMAGE_MIME_TYPES, METADATA_MIME_TYPES } from 'ambition-constants';

import { useUploadS3NftCollection, useDeleteS3NftCollection } from 'services/blockchain/gql/hooks/s3NftCollection.hook.js';

export const useS3 = (contractId) => {
    const interval = useRef(null);

    const [s3UploadPercentage, setS3UploadPercentage] = useState(0);

    const [uploadS3NftCollection] = useUploadS3NftCollection({
        onCompleted: data => {
            console.log(data);
            setS3UploadPercentage(100);
            clearInterval(interval.current);
            posthog.capture('User uploaded nft collection on aws s3 bucket successfully!');
        },
        onError: (e) => {
            clearInterval(interval.current);
            console.log(e);
            posthog.capture('Error! Uploading nft collection on aws s3 bucket!');
        }
    });

    const [deleteS3NftCollection] = useDeleteS3NftCollection({
        onCompleted: data => {
            console.log(data);
            // TOOD update the contract
            posthog.capture('Error! Nft collection on aws s3 bucket deleted successfully!');
        },
        onError: (e) => {
            console.log(e);
            posthog.capture('Error! Deleting nft collection on aws s3 bucket!');
        }
    });

    const startmockProgress = () => {
        interval.current = setInterval(() => setS3UploadPercentage(prevState => prevState + 5), 1000);
    }

    const deleteS3Collection = async () => {
        await deleteS3NftCollection({ variables: { contractId } });
    }

    /**
   * Creates folder for NFT collection on s3 bucket. This function pins a folder
   * to IPFS via Pinata API, then returns an object containing
   * IPFS urls (url, hash, gateway)
   *
   * @param traits - An array of File objects
   */
    const uploadTraitsToS3 = async (traits, collectionType) => {
        console.log(traits, collectionType);
        if (!traits)
            throw new Error('Error! File(s) to be uploaded not selected.');

        const collectionSize = traits.reduce((a, b) => a.size + b.size, 0);

        if (collectionSize > MAX_UPLOAD_LIMIT)
            throw new Error('Error! Max upload limit reached. Your files are larger than 25GB');

        startmockProgress();
        const response = await uploadS3NftCollection({ variables: { collection: traits, contractId, collectionType, type: 'traits' } });
        if (!response.data || !response.data.uploadS3NftCollection) {
            throw new Error('Error! Unable to upload nft collection.');
        }

        return response.data.uploadS3NftCollection;
    };


    /**
     * Pins NFT metadata folder to IPFS via Pinata API. Smart contracts will
     * look inside this folder and append the token ID (e.g. 1.json, 2.json)
     * to get the description, traits, and resolve the token image.
     * Returns object containing IPFS urls (url, hash, gateway)
     *
     * @param folder - An array of File objects
     * @param imageUrl - Resolved URI of images folder. Can either be ipfs url or gateway
     */

    const uploadMetadataToS3 = async (folder, collectionType, contract, traitsUrl) => {
        startmockProgress();

        const metadata = collectionType === 'unrevealed' ? generateUnrevealedImageMetadata(contract, traitsUrl) : await generateRevealedImageMetadata(folder, traitsUrl);
        console.log(metadata, 'uploadMetadataToS3');

        const response = await uploadS3NftCollection({ variables: { collection: metadata, contractId, collectionType, type: 'metadata' } });

        if (!response.data || !response.data.uploadS3NftCollection) {
            throw new Error('Error! Unable to upload nft collection.');
        }

        return response.data.uploadS3NftCollection;
    };

    const generateUnrevealedImageMetadata = (contract, unrevealedTraitsUrl) => {
        if (!contract) {
            throw new Error('Contract details missing! Cannot generate metadata. Please open at ticket in Discord for help.');
        }

        let metadataData = [];
        for (let i = 1; i <= contract.nftCollection.size; i++) {
            const jsonMetadata = {
                name: contract.name,
                description: `Unrevealed ${contract.name} NFT`,
                image: `${unrevealedTraitsUrl}/traits/`
            };

            const file = new File([new Blob([JSON.stringify(jsonMetadata)])], `${i}.json`, { type: "application/json", lastModified: new Date().getTime() })
            metadataData = [...metadataData, file];
        }

        return metadataData;
    };

    const generateRevealedImageMetadata = async (folder, traitsUrl) => {
        let metadataData = [];

        for (let i = 0; i < folder.length; i++) {
            const file = await appendUpdatedJson(folder[i], traitsUrl);
            metadataData = [...metadataData, file];
        }
        return metadataData;
    };

    const appendUpdatedJson = async (file, traitsUrl) => {
        return new Promise((resolve) => {
            if (file.name !== 'metadata.json') {
                const fileReader = new FileReader();
                fileReader.onload = function (evt) {
                    // Parse JSON and modify
                    const jsonMetadata = JSON.parse(evt.target.result);
                    const tokenId = file.name.split('.')[0];
                    const fileExtension = resolveFileExtension(jsonMetadata.properties?.files[0]?.type)

                    jsonMetadata.image = `${traitsUrl}/traits/${tokenId}.${fileExtension}`;

                    const file = new File([new Blob([JSON.stringify(jsonMetadata)])], `${tokenId}.json`, { type: "application/json", lastModified: new Date().getTime() });
                    resolve(file);
                };
                fileReader.readAsText(file);
            } else {
                resolve(file);
            }
        });
    };

    return {
        deleteS3Collection,
        uploadTraitsToS3,
        uploadMetadataToS3,
        s3UploadPercentage,
    };
};
