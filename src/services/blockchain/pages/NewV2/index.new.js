import React, { useState } from 'react';
import StepWizard from "react-step-wizard";
import { Stack, Box, Container } from 'ds/components';
import { useWeb3 } from 'libs/web3';
import { useToast } from 'ds/hooks/useToast';
import { Step1, Step2 } from './steps';


const New = () => {
	const [state, setState] = useState();

	return (
		<Box sx={{background: '#f5f5f5', minHeight: '100vh'}}>
			<Container>
				<StepWizard>
					<Step1 />
					<Step2 />
				</StepWizard>
			</Container>
		</Box>
	)
};

export default New;
