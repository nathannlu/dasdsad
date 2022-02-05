import React, { useState, useEffect } from 'react';
import config from 'config';
import { useMetadata } from 'services/generator/controllers/metadata';
import { useLayerManager } from 'services/generator/controllers/manager';
import { useGenerator } from 'services/generator/controllers/generator';
import { Fade, Box, Divider, Stack, Button, Typography, Card, LoadingButton, Slider } from 'ds/components';
import { Chip } from '@mui/material'
import { Lock as LockIcon } from '@mui/icons-material';

import { Elements } from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
const stripePromise = loadStripe(config.stripe.publicKey);
import posthog from 'posthog-js';
import useMediaQuery from '@mui/material/useMediaQuery';

import PaymentModal from './PaymentModal';



const Payment = props => {
	const [fadeIn, setFadeIn] = useState(false);
	const [ isCheckoutModalOpen, setIsCheckoutModalOpen ] = useState(false);
	const { generateImages } = useGenerator();
	const { settingsForm } = useMetadata();
	const smallerThanTablet = useMediaQuery(theme => theme.breakpoints.down('md'));


	useEffect(() => {
		if(!smallerThanTablet) {
			if(props.isActive) {
				setTimeout(() => setFadeIn(true), 1700)
			} else {
				setFadeIn(false)
			}
		} else {
			setFadeIn(true)
		}

	}, [props.isActive])

	
	return (
		<Fade in={fadeIn}>
			<Stack justifyContent="space-between" sx={{minHeight: '90vh', paddingTop: '120px'}}>
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



					<Stack direction="row">
						<Button fullWidth variant="contained" onClick={() => {
							{/*
							generateImages();
							props.nextStep()
							*/}

							setIsCheckoutModalOpen(true)
							posthog.capture('User clicked on "Generate collection" button');
						}}>
							Generate collection
						</Button>
					</Stack>
				</Stack>

				<Stack justifyContent="space-between" direction="row">
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


