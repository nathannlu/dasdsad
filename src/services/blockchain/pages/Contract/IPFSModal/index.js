import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, IconButton, Stack } from 'ds/components';
import { Stepper, Step, StepLabel, StepContent } from '@mui/material';
import StepWizard from 'react-step-wizard';
import CloseIcon from '@mui/icons-material/Close';

import Preview from './Preview';
import ImportLink from './ImportLink';
import Payment from './Payment';
import UploadSteps from './Upload';

export const IPFSModalContent = (props) => {
    const { contract, setIsModalOpen, id, renderUploadUnRevealedImage } = props;
    const [nftStorageType, setNftStorageType] = useState(); // 'ipfs' | 's3'

    // If contract is subscribed or if nftStorageType is 's3' skip to next step
    const initialStep = (contract?.isSubscribed || contract?.nftStorageType === 's3' || nftStorageType === 's3') ? 4 : 1;

    return (
        <StepWizard initialStep={initialStep} transitions={{}}>
            <Preview setNftStorageType={setNftStorageType} contract={contract} />
            {/* user imports their own link */}
            <ImportLink id={id} setIsModalOpen={setIsModalOpen} />

            {/* uploads to ipfs with us */}
            < Payment contractId={id} contract={contract} nftStorageType={nftStorageType} />
            <UploadSteps id={id} contract={contract} setIsModalOpen={setIsModalOpen} renderUploadUnRevealedImage={renderUploadUnRevealedImage} nftStorageType={contract.nftStorageType || nftStorageType} />
        </StepWizard>
    );
}

/**
 * renderUploadUnRevealedImage={true} is currrntly only for erc-721a contracts
 **/
const IPFSModal = (props) => {
    const { isModalOpen, setIsModalOpen } = props;

    return (
        <Modal
            open={isModalOpen}
            //onClose={()=>setIsModalOpen(false)}
            sx={{
                overflow: 'auto',
                alignItems: 'center',
                display: 'flex',
                zIndex: 5000
            }}
        >
            <Box
                p={3}
                pt={1}
                sx={{
                    width: '1200px',
                    margin: '0 auto',
                    background: '#fff',
                    borderRadius: '10px'
                }}>
                <Stack>
                    <IconButton sx={{ ml: 'auto' }}>
                        <CloseIcon onClick={() => setIsModalOpen(false)} />
                    </IconButton>
                </Stack>

                <IPFSModalContent {...props} />
            </Box>
        </Modal>
    );
};

export default IPFSModal;
