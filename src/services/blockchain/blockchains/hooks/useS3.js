import { useState, useRef } from 'react';

import posthog from 'posthog-js';

import { MAX_UPLOAD_LIMIT, resolveFileExtension } from 'ambition-constants';

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
     * to AWS S3 bucket, then returns url
     * 
     * upload traits: png or video files
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

        // find the 
        const fileExtension = resolveFileExtension(traits[0].type);

        const response = await uploadS3NftCollection({ variables: { collection: traits, contractId, collectionType, type: 'traits' } });
        if (!response.data || !response.data.uploadS3NftCollection) {
            throw new Error('Error! Unable to upload nft collection.');
        }

        return { traitsUrl: `${response.data.uploadS3NftCollection}/traits`, fileExtension };
    };

    /**
     * Creates folder for NFT collection on s3 bucket. This function pins a folder
     * to AWS S3 bucket, then returns url
     * 
     * upload metadata: json files
     *
     * @param folder - An array of File objects
     * @param imageUrl - Resolved URI of images folder. Can either be ipfs url or gateway
     */

    const uploadMetadataToS3 = async (folder, collectionType, contract, traitsUrl, fileExtension) => {
        startmockProgress();

        const metadata = collectionType === 'unrevealed' ? generateUnrevealedImageMetadata(contract, traitsUrl, fileExtension) : await generateRevealedImageMetadata(folder, traitsUrl);
        console.log(metadata, 'uploadMetadataToS3');

        const response = await uploadS3NftCollection({ variables: { collection: metadata, contractId, collectionType, type: 'metadata' } });

        if (!response.data || !response.data.uploadS3NftCollection) {
            throw new Error('Error! Unable to upload nft collection.');
        }

        return `${response.data.uploadS3NftCollection}/metadata`;
    };

    const generateUnrevealedImageMetadata = (contract, unrevealedTraitsUrl, fileExtension) => {
        if (!contract) {
            throw new Error('Contract details missing! Cannot generate metadata. Please open at ticket in Discord for help.');
        }

        let metadataData = [];
        for (let i = 1; i <= contract.nftCollection.size; i++) {
            const jsonMetadata = {
                name: contract.name,
                description: `Unrevealed ${contract.name} NFT`,
                image: `${unrevealedTraitsUrl}/${i}.${fileExtension}`
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
                    const fileExtension = resolveFileExtension(jsonMetadata.properties?.files[0]?.type);

                    jsonMetadata.image = `${traitsUrl}/${tokenId}.${fileExtension}`;

                    const file = new File([new Blob([JSON.stringify(jsonMetadata)])], `${tokenId}.json`, { type: "application/json", lastModified: new Date().getTime() });
                    resolve(file);
                };
                fileReader.readAsText(file);
            } else {
                resolve(file);
            }
        });
    };

    /** 
     * saved bucket uri in BE
     * - <user_id>/<contract_id>/revealed/
     * - <user_id>/<contract_id>/unrevealed/
     * 
     * Revealed
     * - traits url: <user_id>/<contract_id>/revealed/traits/<file_name>
     * - metadata url: <user_id>/<contract_id>/revealed/metadata</file_name>
     * 
     * UnRevealed
     * - traits url: <user_id>/<contract_id>/unrevealed/traits/<file_name>
     * - metadata url: <user_id>/<contract_id>/unrevealed/metadata</file_name>
     */

    const getResolvedImageUrlFromS3Uri = async (metadataUrl) => {
        try {
            const url = `${metadataUrl}/1.json`;
            const fetchResponse = await fetch(url);
            const json = await fetchResponse.json();

            if (!json?.image) {
                throw new Error('image field missing!');
            }

            return json?.image;
        } catch (e) {
            console.log('Error fetchImageSrc:', e);
            return null;
        }
    }

    return {
        deleteS3Collection,
        uploadTraitsToS3,
        uploadMetadataToS3,
        s3UploadPercentage,
        getResolvedImageUrlFromS3Uri
    };
};
