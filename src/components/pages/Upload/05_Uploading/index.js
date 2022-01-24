import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Stack, Card, Typography, FormLabel, TextField, Box, Grid, Fade, MenuItem, LoadingButton } from 'ds/components';
import { Stepper, Step, StepLabel, StepContent } from '@mui/material';
import { useDeploy } from 'libs/deploy';
import CircularProgress from '@mui/material/CircularProgress';

const Uploading = () => {
	const { activeStep, pinImages, pinMetadata, deployContract, setActiveStep, imagesUrl, ipfsUrl, loading, error } = useDeploy();
	const history = useHistory();
	
	return (
		<Stack>
			<Stepper activeStep={activeStep} orientation="vertical">
				<Step>
					<StepLabel>
						<Typography variant="h6">
							Uploading images to decentralized storage
						</Typography>
					</StepLabel>
					<StepContent>
						<Stack gap={2}>
							{imagesUrl ? (
								<Box>
									Images uploaded to {imagesUrl}. Please verify the content is correct.
								</Box>
							) : (
								<CircularProgress />
							)}
							<Box>
								<Button 
									disabled={!imagesUrl} 
									size="small" 
									variant="contained" 
									onClick={async () => {
										setActiveStep(1)
										await pinMetadata()
									}}
								>
									Confirm
								</Button>
							</Box>
						</Stack>
					</StepContent>
				</Step>

				<Step>
					<StepLabel>
						<Typography variant="h6">
							Uploading metadata to decentralized storage
						</Typography>
					</StepLabel>
					<StepContent>
						<Stack gap={2}>
							{ipfsUrl ? (
								<Box>
									Metadata uploaded to {ipfsUrl}. Please verify the content is correct.
								</Box>
							) : (
								<CircularProgress />
							)}
							<Box>
								<Button
									disabled={!ipfsUrl}
									size="small"
									variant="contained"
									onClick={async () => {
										setActiveStep(2)
										await deployContract();
									}
								}>
									Confirm
								</Button>
							</Box>
						</Stack>
					</StepContent>
				</Step>

				<Step>
					<StepLabel>
						<Typography variant="h6">
							Deploying collection to the blockchain
						</Typography>
					</StepLabel>
					<StepContent>
						<Stack gap={2}>
							{loading ? (
								<Box>
									Your collection is live! Smart contract is deployed to this address {ipfsUrl}.
								</Box>
							) : (
								<CircularProgress />
							)}
							<Box>
								<Button
									disabled={loading}
									size="small" 
									variant="contained" 
									onClick={() => history.push('/dashboard')}
								>
									Finish
								</Button>
							</Box>
						</Stack>
					</StepContent>
				</Step>

				{error && (
					<Button
						size="small" 
						variant="contained" 
						onClick={pinImages}
					>
						Try again
					</Button>
				)}

			</Stepper>
		</Stack>
	)
};

export default Uploading;
