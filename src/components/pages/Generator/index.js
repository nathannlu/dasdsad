import React from 'react';
import { Stack, Box, Grid, Fade, TextField, FormLabel } from 'ds/components';
import Layers from './Layers';
import Images from './Images';
import Settings from './Settings';

const Generator = () => {
	return (
		<>
		<Fade in>
			<Box sx={{
				display: 'flex',
				bgcolor: 'grey.200',
				minHeight: '100vh',
				paddingTop: '64px'
			}}>
				<Grid container>
					<Grid xs={3} item>
						<Layers />
					</Grid>
					<Grid xs={6} item>
						<Images />
					</Grid>
					<Grid xs={3} item>
						<Settings />
					</Grid>
				</Grid>
			</Box>
		</Fade>
		</>
	)
};

export default Generator;
