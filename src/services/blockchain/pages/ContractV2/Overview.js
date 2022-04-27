import React from 'react';
import NFT from './NFT';
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
import {
	Chip,
	Stepper,
	Step,
	StepLabel,
	StepContent,
} from '@mui/material';

const Overview = ({ setIsModalOpen }) => {
	return (
		<Box>

			<Stack mt={8}>
				<Container>
					<Grid container>
						<Grid item>
							<Box>
								<Stack
									gap={2}
									direction="horizontal"
									alignItems="center">
									<Typography variant="h4">
										Moonbirds
									</Typography>
									<Chip label="Rinkeby" color="warning" />
								</Stack>
								<Typography>ERC-721A</Typography>
							</Box>

							<Stack gap={2} mt={4}>
								<Box>
									<Typography
										sx={{ fontWeight: '600' }}
										variant="h6">
										Address
									</Typography>
									<Typography variant="body">
										0x123adsa123dsa123
									</Typography>
								</Box>

								<Box>
									<Typography
										sx={{ fontWeight: '600' }}
										variant="h6">
										Details
									</Typography>
									<Stack>
									<Typography variant="body">
										Collection size
									</Typography>
									<Typography variant="body">
										Balance:
									</Typography>
									<Typography variant="body">
										NFTs sold:
									</Typography>
									<Typography variant="body">
										Metadata URL
									</Typography>
									<Typography variant="body">
										Max per mint
									</Typography>
									<Typography variant="body">
										Max per wallet 
									</Typography>
									<Typography variant="body">
										sale status
									</Typography>
									</Stack>
								</Box>
							</Stack>
						</Grid>
						<Grid sx={{position:'relative'}} item ml="auto" xs={5}>
							<Box sx={{position:'absolute', top: 0}}>
								<NFT />
							</Box>
							<Box sx={{position:'absolute', top: 40, transform: 'scale(1.05)'}}>
								<NFT />
							</Box>
							<Box sx={{
								position:'absolute',
								top: 80,
								transform: 'scale(1.1)'
							}}>
								<NFT />
							</Box>
						</Grid>
					</Grid>
				</Container>
			</Stack>
		</Box>
	);
};

export default Overview;
