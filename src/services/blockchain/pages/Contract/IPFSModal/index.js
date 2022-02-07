import React, { useState } from 'react';
import { Modal, Box, Button, Stack } from 'ds/components';
import { Stepper, Step, StepLabel, StepContent } from '@mui/material';
import { useContract } from 'services/blockchain/provider';
import { useSetBaseUri } from 'services/blockchain/gql/hooks/contract.hook';
import { useToast } from 'ds/hooks/useToast';
import StepWizard from 'react-step-wizard';

import Preview from './Preview';
import Traits from './Traits';
import Metadata from './Metadata';

const IPFSModal = ({ isModalOpen, setIsModalOpen, id }) => {
	const [activeStep, setActiveStep] = useState(0); 
	return (
		<Modal
			open={isModalOpen}
			onClose={()=>setIsModalOpen(false)}
			sx={{overflow: 'auto', alignItems: 'center', display: 'flex', zIndex: 5000}}
		>
			<Box p={2} sx={{
				width: '750px',
				margin: '0 auto',
				background: '#fff'
			}}>
				<StepWizard transitions={{}}>
					<Preview />
					<Box>
						<Stepper activeStep={activeStep}>
							<Step>
								<StepLabel>
									Upload images to IPFS
								</StepLabel>
							</Step>
							<Step>
								<StepLabel>
									Upload metadata to IPFS
								</StepLabel>
							</Step>
							<Step>
								<StepLabel>
									Confirmation
								</StepLabel>
							</Step>
						</Stepper>
						{{
							1: <Traits setActiveStep={setActiveStep} />,
							2: <Metadata setActiveStep={setActiveStep} />,
							3: <Confirmation id={id} setIsModalOpen={setIsModalOpen} />
						}[activeStep]}
					</Box>
				</StepWizard>
			</Box>
		</Modal>
	)
};




export default IPFSModal;
