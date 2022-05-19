import React from 'react';
import {
	Box,
	Grid,
	Typography,
	Button,
} from 'ds/components';
import { Stepper, Step, StepLabel } from '@mui/material';
import { NFTStack, ContractDetails } from '../../widgets';
import { useContractSettings } from './hooks/useContractSettings';

const NotComplete = ({ setIsModalOpen, contract, unRevealedtNftImage, revealedNftImage, nftPrice, contractState, setIsNftRevealEnabled }) => {
	const activeStep = contract?.nftCollection?.baseUri && 2 || 1;
	const { mint, isMinting } = useContractSettings();

	return (
		<React.Fragment>
			<Grid container>
				<Grid item xs={12} md={7}>
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
										setIsModalOpen(true);
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

									{(activeStep !== 1) && <Button
										variant="contained"
										size="small"
										onClick={() => mint(methodProps, 1)}
										disabled={!contractState?.isPublicSaleOpen || isMinting}
									>
										{isMinting && <CircularProgress isButtonSpinner={true} /> || null}
										Mint a {contract?.blockchain} token
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
					md={5}
				>
					<NFTStack
						contract={contract}
						nftPrice={nftPrice}
						disabled={!contract?.id}
						unRevealedtNftImage={unRevealedtNftImage}
						revealedNftImage={revealedNftImage}
						setIsModalOpen={setIsModalOpen}
						setIsNftRevealEnabled={setIsNftRevealEnabled}
					/>

				</Grid>
			</Grid>
		</React.Fragment>
	)
};

export default NotComplete;
