import React, { useState, useEffect } from 'react';
import config from 'config';
import { useMetadata } from 'core/metadata';
import { Fade, Box, Divider, Stack, Button, Typography, Card, LoadingButton, Slider } from 'ds/components';
import { Chip } from '@mui/material'
import { Lock as LockIcon } from '@mui/icons-material';

import { Elements } from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
const stripePromise = loadStripe(config.stripe.publicKey);

import PaymentModal from './PaymentModal';



const Payment = props => {
	const [fadeIn, setFadeIn] = useState(false);
	const [ isCheckoutModalOpen, setIsCheckoutModalOpen ] = useState(false);
	const { settingsForm } = useMetadata();

	useEffect(() => {
		if(props.isActive) {
			setTimeout(() => setFadeIn(true), 1700)
		} else {
			setFadeIn(false)
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
						<Button fullWidth variant="contained" onClick={() => props.nextStep()/*setIsCheckoutModalOpen(true)*/}>
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


