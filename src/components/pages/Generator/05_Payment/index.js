import React, { useEffect } from 'react';
import { Box, Stack, Button, Typography, Slider } from 'ds/components';
import { Chip } from '@mui/material'
import { useCollection } from 'libs/collection';

import { Elements } from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { useGenerateCollection } from '../hooks/useGenerateCollection';

import config from 'config';
const stripePromise = loadStripe(config.stripe.publicKey);

const Payment = props => {
	const { layers } = useCollection();
		const {
		generateImages,
		generatedZip,
		initWorker,
		done,
		progress,
		validateForm,
	} = useGenerateCollection()
	useEffect(initWorker, [])

	
	return (
		<Elements stripe={stripePromise}>
			<Stack>
				<Box>
					<Chip sx={{opacity: .8, mb: 1}} label={"Step 4/4"} />
					<Typography variant="h2">
						Last step
					</Typography>
					<Typography variant="body">
						Give your NFT collection unique characteristics
					</Typography>
				</Box>

				blah blah blah


				<Stack direction="row">
					<Button variant="contained" onClick={() => generateImages()}>
						Generate collection
					</Button>
				</Stack>
				<Stack direction="row">
					<Button onClick={() => props.previousStep()}>
						Prev
					</Button>
				</Stack>
			</Stack>
		</Elements>
	)
};

export default Payment;
