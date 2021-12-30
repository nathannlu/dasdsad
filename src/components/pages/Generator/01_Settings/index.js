import React, { useState, useEffect } from 'react';
import { Stack, Grid, Box,Button, Typography, TextField, FormLabel } from 'ds/components';
import { Chip } from '@mui/material';
import { useMetadata } from 'core/metadata';


const Settings = props => {
	const { settingsForm } = useMetadata();

	return (
		<Stack gap={2} sx={{ height: '100%'}}>
			<Box md={3} item>
				<Chip sx={{opacity: .8, mb: 1}} label="Step 1/4" />
				<Typography variant="h2">
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

			<Box sx={{alignSelf: 'flex-end', justifySelf: 'flex-end'}} >
				<Button onClick={() => props.nextStep()}>
					Next
				</Button>
			</Box>
		</Stack>
	)
};

export default Settings;

