import config from 'config';
import axios from 'axios';
import { useState } from 'react';
import { MAX_UPLOAD_LIMIT, resolveFileExtension } from 'ambition-constants';

const NFT_STORAGE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDU0NmY2ODBFQ0RhOTcxYzU5NzI3YzE2Mjk3NTBmN2I4MjVkQjBlRjIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2Mjg1MTQ2NTgxOSwibmFtZSI6ImFtYml0aW9uIn0.IKGxAha5zYXnFBZTrx_21LXCeFpk9Y4u9XENcKyvMPE'

import { NFTStorage, File as NFTFile } from 'nft.storage'

const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`; // Pinata API url

export const useIPFS = () => {
	const [pinataUploadPercentage, setPinataUploadPercentage] = useState(0);

	/**
	 * Pins an image via Pinata API. Returns object containing 
	 * IPFS urls (url, hash, gateway)
	 *
	 * @param image - Array len 1 with a File object
	 */
	const pinUnrevealedImage = async (images) => {
		// Checks
		if (!images)
			throw new Error('Error! File to be uploaded not selected.');

		if (images[0].size > MAX_UPLOAD_LIMIT)
			throw new Error(
				'Error! Max upload limit reached. Your files are larger than 25GB'
			);

		console.log(images[0])
//		images[0].name = 'unrevealed.png'

		// Formatting image support
		const file = new File([images[0]], 'unrevealed.png', { type: 'image/png'});

		console.log(file)
		
		const cid = await uploadToNftStorage([file])
		console.log('cid', cid)
		return withIpfsUrls(cid);
	};

	/**
	 * Generate and pin metadata for unrevealed NFTs. This function
	 * is responsible for creating individual token metadata that
	 * points to a placeholder image. Returns object containing 
	 * IPFS urls (url, hash, gateway)
	 *
	 * @param contract - Used to reflect name, description, and collection size
	 * @param unrevealedImageUrl - Ipfs or gateway url to unrevealed image
	 */
	const generateUnrevealedImageMetadata = async (contract, unrevealedImageUrl) => {
		if (!contract) {
			throw new Error('Cannot generate metadata. Please open at ticket in Discord for help')
		}

		// Generate metadata files for unrevealed image with data
		// from contract obj (saved in db)
		let metadataData = new FormData();
		let collectionMetadata = [];

		console.log('jeep', collectionMetadata)
		for (let i = 1; i < contract.nftCollection.size + 1; i++) {
			const jsonMetadata = {
				name: contract.name,
				description: `Unrevealed ${contract.name} NFT`,
				image: unrevealedImageUrl + 'unrevealed.png'
			};

			const metadataFile = new File([
				JSON.stringify(jsonMetadata),
			], `${i}.json`, {type: 'application/json'});

			collectionMetadata.push(metadataFile);
		}

		console.log('asd', collectionMetadata)

		const cid = await uploadToNftStorage(collectionMetadata)
		return withIpfsUrls(cid);
	};

    /**
     * Get the size of a form data object in bytes
     * 
     * @param formData - form data that contains file names
     * @returns size of the form data in bytes
     */
    const getFormDataSize = (formData) => [...formData].reduce((size, [name, value]) => size + (typeof value === 'string' ? value.length : value.size), 0);

	/**
	 * Creates location for NFT images. This function pins a folder
	 * to IPFS via Pinata API, then returns an object containing
	 * IPFS urls (url, hash, gateway)
	 *
	 * @param folder - An array of File objects
	 */
	const pinImages = async (folder) => {
		const cid = await uploadToNftStorage(folder)
		// Check formdata is not larger than 25gb
		/*
        const GB_25_IN_BYTES = 26843545599.999958;
        if (getFormDataSize(data) > GB_25_IN_BYTES) throw new Error('Form data must not be larger than 25 gb');
				*/


		// On success
		return withIpfsUrls(cid);

		/*
		throw new Error('Oops! something went wrong. Please try again!')
		*/
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
	const pinMetadata = async (folder, imageUrl) => {
		// Update metadata and append to formdata
		let collectionMetadata = [];
		for (let i = 0; i < folder.length; i++) {
			await appendUpdatedJson(folder[i], collectionMetadata, imageUrl);
		}

		console.log(collectionMetadata)
		const cid = await uploadToNftStorage(collectionMetadata)
		return withIpfsUrls(cid)

		/*
		throw new Error('Oops! something went wrong. Please try again!')
		*/
	};

	/**
	 * Default options for uploading to Pinata
	 * with Axios
	 */
	let opt = (formData) => ({
		maxBodyLength: 'Infinity',
		headers: {
			'Content-Type': `multipart/form-data; boundary= ${formData._boundary}`,
			pinata_api_key: config.pinata.key,
			pinata_secret_api_key: config.pinata.secret,
		},
		onUploadProgress: (progressEvent) => {
			const percentage =
				(progressEvent.loaded / progressEvent.total) * 100;
			setPinataUploadPercentage(percentage);
		},
	});

	/**
	 * Generates different URLs for accessing ipfs location.
	 */
	const withIpfsUrls = (hash) => ({
		url: `ipfs://${hash}/`,
