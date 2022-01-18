import React, { useEffect, useState } from 'react';
import { useWeb3 } from 'libs/web3';
import { Button, Stack, Card, Typography, FormLabel, TextField, Box, Grid, Fade, MenuItem, LoadingButton } from 'ds/components';
import Dropzone from 'react-dropzone'
import { usePinata } from '../hooks/usePinata';
import { useToast } from 'ds/hooks/useToast';
import GavelIcon from '@mui/icons-material/Gavel';

const Connect = () => {
	const [ipfsUrl, setIpfsUrl] = useState('');
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [uploadedJson, setUploadedJson] = useState([]);
	const { addToast } = useToast();
	const { pinFolderToIPFS, updateMetadata, pinMetadataToIPFS } = usePinata({ipfsUrl, setIpfsUrl});

	const handleImagesUpload = (acceptedFiles) => {
		setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
	}
	const handleJsonUpload = (acceptedFiles) => {
		setUploadedJson([...uploadedJson, ...acceptedFiles]);
	}
	const onImageSubmit = async e => {
		e.preventDefault();
		// Add images to IPFS
		await pinFolderToIPFS(uploadedFiles);
	}
	const onMetadataSubmit = async e => {
		await pinMetadataToIPFS(uploadedJson)
	}

	return (
		<Stack gap={2}>
			<Box>
				01. Upload to images to IPFS
				<Dropzone multiple onDrop={acceptedFiles => handleImagesUpload(acceptedFiles)}>
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
				<Button onClick={onImageSubmit} variant="contained">
					Upload NFT images to IPFS
				</Button>
			</Box>

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
