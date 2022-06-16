import React, { useState } from 'react';
import StepWizard from "react-step-wizard";
import { Stack, Box, Container } from 'ds/components';
import { useWeb3 } from 'libs/web3';
import { useToast } from 'ds/hooks/useToast';
import { Step1, Step2 } from './steps';


const New = () => {
	const [state, setState] = useState();

	return (
		<StepWizard>
			<Step1 />
			<Step2 />
		</StepWizard>
	)
};

export default New;