//		gateway: `https://gateway.pinata.cloud/ipfs/${hash}/`,
		gateway: `https://${hash}.ipfs.nftstorage.link/`,
		hash,
	});

	/**
	 * Update a metadata file, pointing "image" property
	 * to the correct IPFS url where the NFT image is hosted.
	 */
	const appendUpdatedJson = async (file, data, ipfsUrl) => {
		return new Promise((resolve, reject) => {
			if (file.name !== 'metadata.json') {
				const fileReader = new FileReader();
				fileReader.onload = function (evt) {
					// Parse JSON and modify
					const jsonMetadata = JSON.parse(evt.target.result);
					const tokenId = file.name.split('.')[0];
					const fileExtension = resolveFileExtension(jsonMetadata.properties?.files[0]?.type);

					jsonMetadata.image = ipfsUrl + `${tokenId}.${fileExtension}`;

					const metadataFile = new File([
						JSON.stringify(jsonMetadata),
					], `${tokenId}.json`, {type: 'application/json'});

					data.push(metadataFile);

					resolve(data);
				};
				fileReader.readAsText(file);
			} else {
				data.push(file);
				resolve(data);
			}
		});
	};

	const getIpfsGatewayUrl = (uri) => {
//		const ipfsGatewayUrl = 'https://gateway.pinata.cloud/ipfs/';
		return uri?.indexOf('ipfs://') !== -1 ? `http://${uri?.split('ipfs://')[1]}.ipfs.nftstorage.link/` : uri;
	}

	const getResolvedImageUrlFromIpfsUri = async (metadataUrl) => {
		try {
			let metadataUrlHash = `${getIpfsGatewayUrl(metadataUrl)}/1.json`;

			if (!metadataUrlHash) {
				throw new Error('Invalid metadataurl');
			}

			if (metadataUrlHash.indexOf('//1.json') !== -1) {
				metadataUrlHash = metadataUrlHash.replace('//1.json', '/1.json');
			}

			const fetchResponse = await fetch(metadataUrlHash);
			const json = await fetchResponse.json();

			if (!json?.image) {
				throw new Error('image field missing!');
			}

			return getIpfsGatewayUrl(json?.image);
		} catch (e) {
			console.log('Error fetchImageSrc:', e);
			return null;
		}
	}

	/**
	 * Uploads an array of files to NFT storage
	 */
	const uploadToNftStorage = async (
		files
	) => {
		const storage = new NFTStorage({ token: NFT_STORAGE_API_KEY })

		console.log(`storing file(s)`)
		const cid = await storage.storeDirectory(files)
		console.log({ cid })

		const status = await storage.status(cid)
		console.log(status)

		return cid;
	}


	/**
	 * Mime type to file extension
	 */
	const resolveFileExtension = (mimeType) =>
		(mimeType === 'image/webp' && 'webp') ||
		(mimeType === 'video/mp4' && 'mp4') ||
		'png';


	return {
		pinUnrevealedImage,
		generateUnrevealedImageMetadata,
		pinImages,
		pinMetadata,
		pinataUploadPercentage,
		getResolvedImageUrlFromIpfsUri,
		getIpfsGatewayUrl
	};
};
