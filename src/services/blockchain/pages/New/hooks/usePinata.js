import { useState } from 'react';
import axios from 'axios';
import config from 'config';
import basePathConverter from 'base-path-converter';
import { useToast } from 'ds/hooks/useToast';

import { useContract } from 'services/blockchain/provider';

export const usePinata = () => {
	const { 
		uploadedFiles, 
		setUploadedFiless,
		uploadedJson,
		setUploadedJson,
		imagesUrl,
		setImagesUrl,
		metadataUrl,
		setMetadataUrl,
		ipfsUrl,
		setIpfsUrl
	} = useContract();

	const { addToast } = useToast();
//	const [updatedMetadata, setUpdatedMetadata] = useState([]);

	const pinFolderToIPFS = async (folder) => {
		const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const src = './images';

    let data = new FormData();
		for (let i = 0; i < folder.length; i++) {
			data.append('file', folder[i], basePathConverter(src, folder[i].path))
		}

    //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
    //metadata is optional
    const metadata = JSON.stringify({
			name: 'assets',
    });
		data.append('pinataMetadata', metadata);


		await axios.post(url,
			data,
			{
				maxBodyLength: 'Infinity',
				headers: {
					'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
					'pinata_api_key': config.pinata.key,
					'pinata_secret_api_key': config.pinata.secret
				}
			}
    ).then(function (response) {
			setImagesUrl(response.data.IpfsHash)
			addToast({
				severity: 'success',
				message: 'Added images to IPFS under URL: https://ipfs.io/ipfs/' + response.data.IpfsHash
			})

			// Generate the metadata and also upload it to IPFS

        //handle response here
    }).catch(function (error) {
			console.log(error)
        //handle error here
    });
	};


	// Updates metadata with base image url
	const updateMetadata = async (folder) => {
		for (let i = 0; i < folder.length; i++) {
			const fileReader = new FileReader();
			fileReader.onload = function ( evt ) { 
				const jsonMetadata = JSON.parse(evt.target.result)
				jsonMetadata.image = `https://ipfs.io/ipfs/${imagesUrl}/${jsonMetadata.properites.files[0].uri}`
				setUpdatedMetadata(prevState => {
					return [...prevState, jsonMetadata]
				})

				console.log('loop',i)
			};
			await fileReader.readAsText(folder[i]);
		}
	}


	const updateAndSaveJson = async (file, data) => {
		return new Promise((resolve, reject) => {
			if(file.name !=='metadata.json') {
				const fileReader = new FileReader();
				fileReader.onload = function ( evt ) {
					// Parse JSON and modify
					const jsonMetadata = JSON.parse(evt.target.result)
					jsonMetadata.image = `https://ipfs.io/ipfs/${imagesUrl}/${jsonMetadata.properites.files[0].uri}`

					// Attach JSON to formdata
					const metadataFile = new Blob([JSON.stringify(jsonMetadata)])
					data.append('file', metadataFile, `/metadata/${file.name}`)

					resolve(data)
				};
				fileReader.readAsText(file);

			} else {
				data.append('file', file, '/metadata/metadata.json')
				resolve(data)
			}
		})
	}

	
	const pinMetadataToIPFS = async (folder) => {
    let data = new FormData();
		const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;


		// Update metadata
		for (let i = 0; i < folder.length; i++) {
			await updateAndSaveJson(folder[i], data)
		}

    const metadata = JSON.stringify({
			name: 'metadata',
    });
		data.append('pinataMetadata', metadata);




		await axios.post(url,
			data,
			{
				maxBodyLength: 'Infinity',
				headers: {
					'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
					'pinata_api_key': config.pinata.key,
					'pinata_secret_api_key': config.pinata.secret
				}
			}
    ).then(function (response) {
			setIpfsUrl(response.data.IpfsHash)
			addToast({
				severity: 'success',
				message: 'Added json metadata to IPFS under URL: https://ipfs.io/ipfs/' + response.data.IpfsHash
			})

			// Generate the metadata and also upload it to IPFS

        //handle response here
    }).catch(function (error) {
			console.log(error)
        //handle error here
    });

		// Set smart contract baseURI to JSON IPFS URL

	}
	
	return {
		pinFolderToIPFS,
		updateMetadata,
		pinMetadataToIPFS
	}
};
