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
				<Typography variant="h3" sx={{fontWeight: 'bold'}}>
					Welcome
				</Typography>
				<Typography variant="body">
					Let's start working on your NFT project.
				</Typography>
				<Stack direction="horizontal" mt={3} gap={2}>
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
								<img style={{height:'100px', objectFit: 'contain'}} src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/63703766a2ecca669adb9faf_cards-01.svg" />
								<Typography
									mt={1}
									sx={{ fontWeight: 'semibold' }}
									variant="h5">
									Launch an NFT collection
								</Typography>
								<Typography
									variant="body"
									sx={{ opacity: 0.8 }}
									mb={2}>
									Have your artwork ready and want to launch
									to testnet or mainnet? Deploy our advanced
									zero code smart contracts today!
								</Typography>
								<Stack direction="row">
									<Box sx={{
										padding: '8px 12px',
										background: 'white',
										borderRadius: '9999px',
										fontSize: '14px',
										fontWeight: 500
									}}>
										Start today →
									</Box>
								</Stack>
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
								<img style={{height:'100px', objectFit: 'contain'}} src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/637037684a3e3c57f3990b6c_minting-website.png" />
								<Typography
									mt={1}
									sx={{ fontWeight: 500 }}
									variant="h5">
									Build a minting website
								</Typography>
								<Typography
									variant="body"
									sx={{ opacity: 0.8 }}
									mb={2}>
									Our website editor enables creators to create
									minting websites for their NFT projects.
									Specifically designed for
									launching NFT collections.
								</Typography>
								<Stack direction="row">
									<Box sx={{
										color: '#000',
										padding: '8px 12px',
										background: 'white',
										borderRadius: '9999px',
										fontSize: '14px',
										fontWeight: 500
									}}>
										Start today →
									</Box>
								</Stack>
							</Stack>
						</Box>
					</Link>
				</Stack>
				<Link to="/smart-contracts">
					View existing projects →
				</Link>
			</Container>
		</Fade>
	);
};

export default Dashboard;
