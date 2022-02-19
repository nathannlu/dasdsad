import React, { useState } from 'react'
import { useContract } from 'services/blockchain/provider';
import { useEthereum } from 'services/blockchain/blockchains/hooks/useEthereum';
import { Stack, Typography, Box, Button } from 'ds/components';

import { Stepper, Step, StepLabel, StepContent } from '@mui/material';

const NotComplete = ({ id, contract, setIsModalOpen }) => {
	const { deployEthereumContract } = useEthereum();
	const { handleSelectNetwork } = useContract();
	
	const activeStep = contract?.nftCollection?.baseUri ? 1 : 0

	return (
		<Stepper activeStep={activeStep} orientation="vertical">
			<Step>
				<StepLabel>
						<Typography variant="h6" sx={{fontWeight:'bold'}}>
							Set NFT assets location
						</Typography>
				</StepLabel>
				<StepContent>
					<Stack>
						<Typography variant="body">
							Link your metadata and images to the smart contract.
						</Typography>
						<Box>
							<Button variant="contained" onClick={() => setIsModalOpen(true)}>
								Connect your images
							</Button>
						</Box>
					</Stack>
				</StepContent>
			</Step>

			<Step>
				<StepLabel>
						<Typography variant="h6" sx={{fontWeight:'bold'}}>
							Deploy to the blockchain
						</Typography>
				</StepLabel>
				<StepContent>
					<Stack>
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
								disabled={true}
							>
								{/*Deploy to blockchain*/}
								Temporarily unavailable
							</Button>
						</Box>
						<Typography variant="body">
							We are working on a planned maintenance. This feature will return on Feb 20, 2022.
						</Typography>


					</Stack>
				</StepContent>
			</Step>

		</Stepper>
	)
}

export default NotComplete;
