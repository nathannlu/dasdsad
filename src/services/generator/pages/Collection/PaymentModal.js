import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import {
    Stack,
    FormLabel,
    TextField,
    LoadingButton,
    IconButton,
    Card,
    Typography,
    Divider,
    Button,
    Select,
    MenuItem,
} from 'ds/components';
import {
    Box,
    Modal,
    Grid
} from '@mui/material';
import { Lock as LockIcon, Close as CloseIcon } from '@mui/icons-material';
import { useCharge } from 'gql/hooks/billing.hook';
import { usePaymentForm } from '../New/hooks/usePaymentForm';
import { useGenerator } from 'services/generator/controllers/generator';
import { useMetadata } from 'services/generator/controllers/metadata';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useWeb3 } from 'libs/web3';

const CheckoutModal = ({ isModalOpen, setIsModalOpen }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { settingsForm } = useMetadata();
    const { generateImages, referral } = useGenerator();
    const { payGeneratorWithEth, loading: ethPayLoading } = useWeb3();

    const {
        paymentForm: { nameOnCard, email },
        onPaymentSuccess,
        onPaymentError,
    } = usePaymentForm();

    const completedTransaction = () => {
        setIsModalOpen(false);
        generateImages();
    };

    const [charge, { loading }] = useCharge({
        onCompleted: (data) => {
            completedTransaction();
            onPaymentSuccess(data);
        },
        onError: onPaymentError,
    });

    const smallerThanTablet = useMediaQuery((theme) =>
        theme.breakpoints.down('md')
    );

    const onSubmit = async (e) => {
        e.preventDefault();

        if (settingsForm.coupon.value == 'ch_3KD9JpJUIYorshTC0byzp3BZ') {
            setIsModalOpen(false);
            generateImages();
        } else {
            const card = elements.getElement(CardElement);
            const result = await stripe.createToken(card);

            charge({
                variables: {
                    token: result.token.id,
                    amount: 10 * settingsForm.size.value,
                    referral,
                },
            });
        }
    };

    return (
        <Modal
            open={isModalOpen}
            closeOnOuterClick={true}
            onClose={() => setIsModalOpen(false)}
            sx={{ overflow: 'auto', alignItems: 'center', display: 'flex' }}
        >
            <form
                onSubmit={onSubmit}
                style={{
                    width: '1200px',
                    margin: '0 auto',
                    height: smallerThanTablet ? '100%' : '',
                }}>
                <Stack
                    direction="row"
                    sx={{
                        bgcolor: 'white',
                        borderBottom: 1,
                        borderColor: 'grey.300',
                        p: 4,
                    }}>
                    <Typography variant="h4">Checkout</Typography>

                    <IconButton
                        sx={{ marginLeft: 'auto' }}
                        onClick={() => setIsModalOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
                <Grid container sx={{ bgcolor: 'grey.100', p: 4 }} gap={4}>
                    <Grid item md={6}>
                        <Stack gap={2}>
                            <LoadingButton
                                startIcon={<LockIcon />}
                                onClick={() => payGeneratorWithEth(settingsForm.size.value, completedTransaction)}
                                loading={ethPayLoading}
                                variant="contained"
                                color="black"
                                sx={{ color: 'white' }}
                            >
                                Pay {0.000034 * settingsForm.size.value} Eth now
                            </LoadingButton>
                            <Typography variant="h5">
                                Payment info <LockIcon />
                            </Typography>
                            <Card sx={{ p: 2 }}>
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
                                        <FormLabel>Name on Card:</FormLabel>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            {...nameOnCard}
                                        />
                                    </Box>
                                    <Box>
                                        <FormLabel>Email</FormLabel>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            {...email}
                                        />
                                    </Box>
                                    <LoadingButton
                                        startIcon={<LockIcon />}
                                        loading={loading}
                                        type="submit"
                                        variant="contained"
                                        fullWidth>
                                        Pay $
                                        {(
                                            0.1 * settingsForm.size.value -
                                            0.01
                                        ).toFixed(2)}{' '}
                                        USD now
                                    </LoadingButton>
                                    <TextField
                                        {...settingsForm.coupon}
                                        fullWidth
                                    />
                                </Stack>
                            </Card>
                        </Stack>
                    </Grid>
                    <Grid item md={5}>
                        <Stack gap={2}>
                            <Typography variant="h6">Order summary</Typography>
                            <Card sx={{ p: 2 }}>
                                <Stack gap={2}>
                                    <Typography variant="body1">
                                        Amount of NFTs Plan:{' '}
                                        {settingsForm.size.value}
                                    </Typography>
                                    <Typography variant="body1">
                                        Price per NFT generated: $0.10 USD
                                    </Typography>
                                    <Divider />
                                    <Typography variant="body1">
                                        Total due today $
                                        {(
                                            0.1 * settingsForm.size.value -
                                            0.01
                                        ).toFixed(2)}{' '}
                                        USD
                                    </Typography>
                                </Stack>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </Modal>
    );
};

export default CheckoutModal;
