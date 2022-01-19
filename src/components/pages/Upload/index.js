import React from 'react';
import StepWizard from 'react-step-wizard';
import App from './app';

import Settings from './01_Settings';
import Traits from './02_Traits';
import Metadata from './03_Metadata';
import Deploy from './04_Deploy';

const Upload = () => {
	return (
		<StepWizard 
			transitions={{}} 
		//	onStepChange={s => setActiveStep(s.activeStep)}
		>
			<Settings />
			<Traits />
			<Metadata />
			<Deploy />
		</StepWizard>
	)
};

export default Upload;
