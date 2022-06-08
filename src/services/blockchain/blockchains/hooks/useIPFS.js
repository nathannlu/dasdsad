import config from 'config';
import basePathConverter from 'base-path-converter';
import axios from 'axios';
import { useState } from 'react';
import { useToast } from 'ds/hooks/useToast';
import { getIpfsUrl } from '@ambition-blockchain/controllers';

const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`; // Pinata API url
export const MAX_UPLOAD_LIMIT = 2684354560; // Pinata max upload limit (25gb)

export const useIPFS = () => {
	const [pinataPercentage, setPinataPercentage] = useState(0);
	const { addToast } = useToast();

	/**
	 * Pins an image via Pinata API. Returns object containing 
	 * IPFS urls (url, hash, gateway)
	 *
	 * @param image - Array len 1 with a File object
	 */
	const pinUnrevealedImage = async (image) => {
		// Checks
		if (!image)
			throw new Error('Error! File to be uploaded not selected.');

		if (image[0].size > MAX_UPLOAD_LIMIT)
			throw new Error(
				'Error! Max upload limit reached. Your files are larger than 25GB'
			);

		// Formatting image support
		const file = image[0];
		const fileExtension = resolveFileExtension(file.type)

		// Pin the placeholder image to Pinata
		let imageData = new FormData();
		imageData.append(
			'file',
			file,
			`/assets/unrevealed.${fileExtension}`
		);
		const metadata = JSON.stringify({ name: 'assets' });
		imageData.append('pinataMetadata', metadata);

		// Send API request to Pinata
		const res = await axios.post(url, imageData, opt(imageData));
		return withIpfsUrls(res.data.IpfsHash);
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
	const generateUnrevealedImageMetadata = async (
		contract,
		unrevealedImageUrl
	) => {
		if(!contract) {
			throw new Error('Cannot generate metadata. Please open at ticket in Discord for help')
		}

		// Generate metadata files for unrevealed image with data
		// from contract obj (saved in db)
		let metadataData = new FormData();
		for (let i = 1; i < contract.nftCollection.size + 1; i++) {
			const jsonMetadata = {
				name: contract.name,
				description: `Unrevealed ${contract.name} NFT`,
				image: unrevealedImageUrl
			};

			// Attach JSON to formdata for Pinata upload
			const metadataFile = new Blob([JSON.stringify(jsonMetadata)]);
			metadataData.append(
				'file',
				metadataFile,
				`/metadata/${i}.json`
			);
		}
		// Pinata folder name
		const metadata = JSON.stringify({ name: 'metadata' });
		metadataData.append('pinataMetadata', metadata);

		// @TODO Check formdata is under 25GB to upload
		/*
		if (metadataData.length > MAX_UPLOAD_LIMIT)
			throw new Error('Error! File too large, exceeding 25GB upload limit.');
			*/

		// Send API request to Pinata
		const res = await axios.post(url, metadataData, opt(metadataData));
		return withIpfsUrls(res.data.IpfsHash);
	};

	/**
	 * Creates location for NFT images. This function pins a folder
	 * to IPFS via Pinata API, then returns an object containing
	 * IPFS urls (url, hash, gateway)
	 *
	 * @param folder - An array of File objects
	 */
	const pinImages = async (folder) => {
		// Construct formdata for uploading to Pinata API
		let data = new FormData();
		for (let i = 0; i < folder.length; i++) {
			data.append('file', folder[i], `/assets/${folder[i].name}`);
		}

		// @TODO -- check formdata is not larger than 25gb


		// Name Pinata folder
		const metadata = JSON.stringify({
			name: 'assets',
		});
		data.append('pinataMetadata', metadata);

		// Send API req
		const res = await axios.post(url, data, opt(data));

		// On success
		if(res) {
			return withIpfsUrls(res.data.IpfsHash);
		}

		throw new Error('Oops! something went wrong. Please try again!')
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
		let data = new FormData();
		for (let i = 0; i < folder.length; i++) {
			await appendUpdatedJson(folder[i], data, imageUrl);
		}
		const metadata = JSON.stringify({
			name: 'metadata',
		});
		data.append('pinataMetadata', metadata);

		// Send API request
		const res = await axios.post(url, data, opt(data));


		if(res) {
			return withIpfsUrls(res.data.IpfsHash)
		}

		throw new Error('Oops! something went wrong. Please try again!')
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
			setPinataPercentage(percentage);
		},
	});

	/**
	 * Generates different URLs for accessing ipfs location.
	 */
	const withIpfsUrls = (hash) => ({
		url: `ipfs://${hash}/`,
		gateway: `https://gateway.pinata.cloud/ipfs/${hash}/`,
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
					const fileExtension = resolveFileExtension(jsonMetadata.properties?.files[0]?.type)

					jsonMetadata.image = `${ipfsUrl}/${tokenId}.${fileExtension}`;

					// Attach JSON to formdata
					const metadataFile = new Blob([
						JSON.stringify(jsonMetadata),
					]);
					data.append(
						'file',
						metadataFile,
						`/metadata/${tokenId}.json`
					);

					resolve(data);
				};
				fileReader.readAsText(file);
			} else {
				data.append('file', file, '/metadata/metadata.json');
				resolve(data);
			}
		});
	};

	/**
	 * Mime type to file extension
	 */
	const resolveFileExtension = (mimeType) => {
		(mimeType === 'image/webp' && 'webp') ||
		(mimeType === 'video/mp4' && 'mp4') ||
		'png';
	}

	return {
		pinUnrevealedImage,
		generateUnrevealedImageMetadata,
		pinImages,
		pinMetadata,
		pinataPercentage
	};
};
