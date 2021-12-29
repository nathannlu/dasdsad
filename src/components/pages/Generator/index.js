import React, { useState, useEffect } from 'react';
import { Stack, Typography, Box, Grid, Fade, TextField, FormLabel } from 'ds/components';

import Settings from './01_Settings';
import Layers from './02_Layers';
import Traits from './03_Traits';
import Rarity from './04_Rarity';
import Payment from './05_Payment';
import Generating from './06_Generating';
import StepWizard from 'react-step-wizard';
import Model from './Model';
import HelpIcon from '@mui/icons-material/Help';

import PaymentModal from './PaymentModal';
import CheckoutModal from './CheckoutModal';
import { useGenerateCollection } from './hooks/useGenerateCollection';
import { useCollection } from 'libs/collection';
import LinearProgress from '@mui/material/LinearProgress';






const Generator = () => {
	const { done, progress } = useGenerateCollection();	
	const { isModalOpen, setIsModalOpen } = useCollection();
	const [ isCheckoutModalOpen, setIsCheckoutModalOpen ] = useState(false);
	const [activeStep, setActiveStep] = useState(1);

//	useEffect(() => console.log(progress), [progress]);

	return (
		<>
		<Fade in>
			<Box>
				<Grid container>
					<Grid xs={6} item>
						<Stack gap={2} sx={{backgroundColor: 'white', borderRadius: 3, p: 2, height: '100vh', paddingTop: '120px'}}>
							<StepWizard onStepChange={s => setActiveStep(s.activeStep)}>
								<Settings />
								<Layers />
								<Traits />
								<Rarity />
								<Payment />
								<Generating />
							</StepWizard>
						</Stack>
					</Grid>
					<Grid alignItems="center" justifyItems="center" xs={6} item>
						<Model activeStep={activeStep} />
					</Grid>
				</Grid>

				<CheckoutModal
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
					progress={progress}
				/>


				{/*
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
				*/}
			</Box>
		</Fade>
		</>
	)
};




export default Generator;

