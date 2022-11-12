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
import { useAnalytics } from 'libs/analytics';

const Dashboard = () => {
	const { logUserClickedOnCollection, logUserClickedOnWebsite } = useAnalytics()


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
								color: '#000',
								border: '1px solid rgb(226, 226, 226)',
								borderRadius: '12px',
								background: 'rgb(246, 242, 240)',
								transition: 'all .2s',
								'&:hover': {
									boxShadow: '0 0 30px rgba(0,0,0,.15)',
								},
							}}>
							<Stack>
								<img style={{height:'100px', objectFit: 'contain'}} src="/assets/images/cards-01.svg" />
								<Typography
									mt={1}
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
									<Button sx={{width: '100%'}} variant="outlined" size="small">
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
								color: '#fff',
								border: '1px solid rgb(226, 226, 226)',
								borderRadius: '12px',
								background: 'rgb(20, 35, 40)',
								transition: 'all .2s',
								'&:hover': {
									boxShadow: '0 0 30px rgba(0,0,0,.3)',
								},
							}}>
							<Stack>
								<img style={{height:'100px', objectFit: 'contain'}} src="/assets/images/minting-website.png" />
								<Typography
									mt={1}
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
										sx={{width:'100%'}}
										variant="outlined"
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
