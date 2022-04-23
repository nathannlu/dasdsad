import React from 'react';

const Upload = () => {
	
	return (
		<>
							<Stepper activeStep={activeStep}>
                <Step>
                    <StepLabel>Upload images to IPFS</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Upload metadata to IPFS</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Confirmation</StepLabel>
                </Step>
            </Stepper>
            {
                {
                    0: <Traits setActiveStep={setActiveStep} />,
                    1: <Metadata setActiveStep={setActiveStep} />,
                    2: <Confirmation id={id} setIsModalOpen={setIsModalOpen} />,
                }[activeStep]
            }
		</>
	)
};

export default Upload
