import React from 'react';
import { Stack, Box, Grid, TextField, FormLabel } from 'ds/components';

import { useSettingsForm } from './hooks/useSettingsForm';

const ProjectSettings = props => {
	const { settingsForm: { name, description, collectionSize } } = useSettingsForm();

	return (
		<Stack sx={{p: 2, background: 'white', borderRadius: 2}}>
			<Box>
				<FormLabel>Project Name</FormLabel>
				<TextField {...name} />
			</Box>

			<Box>
				<FormLabel>Project Description</FormLabel>
				<TextField {...description} />
			</Box>

			<Box>
				<FormLabel>Collection Size</FormLabel>
				<TextField {...collectionSize} />
			</Box>

		</Stack>
	)
};

export default ProjectSettings;
