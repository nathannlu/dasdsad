import React, { useState } from 'react';
import StepWizard from 'react-step-wizard';
import { Box, Fade, Grid, Stack } from 'ds/components';

import Settings from './01_Settings';
import Traits from './02_Traits';
import Metadata from './03_Metadata';
import Deploy from './04_Deploy';
import Preview from './00_Preview';
import Uploading from './05_Uploading';

import Model from './Model';

const Upload = () => {
	const [activeStep, setActiveStep] = useState();

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
				<Grid md={6} item sx={{transition: 'all .5s'}}>
					<Stack
						p={4}
						gap={2}
						sx={{
							backgroundColor: 'white',
							height: '100%',
						}}
					>
						<StepWizard transitions={{}} onStepChange={s => setActiveStep(s.activeStep)}>
							<Preview />
							<Settings />
							<Traits />
							<Metadata />
							<Deploy />
							<Uploading />
						</StepWizard>
					</Stack>
				</Grid>

				<Grid 
					md={6} 
					alignItems="center" 
					justifyContent="center" 
					item 
					sx={{
						display: 'flex',
						transition: 'all .5s',
						height: '100%',
						minHeight: '100vh'
					}}
				>
					<Model activeStep={activeStep} />
				</Grid>
			</Grid>
		</Fade>

	)
};

export default Upload;
