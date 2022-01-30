import { useState } from 'react';
import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import posthog from 'posthog-js';
import { useMetadata } from 'services/generator/controllers/metadata';

export const usePaymentForm = (planId) => {
	const stripe = useStripe();
	const elements = useElements();
	const { settingsForm: { size }} = useMetadata();

	const { addToast } = useToast();
	const { form: paymentForm } = useForm({
		nameOnCard: {
			default: '',
			placeholder: 'John Doe',
			rules: [],
		},
		email: {
			default: '',
			placeholder: 'gmjohndoe@gmail.com',
			rules: [],
		}
	})



	const createPaymentMethod = async () => {
		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: 'card',
			card: elements.getElement(CardElement),
			billing_details: {
				name: paymentForm.nameOnCard.value,
				address: {
					line1: paymentForm.addressLine1.value,
					line2: paymentForm.addressLine2.value,
					city: paymentForm.city.value,
					state: paymentForm.state.value,
					country: paymentForm.country.value,
				}
			}
		})

		if (error) {
			addToast({
				severity: 'error',
				message: error.code
			});
		}

		return { error, paymentMethod }
	}

	const onPaymentSuccess = data => {
		addToast({
			severity: 'success',
			message: 'Success!'
		});
		posthog.capture(
			'User paid for NFT generation', {
				$set: {
					paidForNFTGeneration: true,
					collectionSize: size.value,
					stripeChargeId: data.charge
				}
		});

		setPaidCookie();
	}

	const onPaymentError = err => {
		addToast({
			severity: 'error',
			message: err.message
		});
		console.log(err.message)
	}

	const setPaidCookie = () => {
		
		// store email as a cookie in browser

		// store a hashed stripe transaction id
	}

	return {
		paymentForm,
		createPaymentMethod,
		onPaymentSuccess,
		onPaymentError,
	}
};

