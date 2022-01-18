import React, { useEffect, useState } from 'react';
import { useWeb3 } from 'libs/web3';
import { Button, Stack, Card, Typography, FormLabel, TextField, Box, Grid, Fade, MenuItem, LoadingButton } from 'ds/components';
import { useDeployContractForm } from '../hooks/useDeployContractForm';
import { useDeployContract } from '../hooks/useDeployContract';



const Deploy = (props) => {
	const [selectInput, setSelectInput] = useState('Ethereum');
	const { account, loadWeb3, loadBlockchainData, withdraw, getBalance } = useWeb3();
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


	useEffect(() => {
		(async () => {
			await loadWeb3()
			await loadBlockchainData()
//			setBalance(await getBalance())
		})()
	}, [])

	return (
		<Box>
			<Stack gap={3}>
				<Card sx={{p: 2}}>
					<Stack gap={3}>
						<Stack>
							<Typography gutterBottom variant="h4">
								01. Create NFT collection
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
				<Button onClick={() => props.nextStep()}>
					Next
				</Button>
			</Stack>
		</Box>
	)
};

export default Deploy;
