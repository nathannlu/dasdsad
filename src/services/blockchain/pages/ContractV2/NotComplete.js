import React from 'react';
import {
	Stack,
	Box,
	Grid,
	Typography,
	Button,
} from 'ds/components';
import { Stepper, Step, StepLabel, Link } from '@mui/material';
import { BlankNFT, NFTStack, ContractDetails } from '../../widgets';

const NotComplete = ({ setIsModalOpen, contract }) => {
	const activeStep = contract?.nftCollection?.baseUri && 2 || 1;

	return (
		<React.Fragment>
			<Grid container>
				<Grid item>
					<ContractDetails contract={contract} />

					<Box mt={4}>
						<Typography sx={{ fontWeight: '500' }} variant="h5">
							Next steps
						</Typography>
						<Stepper sx={{ width: '400px' }} activeStep={activeStep} orientation="vertical">
							<Step>
								<StepLabel>
									<Typography sx={{ fontWeight: 'bold' }}>
										Deploy contract on <span sx={{ textTransform: 'capitalize' }}>{contract?.blockchain}</span>
									</Typography>
									<Typography>
										Configure your contract and deploy it on the <span sx={{ textTransform: 'capitalize' }}>{contract?.blockchain}</span> Test Network
									</Typography>
								</StepLabel>
							</Step>

							<Step>
								<StepLabel
									onClick={e => {
										if (activeStep !== 1) {
											e.preventDefault();
											return;
										}
										setIsModalOpen();
									}}
									sx={{ cursor: activeStep === 1 && 'pointer' || undefined }}
								>
									<Typography sx={{ fontWeight: 'bold' }}>
										Connect token image &amp; metadata
									</Typography>
									<Typography>
										Test out your contract by minting a test token
									</Typography>
								</StepLabel>
							</Step>

							<Step>
								<StepLabel>
									<Typography sx={{ fontWeight: 'bold' }}>
										Mint a token on <span sx={{ textTransform: 'capitalize' }}>{contract?.blockchain}</span>
									</Typography>
									<Typography>
										Test out your contract by minting a test token
									</Typography>

									{(activeStep !== 1) && <Button variant="contained" size="small">
										Mint a test token
										{/* @TODO wiring mint button */}
									</Button> || null}

								</StepLabel>
							</Step>

							<Step>
								<StepLabel>
									<Typography sx={{ fontWeight: 'bold' }}>
										Deploy contract on Mainnet
									</Typography>
									<Typography>
										You're officially ready for showtime!
									</Typography>
								</StepLabel>
							</Step>
						</Stepper>
					</Box>
				</Grid>

				<Grid
					item
					ml="auto"
					xs={12}
					md={6}
				>
					{activeStep === 1 && <BlankNFT contract={contract} setIsModalOpen={setIsModalOpen} /> || null}
					{activeStep !== 1 && <NFTStack contract={contract} /> || null}

				</Grid>
			</Grid>
		</React.Fragment>
	)
};

export default NotComplete;
