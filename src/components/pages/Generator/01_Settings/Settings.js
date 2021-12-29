import React, { useState, useEffect } from 'react';
import { Stack, Grid, Box, Typography, TextField, FormLabel } from 'ds/components';
import { Chip } from '@mui/material';
import { useCollection } from 'libs/collection';


const Settings = () => {
	const { layers, setLayers, selected, setSelected, listOfWeights, setListOfWeights, settingsForm } = useCollection();

	return (
		<Stack sx={{backgroundColor: 'white', borderRadius: 3, p: 2, height: '100%'}}>
			<Box md={3} item>
				<Chip sx={{opacity: .8, mb: 1}} label="Step 1/4" />
				<Typography variant="h5">
					Metadata & collection
				</Typography>
				<Typography variant="body">
					Edit fields below to configure your metadata
				</Typography>
			</Box>

			<Box>
				<FormLabel>Name</FormLabel>
				<TextField {...settingsForm.name} fullWidth />
			</Box>

			<Box>
				<FormLabel>Description</FormLabel>
				<TextField  {...settingsForm.description} fullWidth/>
			</Box>

			<Box>
				<FormLabel>Collection Size*</FormLabel>
				<TextField {...settingsForm.collectionSize} fullWidth />
			</Box>
		</Stack>
	)
};

export default Settings;
