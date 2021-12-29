import React, { useState, useEffect } from 'react';
import { Fade, Box, Divider, Stack, Button, Typography, Card, LoadingButton, Slider } from 'ds/components';
import { Chip } from '@mui/material'
import { useCollection } from 'libs/collection';

import { Elements } from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import config from 'config';
const stripePromise = loadStripe(config.stripe.publicKey);
import PaymentModal from './PaymentModal';



import { useGenerateCollection } from '../hooks/useGenerateCollection';

import { Lock as LockIcon } from '@mui/icons-material';


const Payment = props => {
	const [fadeIn, setFadeIn] = useState(false);
	const [ isCheckoutModalOpen, setIsCheckoutModalOpen ] = useState(false);

	const { layers, settingsForm } = useCollection();
	const {
		generateImages,
		generatedZip,
		initWorker,
		done,
		progress,
		validateForm,
	} = useGenerateCollection()
	useEffect(initWorker, [])

	useEffect(() => {
		if(props.isActive) {
			setTimeout(() => setFadeIn(true), 1800)
		} else {
			setFadeIn(false)
		}
	}, [props.isActive])

	
	return (
		<Fade in={fadeIn}>
			<Stack gap={2}>
				<Box>
					<Chip sx={{opacity: .8, mb: 1}} label={"Step 4/4"} />
					<Typography variant="h2">
						Last step
					</Typography>
					<Typography variant="body">
						Ready to launch the next BAYC?
					</Typography>
				</Box>


				<Stack gap={2}>
					<Typography variant="h6">
						Order summary
					</Typography>
					<Card sx={{p: 2}}>
						<Stack gap={2}>
							<Typography variant="body1">
								Amount of NFTs Plan: {settingsForm.collectionSize.value}
							</Typography>
							<Typography variant="body1">
								Price per NFT generated: $0.10 USD
							</Typography>
							<Divider />
							<Typography variant="body1">
								Total due today ${(0.10 * settingsForm.collectionSize.value - .01).toFixed(2)} USD
							</Typography>
						</Stack>
					</Card>
				</Stack>



				<Stack direction="row">
					<Button fullWidth variant="contained" onClick={() => setIsCheckoutModalOpen(true)}>
						Generate collection
					</Button>
				</Stack>
				<Stack direction="row">
					<Button onClick={() => props.previousStep()}>
						Prev
					</Button>
				</Stack>


				<Elements stripe={stripePromise}>
					<PaymentModal
						isModalOpen={isCheckoutModalOpen}
						nextStep={props.nextStep}
						setIsModalOpen={setIsCheckoutModalOpen}
					/>
				</Elements>
			</Stack>
		</Fade>
	)
};

export default Payment;


