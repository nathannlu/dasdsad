import React from 'react';
import {
	Menu,
	MenuItem,
	Container,
	Button,
	IconButton,
	Link,
	Box,
	Typography,
	Stack,
	Card,
	Grid,
	Fade,
} from 'ds/components';
import posthog from 'posthog-js';

const Dashboard = () => {

	const logUserClickedOnCollection = () => {
		posthog.capture('User selected service', {
			service: 'NFT launchpad',
		});
	}

	const logUserClickedOnWebsite = () => {
		posthog.capture('User selected service', {
			service: 'Website builder',
		});
	}


	return (
		<Fade in>
			<Container sx={{ pt: 4 }}>
				<Typography variant="h2" mb={2}>
					Welcome!
				</Typography>
				<Stack direction="horizontal" gap={2}>
					<Link onClick={logUserClickedOnCollection} style={{width: '100%'}} to="/smart-contracts/v2/new">
						<Box
							sx={{
								p: 3,
								mb: 3,
								width: '100%',
								color: 'white',
								border: '1px solid rgba(255,255,255,.15)',
								borderRadius: '5px',
								backgroundImage:
									'linear-gradient(to top right, #5CC9FA, #7371FF)',
								transition: 'all .2s',
								'&:hover': {
									boxShadow: '0 0 30px rgba(0,0,0,.3)',
								},
							}}>
							<Stack>
								<Typography
									sx={{ fontWeight: 'semibold' }}
									variant="h5">
									I want to launch an NFT collection
								</Typography>
								<Typography
									variant="body"
									sx={{ opacity: 0.8 }}
									mb={2}>
									Have your artwork ready and want to launch
									to testnet or mainnet? Deploy our advanced
									zero code smart contracts today!
								</Typography>
								<Box>
									<Button
										color="black"
										variant="contained"
										size="small">
										Start today!
									</Button>
								</Box>
							</Stack>
						</Box>
					</Link>

					<Link onClick={logUserClickedOnWebsite} style={{width: '100%'}} to="/websites/new">
						<Box
							sx={{
								p: 3,
								mb: 3,
								width: '100%',
								color: 'white',
								border: '1px solid rgba(255,255,255,.15)',
								borderRadius: '5px',
								backgroundImage:
									'linear-gradient(to top right, #577B93, #8CC098)',
								transition: 'all .2s',
								'&:hover': {
									boxShadow: '0 0 30px rgba(0,0,0,.3)',
								},
							}}>
							<Stack>
								<Typography
									sx={{ fontWeight: 'semibold' }}
									variant="h5">
									I want to build a minting website
								</Typography>
								<Typography
									variant="body"
									sx={{ opacity: 0.8 }}
									mb={2}>
									Our website editor enables creators to create
									high-end websites for their NFT projects.
									Specifically designed for
									launching NFT collections.
								</Typography>
								<Box>
									<Button
										variant="contained"
										color="black"
										size="small">
										Start today!
									</Button>
								</Box>
							</Stack>
						</Box>
					</Link>
				</Stack>
			</Container>
		</Fade>
	);
};

export default Dashboard;
