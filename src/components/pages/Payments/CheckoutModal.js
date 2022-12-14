import React from 'react';
import { usePaymentForm } from './hooks/usePaymentForm';
import { useGetPlanSettings } from './hooks/useGetPlanSettings';
import { useAuth } from 'libs/auth';
import { useSubscribePlan } from 'gql/hooks/billing.hook';

import {
    Stack,
    FormLabel,
    TextField,
    Modal,
    Grid,
    Box,
    LoadingButton,
    Card,
    Typography,
    Divider,
    CardElement,
    Button,
    Select,
    MenuItem,
} from 'ds/components';
import { Lock as LockIcon } from '@mui/icons-material';

const CheckoutModal = ({ isModalOpen, setIsModalOpen, planId, callback }) => {
    const { user } = useAuth();
    const { productPrices, selectedPlan, setSelectedPlan } =
        useGetPlanSettings(planId);
    const {
        paymentForm: {
            nameOnCard,
            addressLine1,
            addressLine2,
            city,
            state,
            country,
        },
        createPaymentMethod,
        onPaymentSuccess,
        onPaymentError,
    } = usePaymentForm();

    const [subscribe, { loading }] = useSubscribePlan({
        priceId: selectedPlan?.id,
        customerId: user.stripeCustomerId,
        onCompleted: (data) => {
            onPaymentSuccess(data);
            callback(data);
            setIsModalOpen(false);
        },
        onError: onPaymentError,
    });

    return (
        <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            sx={{
                overflow: 'auto',
                alignItems: 'center',
                display: 'flex',
                zIndex: 5000,
            }}>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    const { error, paymentMethod } =
                        await createPaymentMethod();
                    if (!error) {
                        subscribe({
                            variables: { paymentMethodId: paymentMethod.id },
                        });
                    }
                }}
                style={{
                    width: '1200px',
                    margin: '0 auto',
                }}>
                <Box
                    sx={{
                        bgcolor: 'white',
                        borderBottom: 1,
                        borderColor: 'grey.300',
                        p: 4,
                    }}>
                    <Typography variant="h4">Checkout</Typography>
                </Box>
                <Stack
                    sx={{ bgcolor: 'grey.100', p: 4 }}
                    direction="row"
                    gap={4}>
                    <Grid item xs={7}>
                        <Stack gap={2}>
                            <Typography variant="h5">
                                Billing frequency
                            </Typography>

                            <Stack direction="row" gap={2}>
                                {productPrices?.map((price, i) => (
                                    <Card
                                        key={i}
                                        onClick={() => setSelectedPlan(price)}
                                        sx={{
                                            border:
                                                selectedPlan?.id == price.id &&
                                                2,
                                            borderColor: 'primary.main',
                                            p: 2,
                                            flex: 1,
                                        }}>
                                        <Stack gap={3}>
                                            <Typography variant="h4">
                                                ${price.unit_amount / 100}
                                                <sub>/{price.frequency}</sub>
                                            </Typography>
                                            <Typography variant="small">
                                                ${price.unit_amount / 100}{' '}
                                                billed once a {price.frequency}
                                            </Typography>
                                        </Stack>
                                    </Card>
                                ))}
                            </Stack>

                            <Typography variant="h5">
                                Payment info <LockIcon />
                            </Typography>
                            <Card sx={{ p: 2 }}>
                                <Stack gap={2}>
                                    <Box>
                                        <FormLabel>Credit Card:</FormLabel>

                                        <CardElement
                                            options={{
                                                style: {
                                                    base: {
                                                        height: '1.4375em',
                                                        padding: '8.5px 14px',
                                                    },
                                                },
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

                                    {/*
									<Box>
										<FormLabel>
											Address Line 1:
										</FormLabel>
										<TextField size="small" fullWidth {...addressLine1} />
									</Box>
									<Box>
										<FormLabel>
											Address Line 2:
										</FormLabel>
										<TextField size="small" fullWidth {...addressLine2} />
									</Box>
									<Stack gap={2} direction="row">
										<Box sx={{flex: 1}}>
											<FormLabel>
												City
											</FormLabel>
											<TextField size="small" fullWidth {...city} />
										</Box>
										<Box sx={{flex: 1}}>
											<FormLabel>
												State
											</FormLabel>
											<TextField size="small" fullWidth {...state} />
										</Box>
									</Stack>
									<Box>
										<FormLabel>
											Country
										</FormLabel>
										<TextField size="small" fullWidth {...country} />
									</Box>
									<Box>
										<FormLabel>
											Country
										</FormLabel>
										<Select fullWidth size="small" {...country}>
											<MenuItem value="CA">Canada</MenuItem>
										</Select>
									</Box>
									*/}
                                </Stack>
                            </Card>
                        </Stack>
                    </Grid>
                    <Grid item xs={5}>
                        <Stack gap={2}>
                            <Typography variant="h6">Order summary</Typography>
                            <Card sx={{ p: 2 }}>
                                <Stack gap={2}>
                                    {/*
										<Typography variant="body1">
											Account Plan: ${selectedPlan?.unit_amount/100}
										</Typography>
										<Divider />
										*/}
                                    <Typography variant="body1">
                                        Total due today $
                                        {selectedPlan?.unit_amount / 100} USD
                                    </Typography>
                                    <Divider />

                                    <LoadingButton
                                        startIcon={<LockIcon />}
                                        loading={loading}
                                        type="submit"
                                        variant="contained"
                                        fullWidth>
                                        Pay ${selectedPlan?.unit_amount / 100}{' '}
                                        USD now
                                    </LoadingButton>
                                </Stack>
                            </Card>
                        </Stack>
                    </Grid>
                </Stack>
            </form>
        </Modal>
    );
};

export default CheckoutModal;
