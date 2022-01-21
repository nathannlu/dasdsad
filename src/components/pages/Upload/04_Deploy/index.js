import React, { useEffect, useState } from 'react';
import { useWeb3 } from 'libs/web3';
import { Button, Stack, Card, Typography, FormLabel, TextField, Box, Grid, Fade, MenuItem, LoadingButton } from 'ds/components';
import { useDeploy } from 'libs/deploy';
import { Stepper, Step, StepLabel } from '@mui/material';

const Deploy = (props) => {
	const { account, loadWeb3, loadBlockchainData } = useWeb3();
	const { deployContract, start, activeStep } = useDeploy();

	useEffect(() => {
		(async () => {
			await loadWeb3()
			await loadBlockchainData()
		})()
	}, [])

	const steps = [
		{ label: 'Uploading images to IPFS'},
		{ label: 'Uploading metadata to IPFS'},
		{ label: 'Deploy smart contract'}
	]

	return (
		<Box>
			<Stack gap={3}>
				<Card sx={{p: 2}}>
					<Stack gap={3}>
						<Stack>
							<Typography gutterBottom variant="h4">
								04. Review and deploy
							</Typography>
							<Typography gutterBottom variant="body">
								Smart contract will be deployed under the current Metamask address:
							</Typography>
							<Typography gutterBottom variant="body">
								{account}
							</Typography>
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
								loading={start}
								variant="contained"
								fullWidth
							>
								Deploy
							</LoadingButton>
						</Stack>
					</Stack>
				</Card>

				{start && (
				<Stack>
					<Typography variant="h5">
						Progress
					</Typography>

					<Stepper activeStep={activeStep} orientation="vertical">
						{steps.map((step, index) => (
							<Step key={step.label}>
								<StepLabel>
									{step.label}
								</StepLabel>
							</Step>
						))}
					</Stepper>
				</Stack>
				)}


				<Stack justifyContent="space-between" direction="row">
					<Button onClick={() => props.previousStep()}>
						Prev
					</Button>
					<div />
				</Stack>
			</Stack>
		</Box>
	)
};

export default Deploy;
