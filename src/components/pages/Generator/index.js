import React, { useState, useEffect } from 'react';
import { Stack, Typography, Box, Grid, Fade, TextField, FormLabel } from 'ds/components';
import LinearProgress from '@mui/material/LinearProgress';
import Layers from './Layers';
import Images from './Images';
import Rarity from './Rarity';
import Settings from './Settings';
import { useGenerateCollection } from './hooks/useGenerateCollection';
import { useCollection } from 'libs/collection';
import CheckoutModal from './CheckoutModal';
import HelpIcon from '@mui/icons-material/Help';

import { Elements } from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import PaymentModal from './PaymentModal';

import config from 'config';
const stripePromise = loadStripe(config.stripe.publicKey);



const Generator = () => {
	const { done, progress } = useGenerateCollection();	
	const { isModalOpen, setIsModalOpen } = useCollection();
	const [ isCheckoutModalOpen, setIsCheckoutModalOpen ] = useState(false);

//	useEffect(() => console.log(progress), [progress]);
	

	return (
		<>
		<Fade in>
			<Stack gap={5} sx={{
				display: 'flex',
				p: 2
			}}>
				<Settings />
				<Grid container>
					<Grid md={3} item>
						<Layers />
					</Grid>
					<Grid md={6} item>
						<Images />
					</Grid>
					<Grid md={3} item>
						<Rarity
							setIsCheckoutModalOpen={setIsCheckoutModalOpen}
						/>
					</Grid>
				</Grid>

				<CheckoutModal
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
					progress={progress}
				/>


				<Elements stripe={stripePromise}>
					<PaymentModal
						setIsGeneratingModalOpen={setIsModalOpen}
						isModalOpen={isCheckoutModalOpen}
						setIsModalOpen={setIsCheckoutModalOpen}
					/>
				</Elements>

				<Stack direction="row" justifyContent="center" sx={{opacity: '.5'}}>
					<HelpIcon />
					<Typography sx={{ml: 1}} variant="h6">
						Need help? Watch this tutorial <a style={{color: 'blue'}} target="_blank" href="https://www.youtube.com/watch?v=El9ZnfTGh0s">here</a>
					</Typography>
				</Stack>
			</Stack>
		</Fade>
		</>
	)
};




export default Generator;

