import config from 'config';
import basePathConverter from 'base-path-converter';
import axios from 'axios'
import { useState } from 'react';
import { useContract } from 'services/blockchain/provider';
import { useToast } from 'ds/hooks/useToast';
import { useAuth } from 'libs/auth';

export const useIPFS = () => {
	const {
		imagesUrl, setImagesUrl,
		metadataUrl, setMetadataUrl,
		ipfsUrl, setIpfsUrl,
		uploadedFiles,
		uploadedJson,
		setStart,
		setActiveStep,
		setError
	} = useContract()
	const { addToast } = useToast();
	const { user } = useAuth();


	const pinImages = async () => {
		const folder = uploadedFiles
		setStart(true);
		setActiveStep(0);
		const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        const src = `./images`;

		addToast({
			severity: 'info',
			message: "Deploying images to IPFS... this may take a long time depending on your collection size"
		});

        let data = new FormData();
		for (let i = 0; i < folder.length; i++) {
			data.append('file', folder[i], `/assets/${folder[i].name}`)
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
				'pinata_api_key': config.pinata.key,
				'pinata_secret_api_key': config.pinata.secret
			}
		}

		try {
			const res = await axios.post(url,data,opt)
			setImagesUrl(res.data.IpfsHash)
			addToast({
				severity: 'success',
				message: 'Added images to IPFS under URL: ipfs//' + res.data.IpfsHash
			})
		} 
        catch(e) {
			addToast({
				severity: 'error',
				message: e.message
			});
			setError(true);
		}
	};

	const updateAndSaveJson = async (file, data) => {
		return new Promise((resolve, reject) => {

			if(file.name !=='metadata.json') {
				const fileReader = new FileReader();
				fileReader.onload = function ( evt ) {
					// Parse JSON and modify
					const jsonMetadata = JSON.parse(evt.target.result)
					const tokenId = file.name.split('.')[0]
					jsonMetadata.image = `ipfs://${imagesUrl}/${tokenId}.png`

					// Attach JSON to formdata
					const metadataFile = new Blob([JSON.stringify(jsonMetadata)])
					data.append('file', metadataFile, `/metadata/${tokenId}`)

					resolve(data)
				};
				fileReader.readAsText(file);

			} else {
				data.append('file', file, '/metadata/metadata')
				resolve(data)
			}
		})
	}

	const pinMetadata = async () => {
		const folder = uploadedJson;
        let data = new FormData();
		const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

		addToast({
			severity: 'info',
			message: "Deploying metadata to IPFS... this may take a long time depending on your collection size"
		});

		// Update metadata
		for (let i = 0; i < folder.length; i++) {
			await updateAndSaveJson(folder[i], data)
		}

        const metadata = JSON.stringify({
            name: user.id + '_metadata',
        });

		data.append('pinataMetadata', metadata);

		const opt = {
			maxBodyLength: 'Infinity',
			headers: {
				'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
				'pinata_api_key': config.pinata.key,
				'pinata_secret_api_key': config.pinata.secret
			}
		}

		try {
			const res = await axios.post(url, data, opt)
			addToast({
				severity: 'success',
				message: 'Added json metadata to IPFS under URL: ipfs://' + res.data.IpfsHash
			})
			setIpfsUrl('ipfs://' + res.data.IpfsHash + '/')
			setMetadataUrl(res.data.IpfsHash)
		} 
        catch(e) {
			addToast({
				severity: 'error',
				message: e.message 
			});
        };
	}


	return {
		pinMetadata,
		pinImages
	}


}
