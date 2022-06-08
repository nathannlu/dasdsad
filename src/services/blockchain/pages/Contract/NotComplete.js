import React, { useState, useEffect } from 'react';
import { useWeb3 } from 'libs/web3';

import { useDeployContract } from './hooks/useDeployContract';
import { Stack, Typography, Box, Button, FormLabel, TextField, IconButton } from 'ds/components';
import { useToast } from 'ds/hooks/useToast';
import { useSolanaCreators } from './hooks/useSolanaCreators';
import { DeleteOutline as DeleteOutlineIcon } from '@mui/icons-material';
import { Stepper, Step, StepLabel, StepContent, Alert } from '@mui/material';

const NotComplete = ({ id, contract, setIsModalOpen }) => {
	const { addToast } = useToast();
	const [activeStep, setActiveStep] = useState(0);

	const { deployContract } = useDeployContract(contract);
	const { walletController } = useWeb3();
	const walletAddress = walletController?.state.address;
	const {
		settingsForm,
		addCreator,
		removeCreator,
		creators,
	} = useSolanaCreators(walletAddress);

	useEffect(() => {
		const step = contract?.nftCollection?.baseUri ? 1 : 0;
		setActiveStep(step)
	}, [contract?.nftCollection?.baseUri])

	return (
		<Stepper activeStep={activeStep} orientation="vertical">
			<Step>
				<StepLabel>
					<Typography variant="h6" sx={{ fontWeight: 'bold' }}>
						Set NFT assets location
					</Typography>
				</StepLabel>
				<StepContent>
					<Stack>
						<Typography variant="body">
							Link your metadata and images to the smart contract.
						</Typography>
						<Box>
							<Button
								variant="contained"
								onClick={() => setIsModalOpen(true)}>
								Connect your images
							</Button>
						</Box>
					</Stack>
				</StepContent>
			</Step>


			{contract?.blockchain === 'solana' || contract?.blockchain === 'solanadevnet' ? (
				<Step>
					<StepLabel>
						<Typography variant="h6" sx={{ fontWeight: 'bold' }}>
							Add Solana creator shares
						</Typography>
					</StepLabel>
					<StepContent>
						<Stack direction="row" spacing={1} width="100%">
							<Box flex="1">
								<FormLabel>Creator Address</FormLabel>
								<TextField {...settingsForm.creatorAddress} fullWidth />
							</Box>
							<Box flex="1">
								<FormLabel>Creator Share</FormLabel>
								<TextField {...settingsForm.creatorShare} fullWidth />
							</Box>
							<Box display="flex" alignItems="flex-end">
								<FormLabel></FormLabel>
								<Button
									style={{
										backgroundColor: 'rgb(25,26,36)',
										color: 'white',
									}}
									onClick={addCreator}>
									Add
								</Button>
							</Box>
						</Stack>
						<Box my={3}>
							<Stack>
								<Typography sx={{fontWeight: 'bold'}}>
									list of creators in your smart contract.
								</Typography>
								<Typography>
									Total creator shares must add up to 100 (e.g. address1 has 30 then address2 must have 70). Solana smart contracts limit the amount of creators to 4. By default, your address has been added with 100.
								</Typography>


								<Stack gap={1}>
									{creators?.map((creator, idx) => (
										<Stack
											direction="row"
											spacing={2}
											key={idx}
											alignItems="center">
											<Typography fontSize="10">
												{creator.address}
											</Typography>
											<Typography fontSize="10">
												{creator.share}
											</Typography>
											<IconButton onClick={() => removeCreator(idx)}>
												<DeleteOutlineIcon
													style={{
														color: 'rgb(230, 230, 230)',
													}}
												/>
											</IconButton>
										</Stack>
									))}
								</Stack>
							</Stack>
						</Box>
						<Button onClick={() => setActiveStep(2)} size="small" variant="contained">
							Next
						</Button>
					</StepContent>
				</Step>
			) : null}


			<Step>
				<StepLabel>
					<Typography variant="h6" sx={{ fontWeight: 'bold' }}>
						Deploy to the blockchain
					</Typography>
				</StepLabel>
				<StepContent>
					<Stack>
						<Typography variant="body">
							Deploy your smart contract to the blockchain in
							order to accept public mints, configure whitelists,
							set public sale.
						</Typography>
						<Box>
							<Button
								onClick={async () => {
									await walletController.compareNetwork(
										contract?.blockchain,
										async (error) => {
											if (error) {
												console.error(error);
												addToast({
													severity: 'error',
													message: e.message,
												});
												return;
											}
											await deployContract(creators);
										}
									);
								}}
								variant="contained">
								Deploy to blockchain
							</Button>
							<Button onClick={() => setActiveStep(1)} size="small">
								Edit creator shares
							</Button>
						</Box>
						{contract.blockchain === 'solana' ||
							contract.blockchain === 'solanadevnet' ? (
								<Alert
									severity="info"
									sx={{ mt: 2, maxWidth: '740px' }}>
									<Stack gap={1}>
										<Box>
											Setting up a candy machine project
											means that you have to pay a
											one-time fee (porportional to your
											collection size) to Solana in order
											to store the candy machine config on
											their blockchain.
										</Box>

										<Stack direction="row">
											Your collection size:
											<Box sx={{ fontWeight: 'bold' }}>
												{contract.nftCollection.size}
											</Box>
										</Stack>

										<Stack direction="row">
											Your estimated fees for Solana rent:
											<Box sx={{ fontWeight: 'bold' }}>
												{(
													contract.nftCollection
														.size * 0.001672
												).toFixed(2)}{' '}
												sol
											</Box>
										</Stack>

										<Box>
											This is a rough estimate. You may
											need more or less than the estimated
											amount.
										</Box>
									</Stack>
								</Alert>
							) : null}
					</Stack>
				</StepContent>
			</Step>
		</Stepper>
	);
};

export default NotComplete;
