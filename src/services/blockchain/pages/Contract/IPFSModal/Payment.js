import React, { useEffect } from 'react';
import CheckoutForm from 'components/pages/Payments/CheckoutForm'
import config from 'config';
import { Elements } from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
const stripePromise = loadStripe(config.stripe.publicKey);
import posthog from 'posthog-js';

const Payment = (props) => {

	useEffect(() => {
		// If contract is subscribed, skip to next step
		
	}, [])

	const callback = () => {
		posthog.capture(
			'User subscribed to IPFS', {
				$set: {
					paidForIPFSHosting: true,
				}
		});

		props.nextStep();	
	}
	
	return (
		<Elements stripe={stripePromise}>
			<CheckoutForm planId={config.stripe.products.contract} callback={callback} />
		</Elements>
	)
};

export default Payment;
