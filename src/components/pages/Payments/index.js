import React, { useState } from 'react';
import config from 'config';
import { useAuth } from 'libs/auth';
import { Fade, Container, Stack, Modal, Grid, List, Box, Button, Card, Typography, FormLabel, TextField } from 'ds/components';
import { Check as CheckIcon } from '@mui/icons-material';
import CheckoutModal from './CheckoutModal';

import { Elements } from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
const stripePromise = loadStripe(config.stripe.publicKey);


const Payment = () => {
	const { user } = useAuth();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [planId, setPlanId] = useState(null);

	const paymentPlans = [
		{
			planId: 'starter',
			title: 'Starter',
			price: '$0',
			features: [
				'Best for new agents',
				'Landing page builder',
				'SEO'
			],
			active: true,
		},
		{
			planId: 'prod_KHKOmJc6nz67ch',
			title: 'Agent',
			price: '$99',
			features: [
				'Everything in Starter plan',
				'MLS',
				'Listing manager'
			]
		}
	]

	return (
		<Fade in>
			<Box sx={{pt: 12, bgcolor: 'grey.100', minHeight: '100vh'}}>
				<Container>
					<Card sx={{p: 2}}>
						<Stack gap={3}>
							<Box>
								<Typography variant="h4">
									Account plans
								</Typography>
								<Typography variant="body1">
									Pick an account plan that fits your workflow. Add a site plan to any project when it's ready to go live.
								</Typography>
							</Box>

							<Grid gap={3} container>
								{paymentPlans.map((plan) => (
									<Grid item xs>
										<Card sx={{p: 3}}>
											<Stack gap={2}>
												<Typography variant="h5">
													{plan.title}
												</Typography>
												<Typography variant="h3">
													{plan.price}<sub>/mo</sub>
												</Typography>
												<Button 
													disabled={plan.active} 
													onClick={() => {
														setIsModalOpen(true)
														setPlanId(plan.planId)
													}}
													variant="contained"
												>
													{plan.active ? (<><CheckIcon /> Current Plan</>) : 'Upgrade Plan'}
												</Button>
												<List>
													{plan.features.map(feature => (
														<li>
															{feature}
														</li>
													))}
												</List>
											</Stack>
										</Card>
									</Grid>
								))}
							</Grid>
						</Stack>
					</Card>
				</Container>
				
				<Elements stripe={stripePromise}>
					<CheckoutModal 
						planId={planId}
						isModalOpen={isModalOpen}
						setIsModalOpen={setIsModalOpen} 
					/>
				</Elements>
			</Box>
		</Fade>
	)
};

export default Payment
