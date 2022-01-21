import React from 'react';
import StepWizard from 'react-step-wizard';
import { Box } from 'ds/components';

import Settings from './01_Settings';
import Traits from './02_Traits';
import Metadata from './03_Metadata';
import Deploy from './04_Deploy';
import Preview from './00_Preview';

const Upload = () => {
	return (
		<Box mt={10}>
			<StepWizard 
				transitions={{}} 
			//	onStepChange={s => setActiveStep(s.activeStep)}
			>
				<Preview />
				<Settings />
				<Traits />
				<Metadata />
				<Deploy />
			</StepWizard>
		</Box>

	)
};

export default Upload;
