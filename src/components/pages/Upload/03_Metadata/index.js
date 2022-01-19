import React, { useEffect, useState } from 'react';
import { Button, Stack, Card, Typography, FormLabel, TextField, Box, Grid, Fade, MenuItem, LoadingButton } from 'ds/components';
import Dropzone from 'react-dropzone'
import { usePinata } from '../hooks/usePinata';

import UpdateBaseUri from '../UpdateBaseUri';


const Connect = () => {
	const [ipfsUrl, setIpfsUrl] = useState('');
	const { 
		uploadedJson, 
		setUploadedJson, 
		pinFolderToIPFS, 
		updateMetadata, 
		pinMetadataToIPFS 
	} = usePinata({ipfsUrl, setIpfsUrl});

	const handleJsonUpload = (acceptedFiles) => {
		setUploadedJson([...uploadedJson, ...acceptedFiles]);
	}
	const onMetadataSubmit = async e => {
		await pinMetadataToIPFS(uploadedJson)
	}

	return (
		<Stack gap={2}>
			<Box>
				02. Upload to JSON to IPFS
				<Dropzone multiple onDrop={acceptedFiles => handleJsonUpload(acceptedFiles)}>
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
				<Button onClick={async () => await onMetadataSubmit()} variant="contained">
					Upload metadata to IPFS
				</Button>
			</Box>
			<Box>
				Deployed metadata IPFS URL

				https://ipfs.io/ipfs/{ipfsUrl}	
			</Box>
		</Stack>

	)
};

export default Connect
