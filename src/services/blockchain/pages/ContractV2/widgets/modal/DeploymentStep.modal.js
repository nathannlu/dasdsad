import React from 'react';

import { Modal, Box, Typography } from 'ds/components';
import { Step, StepLabel, Stepper } from '@mui/material';

const DeploymentStepModal = ({ blockchain, activeDeploymentStep, walletType, isModalOpen }) => {
    const deploymentSteps = [
        {
            key: 0,
            title: `Awaiting signature`,
            description: `Open ${walletType} and sign the transaction.`
        }, {
            key: 1,
            title: `Deploying Contract`,
            description: `Please be patient, this will take couple of seconds...`
        }, {
            key: 2,
            title: `Updating NFT metadata`,
            description: `Open ${walletType} and sign the transaction.`
        }, {
            key: 3,
            title: `Updating Sales Settings`,
            description: `Open ${walletType} and sign the transaction.`
        }, {
            key: 4,
            title: `Confirming Deployment`,
            description: `Waiting for final transaction confirmation.`
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
                            <StepLabel optional={<Typography variant="caption">{step.description}</Typography>}>
                                {step.title}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        </Modal>
    );
};

export default DeploymentStepModal;