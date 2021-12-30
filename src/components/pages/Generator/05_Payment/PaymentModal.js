import React from 'react';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
import { Stack, FormLabel, TextField, Modal, Grid, Box, LoadingButton, Card, Typography, Divider, Button, Select, MenuItem } from 'ds/components';
import { Lock as LockIcon } from '@mui/icons-material';
import { useCharge } from 'gql/hooks/billing.hook';
import { usePaymentForm } from '../hooks/usePaymentForm';

import { useGenerator } from 'core/generator';
import { useMetadata } from 'core/metadata';


const CheckoutModal = ({ isModalOpen, setIsModalOpen, nextStep }) => {
	const stripe = useStripe();
  const elements = useElements();
	const { settingsForm  } = useMetadata();
	const { generateImages } = useGenerator();

	const {
		paymentForm: { nameOnCard, email },
		onPaymentSuccess,
		onPaymentError,
	} = usePaymentForm();
	const [ charge, { loading }] = useCharge({
		onCompleted: data => {
			onPaymentSuccess();
			setIsModalOpen(false);
			generateImages();
			nextStep();
		},
		onError: onPaymentError
	});

	const onSubmit = async e => {
		e.preventDefault();

		const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);

		charge({variables: {
			token: result.token.id,
			amount: 10 * settingsForm.collectionSize.value,
		}})
	}
	


	return (
		<Modal
			open={isModalOpen}
			closeOnOuterClick={true}
			onClose={()=>setIsModalOpen(false)}
			sx={{overflow: 'auto', alignItems: 'center', display: 'flex'}}
		>
			<form
				onSubmit={onSubmit}
				style={{
					width: '1200px',
					margin: '0 auto',
				}}
			>
				<Box sx={{bgcolor: 'white', borderBottom: 1, borderColor: 'grey.300', p: 4}}>
					<Typography variant="h4">
						Checkout
					</Typography>
				</Box>
				<Stack
					sx={{ bgcolor: 'grey.100', p: 4 }}
					direction="row" 
					gap={4}
				>
					<Grid item xs={7}>
						<Stack gap={2}>
							<Typography variant="h5">
								Payment info <LockIcon />
							</Typography>
							<Card sx={{p: 2}}>
								<Stack gap={2}>
									<Box>
										<FormLabel>
											Credit Card:
										</FormLabel>

										<CardElement
											options={{
												style: {
													base: {
														height: '1.4375em',
														padding: '8.5px 14px',
													}
												}
											}}
										/>

									</Box>
									<Box>
										<FormLabel>
											Name on Card:
										</FormLabel>
										<TextField size="small" fullWidth {...nameOnCard} />
									</Box>
									<Box>
										<FormLabel>
											Email
										</FormLabel>
										<TextField size="small" fullWidth {...email}  />
									</Box>

								</Stack>
							</Card>
						</Stack>
					</Grid>
					<Grid item xs={5}>
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

									<Divider />
										
									<LoadingButton 
										startIcon={<LockIcon />} 
										loading={loading} 
										type="submit" 
										variant="contained" 
										fullWidth
									>
										Pay ${(0.10 * settingsForm.collectionSize.value - .01).toFixed(2)} USD now
									</LoadingButton>
								</Stack>
							</Card>
						</Stack>
					</Grid>
				</Stack>
			</form>
		</Modal>
	)
};

export default CheckoutModal;
