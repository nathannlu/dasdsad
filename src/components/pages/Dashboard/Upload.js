import React from 'react';
import { Button, Link, Divider, Box, TextField, Typography, Stack, Card, Grid, Modal, Fade } from 'ds/components';
import { Edit as EditIcon, School as SchoolIcon, PlayCircleOutline as PlayIcon } from '@mui/icons-material'

const Collections = () => {
	
	return (
		<Fade in>
			<Grid container mt={4}>
				<Grid item xs={8}>
					<Box p={4} sx={{background: '#111111', height: '100vh', borderRadius: 4, boxShadow: '0 8px 30px rgba(0,0,0,.2)'}}>
						asd

					</Box>
				</Grid>

				<Grid item xs={3} mt={4} sx={{ml: 'auto'}}>
					<Stack direction="column" justifyContent="space-between" sx={{height: '80vh'}}>
						<Box>
							<Stack gap={1} mb={1} direction="row" alignItems="center">
								<img 
									style={{height: '50px'}}
									src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d2aac6943de77b8cf95ef1_deploy-to-blockchain-icon.png" 
								/>
								<Typography variant="body" sx={{fontWeight: 'bold', opacity: .8}}>
									Smart contracts
								</Typography>
							</Stack>
							<Typography gutterBottom variant="h3">
								Deploy your NFT with no code
							</Typography>
							<Link to="/upload">
								<Button variant="contained">
									Deploy Collection
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
			</Grid>

		</Fade>
	)
};

export default Collections;
