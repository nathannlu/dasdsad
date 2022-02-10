import React from 'react';
import { Box, Grid, Stack, Typography, Button } from 'ds/components';
import { Chip } from '@mui/material';
import posthog from 'posthog-js';

const Preview = (props) => {
	
	return (
		<Grid gap={2} container
			sx={{minHeight: '500px'}}
		>
			<Grid 
				sx={{
					p:3,
					flex: 1,
					cursor: 'pointer',
					boxShadow: 'inset 0 0 0 1px #ddd',
					transition: '.2s all',
					'&:hover': {
						background: '#f5f5f5',
						boxShadow: 'none'
					}
				}}
				item 
				onClick={() => {
					posthog.capture('User selected upload to IPFS');
					props.goToStep(3)
				}}
			>
				<Stack justifyContent="space-between" sx={{height: '100%'}}>
					<Box>
						<Stack gap={1} direction="row" alignItems="center">
							<Chip color="success" label="Suggested solution" />

							<Box>
								5 - 20 mins
							</Box>
						</Stack>
						<Typography gutterBottom variant="h5">
							Upload your images on our IPFS node
						</Typography>
						<Typography variant="body">
							Pin your images on our premium decentralized network for high availability, reliable displays. Built for NFTs.
						</Typography>
					</Box>
					<Stack direction="row">
						<Typography variant="h4">
							$19.99
						</Typography>
						<Typography variant="body">
							/mo
						</Typography>
					</Stack>
					<Box>
						<Button variant="contained" fullWidth>
							Next
						</Button>
					</Box>
				</Stack>


			</Grid>
			<Grid 
				item 
				onClick={() => {
					posthog.capture('User selected upload to personal storage');
					props.goToStep(2)
				}}
				sx={{
					p:3,
					flex: 1,
					cursor: 'pointer',
					boxShadow: 'inset 0 0 0 1px #ddd',
					transition: '.2s all',
					color: 'rgba(0,0,0,.8)',
					'&:hover': {
						background: '#f5f5f5',
						boxShadow: 'none',
						color: 'rgba(0,0,0,1)',
					}
				}}
			>
				<Stack justifyContent="space-between" sx={{height: '100%'}}>
					<Box>
						<Box>
							30 mins - 1 hour
						</Box>
						<Typography gutterBottom variant="h5">
							Host your own images
						</Typography>
						<Typography variant="body">
							Find a storage provider, upload your images, then update metadata with images URL.
						</Typography>
					</Box>
					<Box>
						<Button fullWidth>
							Next
						</Button>
					</Box>
				</Stack>
			</Grid>


		</Grid>
	)
};

export default Preview;
