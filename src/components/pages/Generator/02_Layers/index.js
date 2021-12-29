import React from 'react';
import { Stack, Button } from 'ds/components';
import L from './Layers';

const Layers = props => {
	
	return (
		<Stack>
			<L />

			<Stack direction="row">
				<Button onClick={() => props.previousStep()}>
					Prev
				</Button>
				<Button onClick={() => props.nextStep()}>
					Next
				</Button>
			</Stack>
		</Stack>
	)
};

export default Layers;
