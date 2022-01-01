import React from 'react';
import { Stack, Button } from 'ds/components';
import L from './Layers';
import { useValidateForm } from '../hooks/useValidateForm'

const Layers = props => {
	const { validateLayers } = useValidateForm();
	
	return (
		<Stack gap={2} justifyContent="space-between" sx={{minHeight: '90vh', paddingTop: '120px'}}>
			<L />

			<Stack justifyContent="space-between" direction="row">
				<Button onClick={() => props.previousStep()}>
					Prev
				</Button>
				<Button onClick={() => validateLayers() && props.nextStep()}>
					Next
				</Button>
			</Stack>
		</Stack>
	)
};

export default Layers;
