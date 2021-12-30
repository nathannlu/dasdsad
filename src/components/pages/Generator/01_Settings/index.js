import React, { useState, useEffect } from 'react';
import { Stack, Grid, Box,Button, Typography, TextField, FormLabel } from 'ds/components';
import { Chip } from '@mui/material';
import { useMetadata } from 'core/metadata';

import { useValidateForm } from '../hooks/useValidateForm'


const Settings = props => {
	const { settingsForm } = useMetadata();
	const { validateCollectionSize } = useValidateForm();

	return (
		<Stack justifyContent="space-between" sx={{minHeight: '90vh', paddingTop: '120px'}}>
			<Stack gap={2}>
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
			</Stack>

			<Box sx={{alignSelf: 'flex-end', justifySelf: 'flex-end'}} >
				<Button onClick={() => validateCollectionSize() && props.nextStep()}>
					Next
				</Button>
			</Box>
		</Stack>
	)
};

export default Settings;

