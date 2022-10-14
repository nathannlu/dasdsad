import React from 'react';

import { Add as AddIcon } from '@mui/icons-material';
import {
	Box,
	Button,
	Card,
	Container,
	Fade,
	Grid,
	Stack,
	Typography,
} from 'ds/components';
import PromotionalBanner from 'components/common/PromotionalBanner';
import { Link, useHistory } from 'react-router-dom';
import { useWebsite } from 'services/website/provider';

const Pages = () => {
	const { website, setWebsite, websites } = useWebsite();
	const hitory = useHistory();

	const onEditPage = (website, pageName) => {
		hitory.push(`/websites/${website.title}/${pageName}`);
		setWebsite(website)
	};

	return (
		<Fade in>
			<Container
				component="main"
				sx={{
					flexGrow: 1,
					overflow: 'hidden',
					pt: 4
				}}>
				{/*
				<PromotionalBanner />
				*/}
				{websites.length > 0 ? (
					<Stack gap={2}>
						<Stack direction="row" alignItems="center">
							<Box>
								<Typography variant="h4">
									Minting websites
								</Typography>
								<Typography gutterBottom variant="body">
									Manage & deploy your minting websites
								</Typography>
							</Box>
							<Stack gap={1} direction="row" sx={{ ml: 'auto' }}>
								<Link to="/websites/new">
									<Button
										size="small"
										startIcon={<AddIcon />}
										variant="contained">
										Create a website
									</Button>
								</Link>
							</Stack>
						</Stack>
						<Box></Box>

						<Grid container>
							{websites.map((website) => (
							<Fade key={website.title} in>
								<Grid item p={1} xs={3}>
									<Card
										variant="outlined"
										onClick={() =>
											onEditPage(website, "home")
										}>
										<Box
											sx={{
												bgcolor: 'grey.100',
												p: 5,
											}}>
											<img
												style={{
													width: '100%',
												}}
												src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d2aac51faa89e1bad8184d_minting-website-icon.png"
											/>
										</Box>
										<Box
											sx={{
												bgcolor: 'white',
												p: 2,
											}}>

											<Stack direction="row" gap={2}>
												<Typography>
													{website.title}
												</Typography>
												<Box sx={{ml: 'auto'}}>
													<Button
														size="small"
														variant="contained">
														Edit
													</Button>
												</Box>
											</Stack>
										</Box>
									</Card>
								</Grid>
							</Fade>
							))}
						</Grid>
					</Stack>
				) : (
					<Grid item xs={4} sx={{ margin: '0 auto' }}>
						<Stack mt={10} gap={2}>
							<Box>
								<Stack
									gap={1}
									mb={1}
									direction="row"
									alignItems="center">
									<img
										style={{ height: '40px' }}
										src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d2aac51faa89e1bad8184d_minting-website-icon.png"
									/>
								</Stack>
								<Typography
									gutterBottom
									variant="h6"
									sx={{ fontWeight: 'bold' }}>
									Create your first no-code minting website
								</Typography>
								<Typography
									variant="body"
									sx={{ opacity: 0.8 }}>
									Use our no-code builder to create a minting
									page for your collection.
								</Typography>
							</Box>
							<Box>
								<Link to="/websites/new">
									<Button
										startIcon={<AddIcon />}
										variant="contained"
										size="small">
										Create minting website
									</Button>
								</Link>
							</Box>
						</Stack>
					</Grid>
				)}
			</Container>
		</Fade>
	);
};

export default Pages;
