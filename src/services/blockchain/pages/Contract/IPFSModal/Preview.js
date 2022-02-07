import React from 'react';
import { Box, Grid, Stack, Typography, Button } from 'ds/components';

const Preview = (props) => {
	
	return (
		<Grid gap={2} container>
			<Grid 
				sx={{
					p:2,
					flex: 1,
					cursor: 'pointer',
					'&:hover': {
						background: '#eee'
					}
				}}
				item 
				onClick={() => props.goToStep(3)}
			>
				<Typography>
					Upload your images on our Decentralized network
				</Typography>
				<small>
					$19.99/mo
				</small>

				<Button>
					Next
				</Button>
			</Grid>
			<Grid 
				item 
				onClick={() => props.goToStep(2)}
				sx={{
					p: 2,
					flex: 1,
					cursor: 'pointer',
					'&:hover': {
						background: '#eee'
					}
				}}
			>
				<Typography>
					Host your own images
				</Typography>
				<Button>
					Next
				</Button>
			</Grid>


		</Grid>
	)
};

export default Preview;
