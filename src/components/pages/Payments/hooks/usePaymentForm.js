import { useState } from 'react';
import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

export const usePaymentForm = (planId) => {
    const stripe = useStripe();
    const elements = useElements();

    const { addToast } = useToast();
    const { form: paymentForm } = useForm({
        nameOnCard: {
            default: '',
            rules: [],
        },
        addressLine1: {
            default: '',
            rules: [],
        },
        addressLine2: {
            default: '',
            rules: [],
        },
        city: {
            default: '',
            rules: [],
        },
        state: {
            default: '',
            rules: [],
        },
        country: {
            default: 'CA',
            rules: [],
        },
    });

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
                },
            },
        });

        if (error) {
            addToast({
                severity: 'error',
                message: error.code,
            });
        }

        return { error, paymentMethod };
    };

    const onPaymentSuccess = () => {
        addToast({
            severity: 'success',
            message: 'Success! You are now subscribed',
        });
    };

    const onPaymentError = (err) => {
        addToast({
            severity: 'error',
            message: err.message,
        });
    };

    return {
        paymentForm,
        createPaymentMethod,
        onPaymentSuccess,
        onPaymentError,
    };
};
