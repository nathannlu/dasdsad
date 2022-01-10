import React, { useState, useEffect } from 'react';
import { useToast } from 'ds/hooks/useToast';
import { Stack, Typography, Box, Grid, Fade, TextField, FormLabel } from 'ds/components';
import StepWizard from 'react-step-wizard';
import useMediaQuery from '@mui/material/useMediaQuery';

import Settings from './01_Settings';
import Layers from './02_Layers';
import Traits from './03_Traits';
import Rarity from './04_Rarity';
import Payment from './05_Payment';
import Generating from './06_Generating';
import Model from './Model';


const Generator = () => {
	const [ isCheckoutModalOpen, setIsCheckoutModalOpen ] = useState(false);
	const [activeStep, setActiveStep] = useState(1);
	const isLastStep = activeStep == 5 || activeStep == 6;

	const smallerThanTablet = useMediaQuery(theme => theme.breakpoints.down('md'));


	return (
		<Fade in>
			<Grid 
				container
				sx={{
					minHeight: '100vh',
					overflow: 'hidden',
					bgcolor: '#191A24', position: 'relative'
				}}
			>
				<Grid md={!isLastStep ? 6 : 4} item sx={{transition: 'all .5s'}}>
					<Stack
						p={4}
						gap={2}
						sx={{
							backgroundColor: 'white',
							height: '100%',
						}}
					>
						<StepWizard transitions={{}} onStepChange={s => setActiveStep(s.activeStep)}>
							<Settings />
							<Layers />
							<Traits />
							<Rarity />
							<Payment setIsCheckoutModalOpen={setIsCheckoutModalOpen} />
							<Generating />
						</StepWizard>
					</Stack>
				</Grid>
				{!smallerThanTablet ? (
					<Grid 
						md={!isLastStep ? 6 : 8} 
						alignItems="center" 
						justifyItems="center" 
						item 
						sx={{
							transition: 'all .5s',
							height: '100%',
						}}
					>
						<Model activeStep={activeStep} isLastStep={isLastStep} />
					</Grid>
				): null}
			</Grid>
		</Fade>
	)
};




export default Generator;

