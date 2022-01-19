import React, { useEffect, useState } from 'react';
import { useWeb3 } from 'libs/web3';
import { Button, Stack, Card, Typography, FormLabel, TextField, Box, Grid, Fade, MenuItem, LoadingButton } from 'ds/components';
import { useDeployContractForm } from '../hooks/useDeployContractForm';
import { useDeployContract } from '../hooks/useDeployContract';

import { useCreateContract } from 'gql/hooks/contract.hook';


const Deploy = (props) => {
	const [selectInput, setSelectInput] = useState('ethereum');
	const { account, loadWeb3, loadBlockchainData, withdraw, getBalance } = useWeb3();

	const {
		deployContractForm: { 
			royaltyPercentage,
			priceInEth,
			maxSupply
		},
		onDeploy,
		onError
	} = useDeployContractForm();
	const [createContract] = useCreateContract({});
	const [deployContract, { loading }] = useDeployContract({
		priceInEth: priceInEth.value,
		maxSupply: maxSupply.value,
		onDeploy,
		onCompleted: async (data) => {
			const ContractInput = {
				address: data.contractAddress,
				blockchain: selectInput,
				nftCollection: {
					price: parseFloat(priceInEth.value),
					currency: 'eth',
					size: parseInt(maxSupply.value),
					royalty: parseInt(royaltyPercentage.value),
				}
			}
			await createContract({ variables: { contract: ContractInput} });
		},
		onError
	});


	useEffect(() => {
		(async () => {
			await loadWeb3()
			await loadBlockchainData()
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
									Royalty percentage
								</FormLabel>
								<Typography gutterBottom variant="body2">
									Take a percentage of sales when your NFT is traded	
								</Typography>
								<TextField {...royaltyPercentage} fullWidth />
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
								<MenuItem value="ethereum">
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
