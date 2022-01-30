import React, { useEffect, useState } from 'react';
import { Button, Container, Stack, Card, Typography, FormLabel, TextField, Box, Grid, Fade, MenuItem, LoadingButton } from 'ds/components';
import Dropzone from 'react-dropzone'
import { usePinata } from '../../hooks/usePinata';
import { useContract } from 'services/blockchain/provider';
import { useToast } from 'ds/hooks/useToast';
import { useDeployContractForm } from '../../hooks/useDeployContractForm';

import Folder from '@mui/icons-material/FolderOpenTwoTone';



const ConnectTraits = (props) => {
	const { uploadedFiles, setUploadedFiles } = useContract()
	const { verifyStep2 } = useDeployContractForm();

	const { addToast } = useToast();

	const handleImagesUpload = (acceptedFiles) => {
		setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
	}

	const onImageSubmit = async e => {
		e.preventDefault();
		// Add images to IPFS
	}


	return (
		<Fade in>
			<Container>
				<Stack gap={2}>
					<Stack>
						<Typography gutterBottom variant="h4">
							02. Drag and drop your collection "assets" folder
						</Typography>
						<Typography gutterBottom variant="body">
							Either drag and drop your whole folder or upload all your NFTs
						</Typography>
					</Stack>

					{uploadedFiles.length < 1 ? (
						<Box>
							<Dropzone accept={['image/png', 'video/mp4']} multiple onDrop={acceptedFiles => handleImagesUpload(acceptedFiles)}>
								{({getRootProps, getInputProps}) => (
									<Box sx={{
										alignItems:'center', 
										justifyContent: 'center',
										borderRadius: '4px',
										background: '#F8F8F8',
										border: '1px solid #C4C4C4',
										cursor: 'pointer',
										boxShadow: '0 0 10px rgba(0,0,0,.15)',
										position: 'relative',
									}}>
										<div style={{padding: '64px'}} {...getRootProps()}>
											<input {...getInputProps()} />
											<p style={{opacity: .5, textAlign: 'center'}}>
												Drag 'n' drop your collection here.
											</p>
										</div>
									</Box>
								)}
							</Dropzone>
						</Box>
					) : (
						<Box>
							<Folder />
							{uploadedFiles.length} Files added
							<Button onClick={() => setUploadedFiles([])} type="small" color="error">
								Delete
							</Button>
						</Box>
					)}


					<Stack justifyContent="space-between" direction="row">
						<Button onClick={() => props.previousStep()}>
							Prev
						</Button>
						<Button onClick={() => verifyStep2(uploadedFiles) && props.nextStep()}>
							Next
						</Button>
					</Stack>

				</Stack>
			</Container>
		</Fade>
	)
};

export default ConnectTraits
