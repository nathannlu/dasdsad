import React, { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import {
	Box,
	Button,
	Divider,
	LoadingButton,
	Stack,
	Grid,
	Typography,
} from 'ds/components';
import { LinearProgress } from '@mui/material';
import {
	CheckCircleOutline as CheckCircleOutlineIcon,
	FolderOpenTwoTone as Folder,
	FileUpload as FileUploadIcon,
} from '@mui/icons-material';
import { useContract } from 'services/blockchain/provider';
import { MAX_UPLOAD_LIMIT, IMAGE_MIME_TYPES } from 'ambition-constants';
import { useIPFSModal, bytesToMegaBytes } from '../hooks/useIPFSModal';
import { useToast } from 'ds/hooks/useToast';
import { getNftStorageTypeLabel } from 'ambition-constants';

const UploadUnRevealedImage = (props) => {
	const { uploadUnrevealedImage, uploadLoading, uploadPercentage } = useIPFSModal(props.contract, props.step, props.setActiveStep, props.nftStorageType);
	const { uploadedUnRevealedImageFile, setUploadedUnRevealedImageFile } = useContract();
	const { addToast } = useToast();
	const [percent, setPercent] = useState(0);

	const handleImagesUpload = (acceptedFiles) => {
		try {
			if (acceptedFiles.length > 1) {
				throw new Error('Cannot have more than 1 unrevealed image');
			}

			if (acceptedFiles[0]?.size > MAX_UPLOAD_LIMIT) {
				throw new Error('Error! File upload limit.');
			}

			if (!IMAGE_MIME_TYPES.includes(acceptedFiles[0]?.type)) {
				throw new Error(`Error! File type not supported. We support ${IMAGE_MIME_TYPES.toString()}`);
			}

			const formData = new FormData();
			formData.append('file', acceptedFiles[0]);

			const xhr = new XMLHttpRequest();
			xhr.upload.onprogress = (event) => {
				const percentage = parseInt((event.loaded / event.total) * 100);
				setPercent(percentage);
			};
			xhr.onreadystatechange = () => {
				if (xhr.readyState !== 4) return;
				if (xhr.status !== 200) return;
				setUploadedUnRevealedImageFile(acceptedFiles);
			};
			xhr.open('POST', 'https://httpbin.org/post', true);
			xhr.send(formData);
		} catch (e) {
			addToast({
				severity: 'error',
				message: e.message,
			});
		}
	};
	
	const nftStorageType = getNftStorageTypeLabel(props.nftStorageType);

	return (
		<Stack gap={2}>
			<Box>
				<Typography variant="h6">Upload your placeholder to IPFS</Typography>
				<Typography variant="body">
					Also known as the pre-reveal image/video. It ensures fair rarity distribution & adds anticipation to the reveal. Max upload limit of 25GB
				</Typography>
			</Box>
			<Divider />
			{uploadedUnRevealedImageFile < 1 ? (
				<Box>
					<Dropzone
						accept={IMAGE_MIME_TYPES}
						onDrop={(acceptedFiles) =>
							handleImagesUpload(acceptedFiles)
						}>
						{({ getRootProps, getInputProps }) => (
							<Box
								sx={{
									alignItems: 'center',
									justifyContent: 'center',
									borderRadius: '4px',
									background: '#F8F8F8',
									border: '1px solid #C4C4C4',
									cursor: 'pointer',
									boxShadow: '0 0 10px rgba(0,0,0,.15)',
									position: 'relative',
								}}>
								<div
									style={{ padding: '64px', textAlign: 'center' }}
									{...getRootProps()}>
									<input {...getInputProps()} />
									<FileUploadIcon sx={{ opacity: .3, fontSize: '64px' }} />
									<p
										style={{
											opacity: 0.5,
											textAlign: 'center',
										}}
									>
										Drag &apos;n&apos; drop your pre-reveal thumbnail
										here to upload to {nftStorageType}
									</p>
								</div>
							</Box>
						)}
					</Dropzone>
					<LinearProgress variant="determinate" value={percent} />
				</Box>
			) : (
				<Stack>
					<Box>
						<Folder />
						{uploadedUnRevealedImageFile.length} Files added
						<Button
							onClick={() => {
								setPercent(0);
								setUploadedUnRevealedImageFile([]);
							}}
							type="small"
							color="error">
							Delete
						</Button>
					</Box>

					<LoadingButton
						loading={uploadLoading}
						variant="outlined"
						onClick={async () => await uploadUnrevealedImage(props.nftStorageType)}>
						Upload unrevealed image
					</LoadingButton>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							marginTop: '.5em',
						}}>
						<Box sx={{ width: '100%', mr: 1 }}>
							<LinearProgress
								variant="determinate"
								value={uploadPercentage}
							/>
						</Box>
						<Box sx={{ minWidth: 35 }}>
							<Typography variant="body2" color="text.secondary">
								{uploadPercentage.toFixed(2)}%
							</Typography>
						</Box>
					</Box>
				</Stack>
			)}
		</Stack>
	);
};

export default UploadUnRevealedImage;
