import React, { useEffect } from 'react';
import CheckoutForm from 'components/pages/Payments/CheckoutForm'
import config from 'config';
import { Elements } from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
const stripePromise = loadStripe(config.stripe.publicKey);

const Payment = (props) => {

	useEffect(() => {
		// If contract is subscribed, skip to next step
		
	}, [])

	const callback = () => {
		props.nextStep();	
	}
	
	return (
		<Elements stripe={stripePromise}>
			<CheckoutForm planId={config.stripe.products.contract} callback={callback} />
		</Elements>
	)
};

export default Payment;
