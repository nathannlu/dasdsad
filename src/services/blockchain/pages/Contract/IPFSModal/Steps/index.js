import React from 'react';

const Steps = () => {
	
	return (
		<>
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
		</>
	)
};

export default Steps;
