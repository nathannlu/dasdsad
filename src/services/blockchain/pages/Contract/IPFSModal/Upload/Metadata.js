import React from 'react';
import { Box, Button, LoadingButton, Stack } from 'ds/components';
import { useContract } from 'services/blockchain/provider';
import { useIPFS } from 'services/blockchain/blockchains/hooks/useIPFS';
import Dropzone from 'react-dropzone'
import Folder from '@mui/icons-material/FolderOpenTwoTone';

const Metadata = (props) => {
	const { uploadedJson, setUploadedJson, ipfsUrl } = useContract()
	const { pinMetadata, loading } = useIPFS();

	const handleJsonUpload = (acceptedFiles) => {
		setUploadedJson([...uploadedJson, ...acceptedFiles]);
	}

	const callback = () => {
		props.setActiveStep(2)
	}

	return (
		<>
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
				<Stack>
					<Box>
						<Folder />
						{uploadedJson.length} Files added
						<Button onClick={() => setUploadedJson([])} type="small" color="error">
							Delete
						</Button>
					</Box>

					<LoadingButton loading={loading} onClick={() => pinMetadata(callback)}>
						Upload
					</LoadingButton>
				</Stack>
			)}
		</>
	)
	
};

export default Metadata 