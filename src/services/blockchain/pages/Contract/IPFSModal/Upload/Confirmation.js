import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, Stack } from 'ds/components';
import {
	Stepper,
	Step,
	StepLabel,
	StepContent,
	Typography,
	TextField,
} from '@mui/material';
import { useContract } from 'services/blockchain/provider';
import {
	useSetBaseUri,
	useSetUnRevealedBaseUri,
} from 'services/blockchain/gql/hooks/contract.hook';
import { useToast } from 'ds/hooks/useToast';

const Confirmation = (props) => {
	const { imagesUrl, baseUri, metadataUrl, ipfsUrl, unRevealedBaseUri } = useContract();
	const { addToast } = useToast();
	const [metadataPreview, setMetadataPreview] = useState('');

	const [setBaseUri] = useSetBaseUri({
		onCompleted: () => {
			addToast({
				severity: 'success',
				message: 'Successfully added contract base URI',
			});
			props.setIsModalOpen(false);
		},
	});

	const [setUnRevealedBaseUri] = useSetUnRevealedBaseUri({
		onCompleted: () => {
			addToast({
				severity: 'success',
				message: 'Successfully updated contract unrevealed base URI',
			});
		},
	});

	/**
	 * restrict user from proceeding if
	 * - imagesUrl is null
	 *  or
	 * - metadataUrl is null
	 *  or
	 * - ipfsUrl is null
	 */
	useEffect(() => {
		if (
			!imagesUrl ||
			!baseUri ||
			!unRevealedBaseUri && props.renderUploadUnRevealedImage
		) {
			addToast({
				severity: 'error',
				message: 'Oops! something went wrong. Please try again!',
			});
			props.setActiveStep(0);
			return;
		}

		/*
		// Get JSON from ipfsUrl
		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4 && xhr.status === 200) {
				setMetadataPreview(
					JSON.stringify(JSON.parse(xhr.responseText), null, 2)
				);
			}
		};
		xhr.open(
			'GET',
			`https://gateway.pinata.cloud/ipfs/${metadataUrl}/1.json`,
			true
		);
		xhr.send();
		*/
	}, [
		imagesUrl,
		metadataUrl,
		ipfsUrl,
		unRevealedBaseUri,
		props.renderUploadUnRevealedImage,
	]);

	const nftStorageType = props.nftStorageType === 's3' ? 'Ambition S3 Server' : 'IPFS';

	return (
		<Stack gap={2}>
			<Stack gap={1}>
				<Box>
					<Typography sx={{ fontWeight: 'bold' }}>Pre-reveal</Typography>
					<Typography>Below is the {nftStorageType} url pointing to the metadata that was generated to support the pre-reveal image you uploaded in the first step.</Typography>
				</Box>

				<Typography sx={{ fontWeight: 'bold', color: '#006aff' }}>{unRevealedBaseUri}</Typography>
			</Stack>
			<Stack gap={1}>
				<Box>
					<Typography sx={{ fontWeight: 'bold' }}>Location of your NFT images on {nftStorageType}</Typography>
					<Typography>Below is the url pointing to the images uploaded in step 2. This data has been automatically linked with your metadata on {nftStorageType}</Typography>
				</Box>

				<Typography sx={{ fontWeight: 'bold', color: '#006aff' }}>{imagesUrl}</Typography>
			</Stack>
			<Stack gap={1}>
				<Box>
					<Typography sx={{ fontWeight: 'bold' }}>Location of your metadata</Typography>
					<Typography>Below is the {nftStorageType} url pointing to the metadata of your NFT collection. This metadata has been automatically linked with your images on {nftStorageType}</Typography>
				</Box>

				<Typography sx={{ fontWeight: 'bold', color: '#006aff' }}>{baseUri}</Typography>
			</Stack>

			{/*
            <Box display='flex' sx={{ marginTop: '1em', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

                {props.renderUploadUnRevealedImage && <Box display='flex' flexDirection='column' alignItems='center' justifyContent='space-between'>
                    <Typography>
                        Un-revealed NFT Preview
                    </Typography>
									{/*
                    <Box
                        component="img"
                        sx={{
                            height: 100,
                            width: 100,
                            objectFit: 'cover'
                        }}
                        alt="Un-revealed NFT Preview"
                        src={`https://gateway.pinata.cloud/ipfs/${unRevealedBaseUri}/unrevealed.png`}
                    />
                    <Typography fontSize='8pt'>
                        Source:{' '}
                        <a
                            style={{ color: 'blue' }}
                            href={`https://gateway.pinata.cloud/ipfs/${unRevealedBaseUri}/unrevealed.png`}
                            target="_blank"
                            rel="noreferrer">
                            {unRevealedBaseUri}
                        </a>
                    </Typography>
                </Box>}

                <Box display='flex' flexDirection='column' alignItems='center' justifyContent='space-between'>
                    <Typography>
                        NFT Preview
                    </Typography>
                    <Box
                        component="img"
                        sx={{
                            height: 100,
                            width: 100,
                            objectFit: 'cover'
                        }}
                        alt="NFT Preview"
                        src={`https://gateway.pinata.cloud/ipfs/${imagesUrl}/1.png`}
                    />
                    <Typography fontSize='8pt'>
                        Source:{' '}
                        <a
                            style={{ color: 'blue' }}
                            href={`https://gateway.pinata.cloud/ipfs/${imagesUrl}/1.png`}
                            target="_blank"
                            rel="noreferrer">
                            {imagesUrl}
                        </a>
                    </Typography>
                </Box>

                <Box display='flex' flexDirection='column' alignItems='center' justifyContent='space-between'>
                    <Typography>
                        Metadata Preview
                    </Typography>
                    <TextField
                        label=""
                        defaultValue=""
                        variant="filled"
                        value={metadataPreview}
                        multiline
                        rows={5}
                        maxRows={5}
                        fullWidth
                    />
                    <Typography fontSize='8pt'>
                        Source:{' '}
                        <a
                            style={{ color: 'blue' }}
                            href={`https://gateway.pinata.cloud/ipfs/${metadataUrl}/1.json`}
                            target="_blank"
                            rel="noreferrer">
                            {baseUri}
                        </a>
                    </Typography>
                </Box>
            </Box>
*/}

			<Button
				variant="contained"
				onClick={() => {
					if (props.renderUploadUnRevealedImage) {
						setUnRevealedBaseUri({
							variables: {
								unRevealedBaseUri: `${unRevealedBaseUri}`,
								id: props.id,
							},
						});
					}
					setBaseUri({
						variables: { baseUri: baseUri, id: props.id },
					});
				}}>
				Confirm
			</Button>
		</Stack>
	);
};

export default Confirmation;
