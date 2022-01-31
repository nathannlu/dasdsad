import React, { useEffect, useState } from 'react';
import { Container, Button, Stack, Card, Typography, FormLabel, TextField, Box, Grid, Fade, MenuItem, LoadingButton } from 'ds/components';
import Dropzone from 'react-dropzone'
import { useContract } from 'services/blockchain/provider';
import { useDeployContractForm } from '../../hooks/useDeployContractForm';

import Folder from '@mui/icons-material/FolderOpenTwoTone';


const Connect = (props) => {
	const { uploadedJson, setUploadedJson, ipfsUrl } = useContract()
	const { verifyStep3 } = useDeployContractForm();

	const handleJsonUpload = (acceptedFiles) => {
		setUploadedJson([...uploadedJson, ...acceptedFiles]);
	}
	const onMetadataSubmit = async e => {
		console.log(uploadedJson)
	}

	return (
		<Fade in>
			<Container>
				<Stack gap={2}>
					<Stack>
						<Typography gutterBottom variant="h4">
							03. Upload metadata to IPFS
						</Typography>
						<Typography gutterBottom variant="body">
							Drag and drop your folder of metadata generated by us
						</Typography>
					</Stack>

					{uploadedJson.length < 1 ? (
						<Box>
							<Dropzone accept={['application/json']} multiple onDrop={acceptedFiles => handleJsonUpload(acceptedFiles)}>
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
							{uploadedJson.length} Files added
							<Button onClick={() => setUploadedJson([])} type="small" color="error">
								Delete
							</Button>
						</Box>
					)}

					<Stack justifyContent="space-between" direction="row">
						<Button onClick={() => props.previousStep()}>
							Prev
						</Button>
						<Button onClick={() => verifyStep3(uploadedJson) && props.nextStep()}>
							Next
						</Button>
					</Stack>
				</Stack>
			</Container>
		</Fade>
	)
};

export default Connect
