import React, { useState } from 'react';
import { Box, Button, LoadingButton, Stack, Divider } from 'ds/components';
import { LinearProgress, Typography } from '@mui/material';
import { useContract } from 'services/blockchain/provider';
import Folder from '@mui/icons-material/FolderOpenTwoTone';
import { useIPFSModal } from '../hooks/useIPFSModal';
import Dropzone from 'react-dropzone';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const Traits = (props) => {
	const { uploadedFiles, setUploadedFiles } = useContract();
	const { uploadImages, loading, pinataPercentage } = useIPFSModal(
		props.contract,
		props.step,
		props.setActiveStep
	);
	const [percent, setPercent] = useState(0);

	const handleImagesUpload = (acceptedFiles) => {
		const formData = new FormData();
		for (const file of acceptedFiles) formData.append('file', file);

		const xhr = new XMLHttpRequest();
		xhr.upload.onprogress = (event) => {
			const percentage = parseInt((event.loaded / event.total) * 100);
			setPercent(percentage);
		};
		xhr.onreadystatechange = () => {
			if (xhr.readyState !== 4) return;
			if (xhr.status !== 200) return;
			setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
		};
		xhr.open('POST', 'https://httpbin.org/post', true);
		xhr.send(formData);
	};

	/**
	 * status marks if images were successfully pinned on pinata.cloud
	 *
	 * if status === true, move to next step
	 * else
	 * user can try uploading the images again
	 */
	const callback = (status) => {
		if (!status) {
			setUploadedFiles([]);
		}
		props.setActiveStep(status ? props.step + 1 : props.step);
	};

	return (
		<Stack gap={2}>
			<Box>
				<Typography variant="h6">Upload NFT collection images</Typography>
				<Typography mb={2} variant="body">
					Now, add your folder of NFT images to IPFS by dropping them below. 
					Support upload limits of up to 25GB
				</Typography>
			</Box>
			<Divider />
			{uploadedFiles.length < 1 ? (
				<Box>
					<Dropzone
						accept={['image/png', 'image/webp', 'video/mp4']}
						multiple
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
									<FileUploadIcon sx={{opacity: .3, fontSize: '64px'}} />
									<p
										style={{
											opacity: 0.5,
											textAlign: 'center',
										}}>
										Drag &apos;n&apos; drop your NFT collection images
										here to upload to IPFS
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
						{uploadedFiles.length} Files added
						<Button
							onClick={() => {
								setPercent(0);
								setUploadedFiles([]);
							}}
							type="small"
							color="error">
							Delete
						</Button>
					</Box>

					<LoadingButton
						variant="outlined"
						loading={loading}
						onClick={async () => await uploadImages()}>
						Upload
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
								value={pinataPercentage}
							/>
						</Box>
						<Box sx={{ minWidth: 35 }}>
							<Typography variant="body2" color="text.secondary">
								{pinataPercentage.toFixed(2)}%
							</Typography>
						</Box>
					</Box>
				</Stack>
			)}
		</Stack>
	);
};

export default Traits;
