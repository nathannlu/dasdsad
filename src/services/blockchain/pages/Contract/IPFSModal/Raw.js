import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, IconButton, Stack } from 'ds/components';
import { Stepper, Step, StepLabel, StepContent } from '@mui/material';
import StepWizard from 'react-step-wizard';
import CloseIcon from '@mui/icons-material/Close';

import Preview from './Preview';
import ImportLink from './ImportLink';
import Payment from './Payment';
import Upload from './Upload';

// renderUploadUnRevealedImage={true} is currrntly only for erc-721a contracts
const IPFS = ({ contract, id, renderUploadUnRevealedImage }) => {
    const [initialStep, setInitialStep] = useState(1);

    useEffect(() => {
        // If contract is subscribed, skip to next step
        if (contract?.isSubscribed) {
            setInitialStep(4);
        }
    }, [contract]);

    return (
            <Box
                p={3}
                pt={1}
                sx={{
                    width: '1200px',
                    margin: '0 auto',
                    background: '#fff',
                    borderRadius: '10px'
                }}>

                <StepWizard initialStep={initialStep} transitions={{}}>
                    <Preview />
                    {/* user imports their own link */}
                    <ImportLink id={id} />

                    {/* uploads to ipfs with us */}
                    <Payment contractId={id} contract={contract} />
                    <Upload id={id} contract={contract} renderUploadUnRevealedImage={renderUploadUnRevealedImage} />
                </StepWizard>
            </Box>
    );
};

export default IPFS;
