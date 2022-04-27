import React from 'react';
import {
    Fade,
    Container,
    Link,
    TextField,
    Stack,
    Box,
    Grid,
    Typography,
    Button,
    Divider,
} from 'ds/components';
import { Chip, Stepper, Step, StepLabel, StepContent } from '@mui/material';


const Overview = ({setIsModalOpen}) => {
	return (
		<Stack mt={8}>
			<Container>
				<Grid container>
					<Grid item>
						<Box>
							<Stack gap={2} direction="horizontal" alignItems="center">
								<Typography variant="h4">
									Contract Name Here
								</Typography>
								<Chip label="Rinkeby" color="warning" />
							</Stack>
							<Typography>
								ERC721
							</Typography>
						</Box>


						<Box mt={4}>
							<Typography sx={{fontWeight:'500'}} variant="h5">
								Next steps
							</Typography>
							<Stepper sx={{
									width: '400px',
								}} 
								activeStep={1} 
								orientation="vertical"
							>
								<Step>
									<StepLabel>
										<Typography sx={{fontWeight: 'bold'}}>
											Deploy contract on Rinkeby
										</Typography>
										<Typography>
											Configure your contract and deploy it on the Rinkeby Test Network
										</Typography>
									</StepLabel>
								</Step>
								<Step>
									<StepLabel>
										<Typography sx={{fontWeight: 'bold'}}>
											Connect token image & metadata
										</Typography>
										<Typography>
											Test out your contract by minting a test token
										</Typography>
										<Button onClick={setIsModalOpen}>
											Next step
										</Button>
									</StepLabel>
								</Step>
								<Step>
									<StepLabel>
										<Typography sx={{fontWeight: 'bold'}}>
											Mint a token on Rinkeby
										</Typography>
										<Typography>
											Test out your contract by minting a test token
										</Typography>
									</StepLabel>
								</Step>
								<Step>
									<StepLabel>
										<Typography sx={{fontWeight: 'bold'}}>
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
						xs={6}
					>

						<Button variant="contained" size="small">
							Mint a test token
						</Button>
						<Button size="small">
							View minted NFT on etherscan
						</Button>
						<Box
						sx={{
							borderRadius: '10px',
							border: 'solid 2px white',
							background: 'rgba(0,0,0,.2)',
							boxShadow: '0 4px 8px rgba(0,0,0,.1)',
							backdropFilter: 'blur(3px)',
						}}
						p={3}
						>
						<Stack sx={{border: '1px solid black', height: '100%'}}>
							<Box sx={{height: '500px'}}>
										<Button onClick={setIsModalOpen}>
											Connect your images & metadata
										</Button>
							</Box>
							<Stack p={2} sx={{borderTop: '1px solid black'}}>
								<Typography variant="body" sx={{fontWeight: 'bold'}}>
									Collection name
								</Typography>
							</Stack>
							<Stack direction="horizontal">
								<Stack p={2} sx={{ flex: 1,borderRight: '1px solid black', borderTop: '1px solid black'}}>
									<Typography variant="body" sx={{fontWeight: 'bold'}}>
										Symbol
									</Typography>
								</Stack>
								<Stack p={2} sx={{ flex: 1, borderTop: '1px solid black' }}>
									<Typography variant="body" sx={{fontWeight: 'bold'}}>
										Collection size
									</Typography>
								</Stack>

							</Stack>
						</Stack>

					</Box>
					</Grid>
				</Grid>

			</Container>
		</Stack>
	)
};

export default Overview;
