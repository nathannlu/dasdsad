import React, { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone'
import { Stack, Box, Grid, Fade, TextField, FormLabel } from 'ds/components';
import { useCollection } from 'libs/collection';

import Layers from './Layers';
import Images from './Images';
import { useLayerManager } from './hooks/useLayerManager';

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
					<Grid xs={3}>
						<Layers />
					</Grid>
					<Grid xs={6}>
						<Images />
					</Grid>
					<Grid xs={3}>
						<Stack sx={{p: 2, background: 'white', borderRadius: 2}}>
							<FormLabel>Collection Size</FormLabel>
							<TextField  placeholder="100"/>
						</Stack>
					</Grid>
				</Grid>
			</Box>
		</Fade>
		</>
	)
};

export default Generator;
