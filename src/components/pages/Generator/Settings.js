import React, { useState, useEffect } from 'react';
import { Stack, Grid, Box, Typography, TextField, FormLabel } from 'ds/components';
import { Chip } from '@mui/material';
import { useCollection } from 'libs/collection';


const Settings = () => {
	const { layers, setLayers, selected, setSelected, listOfWeights, setListOfWeights, settingsForm } = useCollection();

	return (
		<Grid container sx={{p: 2, background: 'white', borderRadius: 2, opacity: .8}}>
			<Grid md={3} item>
				<Chip sx={{opacity: .8, mb: 1}} label={"Step 0"} />
				<Typography variant="h5">
					Metadata & collection
				</Typography>
				<Typography variant="body">
					Edit fields below to configure your metadata
				</Typography>
			</Grid>

			<Grid md={3} p={1} item>
				<FormLabel>Name</FormLabel>
				<TextField {...settingsForm.name} fullWidth />
			</Grid>

			<Grid md={3} p={1}  item>
				<FormLabel>Description</FormLabel>
				<TextField  {...settingsForm.description} fullWidth/>
			</Grid>

			<Grid md={3} p={1} item>
				<FormLabel>Collection Size*</FormLabel>
				<TextField {...settingsForm.collectionSize} fullWidth />
			</Grid>
		</Grid>

	)
};

export default Settings;
