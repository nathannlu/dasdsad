import { useState } from 'react';
import { useIPFS, MAX_UPLOAD_LIMIT } from 'services/blockchain/blockchains/hooks/useIPFS';
import { useContract } from 'services/blockchain/provider';
import { useToast } from 'ds/hooks/useToast';

export const bytesToMegaBytes = (bytes) => bytes / 1024 ** 2;

export const useIPFSModal = (contract, step, setActiveStep) => {
	const {
		pinUnrevealedImage,
		generateUnrevealedImageMetadata,
		pinImages,
		pinMetadata,
		pinataPercentage,
	} = useIPFS();
	const { 
		uploadedUnRevealedImageFile, 
		setUploadedUnRevealedImageFile, 
		setMetadataUrl,
		uploadedFiles,
		uploadedJson,

		unRevealedBaseUri,
		setUnRevealedBaseUri,
		imagesUrl, setImagesUrl,
		setBaseUri,
	} = useContract();
	const { addToast } = useToast();
	const [percent, setPercent] = useState(0);
	const [loading, setLoading] = useState(false);

	
	// Select different urls based on blockchain
	// Solana - use gateway url
	// Ethereum - use ipfs url
	const resolvedUrl = contract.blockchain === 'solana' || contract.blockchain === 'solanadevnet' ? 'gateway' : 'url'
	
	/**
	 * Handle file upload to IPFS
	 */
	const uploadUnrevealedImage = async () => {
		try {
			setLoading(true);

			const imageUrls = await pinUnrevealedImage(uploadedUnRevealedImageFile)
			if (!imageUrls || !imageUrls[resolvedUrl]) {
				throw new Error('Error uploading images: Something went wrong. Please contact support for help.');
			}

			const metadataUrls = await generateUnrevealedImageMetadata(
				contract,
				imageUrls[resolvedUrl]
			)
			if (!metadataUrls || !metadataUrls[resolvedUrl]) {
				throw new Error('Error uploading metadata: Something went wrong. Please contact support for help.');
			}

			// Save url to database
      setUnRevealedBaseUri(metadataUrls[resolvedUrl]);
			addToast({
				severity: 'success',
				message: 'Image and metadata were uploaded successfully'
			});

			// Move to next step
			callback(true);
		} catch (e) {
			addToast({
				severity: 'error',
				message: e.message,
			});

			// Let users reupload
			callback(false);
		} finally {
			setLoading(false);
		}
	}

	const uploadImages = async () => {
		try {
			setLoading(true);

			const imagesUrls = await pinImages(uploadedFiles);
			if (!imagesUrls || !imagesUrls[resolvedUrl]) {
				throw new Error('Error uploading images: Something went wrong. Please contact support for help.');
			}

			setImagesUrl(imagesUrls[resolvedUrl])

			// Move to next step
			callback(true);
		} catch (e) {
			addToast({
				severity: 'error',
				message: e.message,
			});
			callback(false);
		} finally { 
			setLoading(false);
		}
	}

	const uploadMetadata = async () => {
		try {
			setLoading(true);

			const metadataUrls = await pinMetadata(uploadedJson, imagesUrl);
			if (!metadataUrls || !metadataUrls[resolvedUrl]) {
				throw new Error('Error uploading images: Something went wrong. Please contact support for help.');
			}

			setBaseUri(metadataUrls[resolvedUrl])

			// Move to next step
			callback(true);
		} catch (e) {
			addToast({
				severity: 'error',
				message: e.message,
			});
		} finally {
			setLoading(false)
		}
	}


	/**
	 * status marks if images were successfully pinned on pinata.cloud
	 *
	 * if status === true, move to next step
	 * else
	 * user can try uploading the images again
	 */
	const callback = (status) => {
		if (!status) {
			setUploadedUnRevealedImageFile(null);
		}
		setActiveStep(status ? step + 1 : step);
	};

	return {
		uploadUnrevealedImage,
		uploadImages,
		uploadMetadata,

		//@TODO fix monkey code... repetitive exports
		loading,
		pinataPercentage,
		percent,
	}
}
