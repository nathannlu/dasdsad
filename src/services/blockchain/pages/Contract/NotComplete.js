import React, { useState } from 'react'
import { useContract } from 'services/blockchain/provider';
import { useDeployContract } from './hooks/useDeployContract';
import { Stack, Typography, Box, Button } from 'ds/components';
import { useWeb3 } from 'libs/web3';

import { Stepper, Step, StepLabel, StepContent } from '@mui/material';

const NotComplete = ({ id, contract, setIsModalOpen }) => {
//    const { contract } = useContract();
    const { deployContract } = useDeployContract(contract);
	const {
        compareNetwork,
	} = useWeb3()

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
									await compareNetwork(contract?.blockchain);
									await deployContract();
								}}
								variant="contained"
							>
								Deploy to blockchain
							</Button>
						</Box>



					</Stack>
				</StepContent>
			</Step>

		</Stepper>
	)
}

export default NotComplete;
