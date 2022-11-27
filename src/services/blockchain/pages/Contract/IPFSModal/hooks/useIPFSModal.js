import { useState } from 'react';
import { useIPFS } from 'services/blockchain/blockchains/hooks/useIPFS';
import { useS3 } from 'services/blockchain/blockchains/hooks/useS3';
import { useContract } from 'services/blockchain/provider';
import { useToast } from 'ds/hooks/useToast';

export const bytesToMegaBytes = (bytes) => bytes / 1024 ** 2;

export const useIPFSModal = (contract, step, setActiveStep, nftStorageType) => {
	const {
		pinUnrevealedImage,
		generateUnrevealedImageMetadata,
		pinImages,
		pinMetadata,
		pinataUploadPercentage
	} = useIPFS();

	const {
		deleteS3Collection,
		uploadTraitsToS3,
		uploadMetadataToS3,
		s3UploadPercentage
	} = useS3(contract.id);

	const {
		uploadedUnRevealedImageFile,
		setUploadedUnRevealedImageFile,
		setMetadataUrl,
		uploadedFiles,
		uploadedJson,

		unRevealedBaseUri,
		setUnRevealedBaseUri,
		imagesUrl,
		setImagesUrl,
		setBaseUri,
	} = useContract();
	const { addToast } = useToast();
	const [uploadLoading, setUploadLoading] = useState(false);
	const [uploadError, setUploadError] = useState(null);

	// Select different urls based on blockchain
	// Solana - use gateway url
	// Ethereum - use ipfs url
	const resolvedUrl = (contract?.blockchain === 'solana' || contract?.blockchain === 'solanadevnet') ? 'gateway' : 'url';

	const onError = () => {
		setUploadError(true);
	}

	/**
	 * Handle file upload to IPFS or aws s3
	 * nftStorageType: 's3' | 'ipfs
	 */
	const uploadUnrevealedImage = async (nftStorageType) => {
		try {
			setUploadLoading(true);

				// if the nftStorageType === 'ipfs'
				const imageUrls = await pinUnrevealedImage(uploadedUnRevealedImageFile);
				if (!imageUrls || !imageUrls[resolvedUrl]) {
					throw new Error('Error uploading images: Something went wrong. Please contact support for help.');
				}

			console.log('image urls', imageUrls);

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
			setUploadLoading(false);
		}
	}

	/**
	 * Handle file upload to IPFS or aws s3
	 * nftStorageType: 's3' | 'ipfs
	 */
	const uploadImages = async (nftStorageType) => {
		try {
			setUploadLoading(true);
			setUploadError(false);

			switch (nftStorageType) {
				case 's3': {
					const { traitsUrl } = await uploadTraitsToS3(uploadedFiles, 'revealed', onError);
					if (!traitsUrl) {
						throw new Error('Error uploading images: Something went wrong. Please try again or contact support for help.');
					}

					setImagesUrl(traitsUrl);
					break;
				}
				default: {
					const imagesUrls = await pinImages(uploadedFiles);
					if (!imagesUrls || !imagesUrls[resolvedUrl]) {
						throw new Error('Error uploading images: Something went wrong. Please contact support for help.');
					}
					setImagesUrl(imagesUrls[resolvedUrl]);
					break;
				}
			}
			// Move to next step
			callback(true);
		} catch (e) {
			addToast({ severity: 'error', message: e.message });
			callback(false);
		} finally {
			setUploadLoading(false);
		}
	}

	/**
	 * Handle file upload to IPFS or aws s3
	 * nftStorageType: 's3' | 'ipfs
	 */
	const uploadMetadata = async (nftStorageType) => {
		try {
			setUploadLoading(true);
			setUploadError(false);

			switch (nftStorageType) {
				case 's3': {
					const metadataUrl = await uploadMetadataToS3(uploadedJson, 'revealed', contract, imagesUrl, null, onError);
					if (!metadataUrl) {
						throw new Error('Error uploading metadata: Something went wrong. Please try again or contact support for help.');
					}

					setBaseUri(metadataUrl);
					break;
				}
				default: {
					const metadataUrls = await pinMetadata(uploadedJson, imagesUrl);
					if (!metadataUrls || !metadataUrls[resolvedUrl]) {
						throw new Error('Error uploading images: Something went wrong. Please contact support for help.');
					}

					setBaseUri(metadataUrls[resolvedUrl]);
					break;
				}
			}

			// Move to next step
			callback(true);
		} catch (e) {
			addToast({
				severity: 'error',
				message: e.message,
			});
			callback(false);
		} finally {
			setUploadLoading(false)
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
		if (status) {
			setActiveStep(step + 1);
		}
	};

	const uploadPercentage = nftStorageType === 's3' ? s3UploadPercentage : pinataUploadPercentage;

	return {
		uploadUnrevealedImage,
		uploadImages,
		uploadMetadata,
		uploadPercentage,
		uploadLoading,
		uploadError
	}
}
