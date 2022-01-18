import React from 'react';
import StepWizard from 'react-step-wizard';
import App from './app';

import Deploy from './01_Deploy';
import Connect from './02_Connect';

const Upload = () => {
	return (
		<StepWizard 
			transitions={{}} 
		//	onStepChange={s => setActiveStep(s.activeStep)}
		>
			<Deploy />
			<Connect />
		</StepWizard>
	)
};

export default Upload;
