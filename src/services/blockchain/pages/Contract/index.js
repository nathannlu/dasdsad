import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useWeb3 } from 'libs/web3';
import { useContract } from 'services/blockchain/provider';
import { useEthereum } from 'services/blockchain/blockchains/hooks/useEthereum';
import { Fade, Container, Link, TextField, Stack, Box, Grid, Typography, Button, Divider } from 'ds/components';
import { Chip } from '@mui/material';
import { WarningAmber as WarningAmberIcon, SwapVert as SwapVertIcon, Payment as PaymentIcon, Upload as UploadIcon } from '@mui/icons-material';
import IPFSModal from './IPFSModal';



const Upload = (props) => {
	const [balance, setBalance] = useState(null)
	const [owners, setOwners] = useState([]);
	const [soldCount, setSoldCount] = useState(null)

	const [contract, setContract] = useState({});
	const [price, setPrice] = useState();
	const { id } = useParams();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [newMetadataUrl, setNewMetadataUrl] = useState('');

	const isSetupComplete = contract?.nftCollection?.baseUri && contract?.address ? true : false

	const { deployEthereumContract } = useEthereum();
	const { contracts, handleSelectNetwork } = useContract();
	const {
		loadWeb3,
		loadBlockchainData,
		getBalance,
		checkOwner,

		withdraw,
		mint,
		openContract,
		updateBaseUri,
	} = useWeb3()


	useEffect(() => {
		(async () => {
			await loadWeb3()
			await loadBlockchainData()
		})()
	}, [])

	useEffect(() => {
		if(contracts.length > 0) {
			(async () => {
				const c = contracts.find(c => c.id == id)
				setContract(c)
				console.log(c)

				const b = await getBalance(c.address)
				setBalance(b);

				setPrice(c.nftCollection.price);

				const nftsSold = b / c.nftCollection.price

				if(b == 0) {
					setSoldCount(0)
				} else {
					setSoldCount(nftsSold)
				}

				let list = [];
				for (let i = 0; i < nftsSold; i++) {
					const o = await checkOwner(i, c.address)
					setOwners(prevState => {
						prevState.push(o)
						return [...prevState]
					})
				}
			})()
		}
	},[contracts])

	const mintNow = async () => {
		await mint(contract.nftCollection.price.toString(), contract.address)
	}

	return (
		<Fade in>
			<Container>
				<Stack py={2} gap={5}>
					<Stack direction="column" gap={2}>
						<Box>
							<img 
								style={{height: '40px'}}
								src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d2aac6943de77b8cf95ef1_deploy-to-blockchain-icon.png" 
							/>
							<Chip label={contract?.blockchain} />
							{!isSetupComplete && (
								<Chip icon={<WarningAmberIcon />} color="warning" label="Set up required" />
							)}
						</Box>
						<Box>
							<Typography variant="h4">
								Contract overview
							</Typography>
							<Typography variant="body">
								Your deployed smart-contract's address on the blockchain
							</Typography>
						</Box>
						{contract?.address && (
						<Stack direction="column" gap={2}>
							<Box>
								<Box sx={{
									px:1,
									py:.5,
									bgcolor: 'grey.100', 
									fontWeight:'bold', 
									border: '0.5px solid rgba(0,0,0,.1)',
									borderRadius: 2,
								}}>
									{contract.address ? contract.address : null}
								</Box>
							</Box>
							<Box>
								<Link to="https://opensea.io/get-listed/step-two" target="_blank">
									Connect with OpenSea
								</Link>
							</Box>
						</Stack>
						)}


					</Stack>
					{!isSetupComplete ? (
						<>
						{!contract?.nftCollection?.baseUri && (
						<Stack>
							<Typography variant="h6" sx={{fontWeight:'bold'}}>
								Set NFT assets location
							</Typography>
							<Typography variant="body">
								Link your metadata and images to the smart contract.
							</Typography>
							<Box>
								<Button variant="contained" onClick={() => setIsModalOpen(true)}>
									Upload to IPFS
								</Button>
							</Box>
						</Stack>
						)}
						{contract?.nftCollection?.baseUri && (
							<Stack>
								<Typography variant="h6" sx={{fontWeight:'bold'}}>
									Deploy to the blockchain
								</Typography>
								<Typography variant="body">
									Deploy your smart contract to the blockchain in order to accept public mints, configure whitelists, set public sale.
								</Typography>
								<Box>
									<Button onClick={async () => {
											await handleSelectNetwork(contract?.blockchain);
											await deployEthereumContract({
												uri: contract.nftCollection.baseUri,
												name: contract.name,
												symbol: contract.symbol,
												totalSupply: contract.nftCollection.size,
												cost: contract.nftCollection.price,
												open: false,
												id
											})
										}}
										variant="contained"
									>
										Deploy to blockchain
									</Button>
								</Box>
							</Stack>
						)}
						</>
					) : (
						<>
					<Divider />
					<Stack>
						<Typography variant="h6" sx={{fontWeight:'bold'}}>
							Details
						</Typography>

						<Grid container xs={3}>
							<Grid item xs={6}>
								Balance:
							</Grid>
							<Grid sx={{fontWeight:'bold'}} item xs={6}>
								{balance}ETH
							</Grid>
							<Grid item xs={6}>
								NFTs sold:
							</Grid>
							<Grid sx={{fontWeight:'bold'}} item xs={6}>
								{soldCount}
							</Grid>
							<Grid item xs={6}>
								Price per NFT:
							</Grid>
							<Grid sx={{fontWeight:'bold'}} item xs={6}>
								{price}ETH
							</Grid>
							<Grid item xs={6}>
								Collection size:
							</Grid>
							<Grid sx={{fontWeight:'bold'}} item xs={6}>
								{contract?.nftCollection ? contract?.nftCollection?.size : null}
							</Grid>
						</Grid>

					</Stack>
					<Divider />
					<Stack gap={2}>
						<Typography variant="h6" sx={{fontWeight:'bold'}}>
							Interact
						</Typography>
						<Stack direction="row" gap={2}>
							<Button 
								startIcon={<SwapVertIcon />}
								size="small" 
								variant="contained" 
								onClick={() => withdraw(contract.address)}
							>
								Pay out to bank
							</Button>
							<Button 
								startIcon={<PaymentIcon />}
								size="small"
								variant="contained"
								onClick={() => mintNow()}
							>
								Mint
							</Button>
							<Button 
								size="small"
								variant="contained"
								onClick={() => openContract(contract.address)}
							>
								openContract
							</Button>
						</Stack>
						<Stack gap={1}>
							<Typography variant="small">
								Update where your NFT collection metadata folder points to. Updating this may break your collection.
							</Typography>
							<Stack direction="row">
								<TextField 
									size="small"
									placeholder="New metadata URL" 
									onChange={e => setNewMetadataUrl(e.target.value)}
								/>
								<Button size="small" variant="contained" onClick={() => {
									updateBaseUri(newMetadataUrl, contract.address)
								}}>
									<UploadIcon />
								</Button>
							</Stack>
						</Stack>
					</Stack>
						


					<Stack sx={{background: '#eee', borderRadius: 2, p:2}}>
						<Typography variant="h6">
							Addresses who own your NFT
						</Typography>
						<Box>
							{owners.map(addr => (
								<div key={addr}>
									{addr}
								</div>
							))}
						</Box>
					</Stack>
						</>
					)}
				</Stack>
				<IPFSModal id={id} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
			</Container>
		</Fade>
	)
};

export default Upload;
