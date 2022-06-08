import React, { useState } from 'react';
import { Box, Button, LoadingButton, Stack, Divider } from 'ds/components';
import { LinearProgress, Typography } from '@mui/material';
import { useContract } from 'services/blockchain/provider';
import { useIPFSModal } from '../hooks/useIPFSModal';
import Folder from '@mui/icons-material/FolderOpenTwoTone';
import Dropzone from 'react-dropzone';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const Metadata = (props) => {
	const { uploadedJson, setUploadedJson, ipfsUrl } = useContract();
	const { uploadMetadata, loading, pinataPercentage } = useIPFSModal(
		props.contract,
		props.step,
		props.setActiveStep
	);
	const [percent, setPercent] = useState(0);

	const handleJsonUpload = (acceptedFiles) => {
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
			setUploadedJson([...uploadedJson, ...acceptedFiles]);
		};
		xhr.open('POST', 'https://httpbin.org/post', true);
		xhr.send(formData);
	};

	return (
		<Stack gap={2}>
			<Box>
				<Typography variant="h6">
					Upload NFT collection metadata
				</Typography>
				<Typography mb={2} variant="body">
					Now, add your folder of NFT images to IPFS by dropping them
					below. Support upload limits of up to 25GB
				</Typography>
			</Box>
			<Divider />
			{uploadedJson.length < 1 ? (
				<Box>
					<Dropzone
						accept={['application/json']}
						multiple
						onDrop={(acceptedFiles) =>
							handleJsonUpload(acceptedFiles)
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
									style={{
										padding: '64px',
										textAlign: 'center',
									}}
									{...getRootProps()}>
									<input {...getInputProps()} />

									<FileUploadIcon
										sx={{ opacity: 0.3, fontSize: '64px' }}
									/>
									<p
										style={{
											opacity: 0.5,
											textAlign: 'center',
										}}>
										Drag &apos;n&apos; drop your collection
										here.
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
						{uploadedJson.length} Files added
						<Button
							onClick={() => {
								setPercent(0);
								setUploadedJson([]);
							}}
							type="small"
							color="error">
							Delete
						</Button>
					</Box>

					<LoadingButton
						loading={loading}
						variant="outlined"
						onClick={async () => await uploadMetadata()}>
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

export default Metadata;
