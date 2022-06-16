import React from 'react';
import { Box, Stack, Button, TextField, Typography } from 'ds/components';
import { useNewContractForm } from './hooks/useNewContractForm';

export const Step1 = ({ nextStep }) => {
	return (
		<Box>
			<Button onClick={nextStep}>Reveal</Button>
			<Button onClick={nextStep}>Unreveal</Button>

			<Button onClick={nextStep}>next</Button>
		</Box>
	);
};

export const Step2 = ({ nextStep }) => {
	const {
		newContractForm: { name, symbol, maxSupply, price },
		saveContract,
	} = useNewContractForm();

	return (
		<Stack>
			<Typography>Fill in the description</Typography>

			<TextField {...name} />
			<TextField {...symbol} />
			<TextField {...maxSupply} />
			<TextField {...price} />

			<Button onClick={() => saveContract()}>next</Button>
		</Stack>
	);
};
