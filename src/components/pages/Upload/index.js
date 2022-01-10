import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Card, TextField, FormLabel, LoadingButton, Grid, Stack, Fade, Typography, MenuItem } from 'ds/components';
import Dropzone from 'react-dropzone'

import { useDeployContractForm } from './hooks/useDeployContractForm';
import { useDeployContract } from './hooks/useDeployContract';
import { useWeb3 } from 'libs/web3';
//import { useWebsite } from 'libs/website';
import { usePinata } from './hooks/usePinata';


import { useToast } from 'ds/hooks/useToast';
import GavelIcon from '@mui/icons-material/Gavel';

const Upload = () => {
	const [ipfsUrl, setIpfsUrl] = useState('');
	const [selectInput, setSelectInput] = useState('Ethereum');
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [uploadedJson, setUploadedJson] = useState([]);
	
	const { pinFolderToIPFS, updateMetadata, pinMetadataToIPFS } = usePinata({ipfsUrl, setIpfsUrl});

	const {
		deployContractForm: { baseURI, priceInEth, maxSupply},
		onDeploy,
		onCompleted,
		onError
	} = useDeployContractForm();
	const [deployContract, { loading }] = useDeployContract({
		baseURI: baseURI.value,
		priceInEth: priceInEth.value,
		maxSupply: maxSupply.value,
		onDeploy,
		onCompleted,
		onError
	});


	const { addToast } = useToast();

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


	const [balance, setBalance] = useState(null);
	const { account, loadWeb3, loadBlockchainData, withdraw, getBalance } = useWeb3();
//	const { website } = useWebsite();


	useEffect(() => {
		(async () => {
			await loadWeb3()
			await loadBlockchainData()
			setBalance(await getBalance())
		})()
	}, [])


	return (
		<Fade in>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					minHeight: '100vh',
					p: 2
				}}
			>
				<Container>
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



					<Stack gap={3}>
						<Card sx={{p: 2}}>
							<Stack gap={3}>
								<Stack>
									<Typography gutterBottom variant="h4">
										03. Create NFT collection
									</Typography>
									<Typography gutterBottom variant="body">
										Smart contract will be deployed under the current Metamask address:
									</Typography>
									<Typography gutterBottom variant="body">
										{account}
									</Typography>
								</Stack>

								<Stack gap={2} direction="row">
									<Stack sx={{flex: 1}}>
										<FormLabel sx={{fontWeight:'bold'}}>
											Base NFT URL
										</FormLabel>
										<Typography gutterBottom variant="body2">
											Set the URL of your IPFS folder in the input below. Make sure the URL is correct because you won't be able to change it after deploying the NFT smart contract.
										</Typography>

										<TextField {...baseURI} fullWidth />
									</Stack>
									<Stack sx={{flex: 1}}>
										<FormLabel sx={{fontWeight:'bold'}}>
											Royalty percentage
										</FormLabel>
										<Typography gutterBottom variant="body2">
											Take a percentage of sales when your NFT is traded	
										</Typography>
										<TextField placeholder="5%" fullWidth />
									</Stack>
								</Stack>

								<Stack gap={2} direction="row">
									<Stack sx={{flex: 1}}>
										<FormLabel sx={{fontWeight:'bold'}}>
											Price per NFT minted
										</FormLabel>
										<Typography gutterBottom variant="body2">
											Set the price in ether for minting one NFT.
										</Typography>
										<TextField {...priceInEth} fullWidth />
									</Stack>

									<Stack sx={{flex: 1}}>
										<FormLabel sx={{fontWeight:'bold'}}>
											Total number of NFTs
										</FormLabel>
										<Typography gutterBottom variant="body2">
											Set the total number of NFTs in your collection
										</Typography>
										<TextField {...maxSupply} fullWidth />
									</Stack>
								</Stack>

								<Stack>
									<FormLabel sx={{fontWeight:'bold'}}>
										Select your Blockchain
									</FormLabel>
									<TextField select onChange={e=>setSelectInput(e.target.value)} value={selectInput}>
										{/*
										<MenuItem value="Solana">
											Solana
										</MenuItem>
										<MenuItem value="Polygon">
											Polygon
										</MenuItem>
										*/}
										<MenuItem value="Ethereum">
											Ethereum
										</MenuItem>

									</TextField>
								</Stack>

								<Stack>
									<FormLabel sx={{fontWeight:'bold'}}>
										Deploy contract
									</FormLabel>
									<Typography gutterBottom variant="body2">
										Once you're ready, deploy the contract. Ethereum charges a small gas fee for deploying to the blockchain. Double check to confirm all your information is correct, smart contracts are immutable after deployment.
									</Typography>
									<LoadingButton
										onClick={deployContract}
										loading={loading}
										variant="contained"
//										disabled={website.contractAddress}
										fullWidth
									>
										Deploy
									</LoadingButton>
								</Stack>
							</Stack>
						</Card>


						{/*
						<Card sx={{p: 2}}>
							<Stack gap={3}>
								<Stack>
									<Typography gutterBottom variant="h4">
										Your balance
									</Typography>

									<Box>
										{/*
										{website.contractAddress ? (
											<Stack>
												<Typography gutterBottom variant="body">
													Your NFT smart contract is deployed under this address:
												</Typography>
												<Typography gutterBottom variant="body">
													{website.contractAddress && website.contractAddress}
												</Typography>
											</Stack>
										) : null}
									</Box>


									<Box>
										{/*
										{website.contractAddress ? (
											<Box>
												{ balance ? (
													<Box>
														{balance} eth
													</Box>
												) : "loading" }
											</Box>
										) : (
											<Box>
												After you deploy you smart contract, you will be able to view your balance from NFT sales here.
											</Box>
										)}
									</Box>

									<Button
										onClick={withdraw}
										variant="contained"
//										disabled={!website.contractAddress}
									>
										Withdraw funds
									</Button>
								</Stack>

							</Stack>
						</Card>
				*/}
					</Stack>
				</Container>

			</Box>
		</Fade>
	)
};

export default Upload;
