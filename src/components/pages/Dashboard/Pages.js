import React, { useState } from 'react';
import { Button, Divider, Box, TextField, Typography, Stack, Card, Grid, Modal, Fade } from 'ds/components';
import { useForm } from 'ds/hooks/useForm';
import { Link } from 'react-router-dom';
import { useWebsite } from 'libs/website';
import { useCreateWebsite } from 'gql/hooks/website.hook';
import { useToast } from 'ds/hooks/useToast';

import { Edit as EditIcon, School as SchoolIcon, PlayCircleOutline as PlayIcon } from '@mui/icons-material'

const Pages = () => {
	const { website } = useWebsite();
	const [title, setTitle] = useState();
	const { addToast } = useToast();
	const [createWebsite] = useCreateWebsite({
		title,
		onCompleted: data => {
			console.log(data);
		}
	})


	return (
		<Fade in>
			<Box 
				component="main"
				sx={{
					flexGrow: 1,
					overflow: 'hidden',
					marginTop: '65px'
				}}
			>
				{website && Object.keys(website).length > 0 ? (
					<Stack>
							<Box>
							<Typography gutterBottom variant="h4">
								Page Manager
							</Typography>
						</Box>

					<Grid container gap={2}>
						{website.pages == null ? (
							<Box> loading </Box>
						) : website.pages.map((page) => (
							<Fade key={page.name} in>
								<Grid item xs={4}>
									<Link to={`/builder/${website.title}/${page.name}`}>
										<Card variant="outlined">
											<Box sx={{ bgcolor: 'grey.300', p:5}}>
												<img style={{width: '100%'}} src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d2aac51faa89e1bad8184d_minting-website-icon.png" />
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
									</Link>
								</Grid>
							</Fade>
						))}
					</Grid>
					</Stack>
				) : (
					<Grid container mt={4}>
						<Grid item xs={3} mt={4}>
							<Stack direction="column" justifyContent="space-between" sx={{height: '80vh'}}>
								<Box>
									<Stack gap={1} mb={1} direction="row" alignItems="center">
										<img 
											style={{height: '50px'}}
											src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d2aac51faa89e1bad8184d_minting-website-icon.png" 
										/>
										<Typography variant="body" sx={{fontWeight: 'bold', opacity: .8}}>
											Website Builder
										</Typography>
									</Stack>
									<Typography gutterBottom variant="h3">
										Build a no-code minting website
									</Typography>
									<Link 
										to="/website"
									>
										<Button variant="contained">
											Build a website
										</Button>
									</Link>
								</Box>
								<Stack gap={3}>
									<Divider />
									<Typography variant="body">
										Easy-to-follow hands-on tutorials:
									</Typography>
									<Stack direction="row" gap={1} alignItems="center">
										<PlayIcon />
										<a href="https://youtu.be/El9ZnfTGh0s" target="_blank">
											Watch video tutorial here
										</a>
									</Stack>
									<Stack direction="row" gap={1} alignItems="center">
										<SchoolIcon />
										<a href="https://ambition.so/blog" target="_blank">
											Explore Ambition University
										</a>
									</Stack>
									<Divider />
								</Stack>
							</Stack>
						</Grid>
						<Grid item xs={8} sx={{ml: 'auto'}}>
							<Box sx={{background: 'white', height: '100vh', borderRadius: 4, boxShadow: '0 8px 30px rgba(0,0,0,.2)', overflow: 'hidden'}}>

								<img style={{width: '100%'}} src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61de5cfe5484ea0dae3bf312_screencapture-doodles-app-2022-01-11-20_44_51.png" />
							</Box>
						</Grid>
						{/*
						<Button variant="contained" onClick={createWebsite}>
							Create your new website
						</Button>
						<TextField onChange={e => setTitle(e.target.value)} />

						<Box 
							position="fixed" 
							alignItems="center" 
							justifyContent="center" 
							sx={{top: 0, left: 0, width: '100%', height: '100vh', background: 'rgba(0,0,0,.7)', display: 'flex'}}
						>
							<Box>
								<Typography sx={{color: 'white', fontWeight: 'bold'}}>
									Early access only
								</Typography>
								<Typography sx={{color: 'white'}}>
									Join our Discord to apply
								</Typography>
								<Box mt={1}>
									<a href="https://discord.gg/ZMputCvjVe" target="_blank">
										<Button variant="contained">
											Join Discord
										</Button>
									</a>
								</Box>
							</Box>
						</Box>
						*/}
					</Grid>
				)}

			</Box>
		</Fade>
	)
};

export default Pages;
