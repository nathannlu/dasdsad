import React, { useEffect, useState } from 'react';
import { useWeb3 } from 'libs/web3';
import { Container, Button, Stack, Card, Typography, FormLabel, TextField, Box, Grid, Fade, MenuItem, LoadingButton } from 'ds/components';
import { useDeploy } from 'libs/deploy';
import { useDeployContractForm } from '../hooks/useDeployContractForm';

import Folder from '@mui/icons-material/FolderOpenTwoTone';


const Deploy = (props) => {
	const {
		deployContractForm: {
			royaltyPercentage,
			priceInEth,
			maxSupply
		},
		selectInput,
		setSelectInput
	} = useDeploy();
	const { verifyStep1 } = useDeployContractForm();

	return (
		<Fade in>
			<Container>
				<Stack gap={3}>
					<Card sx={{p: 2}}>
						<Stack gap={3}>
							<Stack>
								<Typography gutterBottom variant="h4">
									01. Create NFT collection
								</Typography>
								<Typography gutterBottom variant="body">
									Fill in and configure your smart contracts
								</Typography>
							</Stack>

							{/*
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
							*/}

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
						</Stack>
					</Card>
					<Stack justifyContent="space-between" direction="row">
						<Button onClick={() => props.previousStep()}>
							Prev
						</Button>
						<Button onClick={() => verifyStep1() && props.nextStep()}>
							Next
						</Button>
					</Stack>
				</Stack>
			</Container>
		</Fade>
	)
};

export default Deploy;
