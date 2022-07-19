import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Modal, Box, Typography } from 'ds/components';
import { Step, StepLabel, StepIcon, Stepper } from '@mui/material';

const StepperIcon = ({ active, completed }) => {

	return (
			<CircularProgress size={24} />
	)

}

const DeploymentStepModal = ({ blockchain, activeDeploymentStep, walletType, isModalOpen }) => {
    const deploymentSteps = [
        {
            key: 0,
            title: `Deploying Contract`,
            description: `Please be patient, this will take couple of seconds...`
        }, {
            key: 1,
            title: `Updating NFT metadata`,
            description: `Open ${walletType} and sign the transaction.`
        }, {
            key: 2,
            title: `Updating Sales Settings`,
            description: `Open ${walletType} and sign the transaction.`
        }
    ];



    return (
        <Modal
            open={isModalOpen}
            sx={{
                overflow: 'auto',
                alignItems: 'center',
                display: 'flex',
                zIndex: 6000
            }}
            onClose={e => { return; }}
        >
            <Box
                p={4}
                sx={{
                    width: '420px',
                    margin: '0 auto',
                    background: '#fff',
                    borderRadius: '8px'
                }}
            >
                <Typography variant="h6">
                    Deploying to {blockchain}
                </Typography>

                <Stepper orientation="vertical" activeStep={activeDeploymentStep}>
                    {deploymentSteps.map(step => (
                        <Step key={step.key}>
													{activeDeploymentStep == step.key ? (
														<StepLabel StepIconComponent={StepperIcon} optional={<Typography variant="caption">{step.description}</Typography>}>
                                {step.title}
                            </StepLabel>
													) : (
														<StepLabel optional={<Typography variant="caption">{step.description}</Typography>}>
                                {step.title}
                            </StepLabel>
													)}
                        </Step>
                    ))}
                </Stepper>
            </Box>
        </Modal>
    );
};

export default DeploymentStepModal;
