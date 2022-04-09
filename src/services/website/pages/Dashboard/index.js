import React from 'react';

import { Add as AddIcon } from '@mui/icons-material';
import { Box, Button, Card, Container, Fade, Grid, Stack, Typography } from 'ds/components';
import { Link, useHistory } from 'react-router-dom';
import { useWebsite } from 'services/website/provider';

const Pages = () => {
	const { website } = useWebsite();
	const hitory = useHistory();

	const onEditPage = (websiteTitle, pageName) => {
		hitory.push(`/websites/${websiteTitle}/${pageName}`);
	}

	return (
		<Fade in>
			<Container
				component="main"
				sx={{
					flexGrow: 1,
					overflow: 'hidden',
					marginTop: '65px'
				}}
			>
				{website && website !== undefined && Object.keys(website).length > 0 ? (
					<Stack gap={2}>
						<Box>
							<Typography variant="h4">
								Page Manager
							</Typography>
							<Typography gutterBottom variant="body">
								Manage & deploy your minting websites
							</Typography>
						</Box>

						<Grid container gap={2}>
							{website.pages == null ? (
								<Box> loading </Box>
							) : website.pages.map((page) => (
								<Fade key={page.name} in>
									<Grid item xs={3}>
										<Card variant="outlined" onClick={() => onEditPage(website.title, page.name)}>
											<Box sx={{ bgcolor: 'grey.100', p: 5 }}>
												<img style={{ width: '100%' }} src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d2aac51faa89e1bad8184d_minting-website-icon.png" />
											</Box>
											<Box sx={{
												bgcolor: 'white',
												p: 2
											}}>
												<Typography gutterBottom variant="h6">
													{name.value}
												</Typography>

												<Stack direction="row" gap={2}>
													<Button
														size="small"
														variant="contained"
													>
														Edit page
													</Button>
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
								<Stack gap={1} mb={1} direction="row" alignItems="center">
									<img
										style={{ height: '40px' }}
										src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d2aac51faa89e1bad8184d_minting-website-icon.png"
									/>
								</Stack>
								<Typography gutterBottom variant="h6" sx={{ fontWeight: 'bold' }}>
									Create your first no-code minting website
								</Typography>
								<Typography variant="body" sx={{ opacity: .8 }}>
									Use our no-code builder to create a minting page for your collection.
								</Typography>
							</Box>
							<Box>
								<Link to="/websites/new">
									<Button startIcon={<AddIcon />} variant="contained" size="small">
										Create minting website
									</Button>
								</Link>
							</Box>
						</Stack>
					</Grid>
				)}
			</Container>
		</Fade>
	)
};

export default Pages;
