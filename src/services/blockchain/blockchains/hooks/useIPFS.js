import config from 'config';
import basePathConverter from 'base-path-converter';
import axios from 'axios';
import { useState } from 'react';
import { useContract } from 'services/blockchain/provider';
import { useToast } from 'ds/hooks/useToast';
import { useAuth } from 'libs/auth';

export const useIPFS = () => {
    const {
        imagesUrl,
        setImagesUrl,
        metadataUrl,
        setMetadataUrl,
        ipfsUrl,
        setIpfsUrl,
        uploadedFiles,
        uploadedJson,
        setStart,
        setActiveStep,
        setError,
    } = useContract();
    const { addToast } = useToast();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const getIpfsUrl = (blockchain) => blockchain === 'solana' || blockchain === 'solanadevnet' && `https://gateway.pinata.cloud/ipfs/` || `ipfs://`;

    const pinImages = async (blockchain, callback) => {
        const folder = uploadedFiles;
        setStart(true);
        setLoading(true);
        setActiveStep(0);
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        const src = `./images`;

        addToast({
            severity: 'info',
            message:
                'Deploying images to IPFS... this may take a long time depending on your collection size',
        });

        let data = new FormData();
        for (let i = 0; i < folder.length; i++) {
            data.append('file', folder[i], `/assets/${folder[i].name}`);
        }

        //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
        //metadata is optional
        const metadata = JSON.stringify({
            name: user.id + '_assets',
        });

        data.append('pinataMetadata', metadata);

        const opt = {
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
                pinata_api_key: config.pinata.key,
                pinata_secret_api_key: config.pinata.secret,
            },
        };

        const ipfsUrl = getIpfsUrl(blockchain);

        try {
            const res = await axios.post(url, data, opt);
            setImagesUrl(res.data.IpfsHash);
            addToast({
                severity: 'success',
                message:
                    `Added images to IPFS under URL: ${ipfsUrl}` +
                    res.data.IpfsHash,
            });
        } catch (e) {
            addToast({
                severity: 'error',
                message: `Oops! something went wrong. Please try again!`,
            });
            setError(true);
            setLoading(false);
            console.log('Error: unable to pin images to pinata.cloud ', e);
            callback(false); // Error occured while pinning images to pinata.cloud
            return;
        }

        setLoading(false);
        callback(true); // images added successfully to pinata navigate to next step
    };

    const updateAndSaveJson = async (file, data, blockchain) => {
        return new Promise((resolve, reject) => {
            if (file.name !== 'metadata.json') {
                const fileReader = new FileReader();
                fileReader.onload = function (evt) {
                    // Parse JSON and modify
                    const jsonMetadata = JSON.parse(evt.target.result);
                    const tokenId = file.name.split('.')[0];
                    const fileExtension = jsonMetadata.properties?.files && jsonMetadata.properties?.files[0]?.type === 'image/webp' && 'webp'
                        || jsonMetadata.properties?.files && jsonMetadata.properties?.files[0]?.type === 'video/mp4' && 'mp4'
                        || 'png';

                    const ipfsUrl = getIpfsUrl(blockchain);

                    jsonMetadata.image = `${ipfsUrl}${imagesUrl}/${tokenId}.${fileExtension}`;

                    // Attach JSON to formdata
                    const metadataFile = new Blob([JSON.stringify(jsonMetadata)]);
                    data.append('file', metadataFile, `/metadata/${tokenId}.json`);

                    resolve(data);
                };
                fileReader.readAsText(file);
            } else {
                data.append('file', file, '/metadata/metadata.json');
                resolve(data);
            }
        });
    };

    const pinMetadata = async (blockchain, callback) => {
        const folder = uploadedJson;
        let data = new FormData();
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        setLoading(true);

        addToast({
            severity: 'info',
            message:
                'Deploying metadata to IPFS... this may take a long time depending on your collection size',
        });

        // Update metadata
        for (let i = 0; i < folder.length; i++) {
            await updateAndSaveJson(folder[i], data, blockchain);
        }

        const metadata = JSON.stringify({
            name: user.id + '_metadata',
        });

        data.append('pinataMetadata', metadata);

        const opt = {
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
                pinata_api_key: config.pinata.key,
                pinata_secret_api_key: config.pinata.secret,
            },
        };

        const ipfsUrl = getIpfsUrl(blockchain);

        try {
            const res = await axios.post(url, data, opt);
            addToast({
                severity: 'success',
                message:
                    `Added json metadata to IPFS under URL: ${ipfsUrl}` +
                    res.data.IpfsHash,
            });
            setIpfsUrl(`${ipfsUrl}${res.data.IpfsHash}/`);
            setMetadataUrl(res.data.IpfsHash);
        } catch (e) {
            addToast({
                severity: 'error',
                message: `Oops! something went wrong. Please try again!`,
            });
            setLoading(false);
            console.log('Error: unable to pin images to pinata.cloud ', e);
            callback(false); // Error occured while pinning metadata to pinata.cloud
            return;
        }

        setLoading(false);
        callback(true); // metadata added successfully to pinata navigate to next step
    };

    return {
        getIpfsUrl,
        pinMetadata,
        pinImages,
        loading,
    };
};
