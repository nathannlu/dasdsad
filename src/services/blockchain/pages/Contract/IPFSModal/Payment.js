import React, { useEffect } from 'react';
import CheckoutForm from 'components/pages/Payments/CheckoutForm';
import config from 'config';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(config?.stripe?.publicKey);
import posthog from 'posthog-js';
import { Grid, Button } from 'ds/components';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Payment = (props) => {
    useEffect(() => {
        // If contract is subscribed, skip to next step
        if (props.isActive && props.contract.isSubscribed) {
            props.nextStep();
        }
    }, [props]);

    const callback = () => {
        if (props.nftStorageType === 's3') {
            posthog.capture('User subscribed to S3 hosting', {
                $set: {
                    paidForS3Hosting: true,
                },
            });
        } else {
            posthog.capture('User subscribed to IPFS', {
                $set: {
                    paidForIPFSHosting: true,
                },
            });
        }

        props.nextStep();
    };

    return (
        <Elements stripe={stripePromise}>
            <Grid container={true} justifyContent="flex-end">
                <Button color="info" size="small" variant="contained" onClick={e => props.goToStep(1)}>
                    <ArrowBackIcon />&nbsp;Go Back
                </Button>
            </Grid>

            <CheckoutForm
                planId={config.stripe.products.contract}
                callback={callback}
                contractId={props.contractId}
                nftStorageType={props.nftStorageType}
            />
        </Elements>
    );
};

export default Payment;
