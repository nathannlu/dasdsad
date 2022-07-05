import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, Stack } from 'ds/components';
import { Stepper, Step, StepLabel, StepContent, Typography, TextField } from '@mui/material';
import { useContract } from 'services/blockchain/provider';
import { useSetBaseUri, useSetUnRevealedBaseUri } from 'services/blockchain/gql/hooks/contract.hook';
import { useToast } from 'ds/hooks/useToast';

import UploadUnRevealedImage from './UploadUnRevealedImage';
import Traits from './Traits';
import Metadata from './Metadata';
import Confirmation from './Confirmation';

const getComponents = (renderUploadUnRevealedImage, setActiveStep, contract, setIsModalOpen, id, nftStorageType) => {
    const uploadUnRevealedImage = <UploadUnRevealedImage nftStorageType={nftStorageType} setActiveStep={setActiveStep} contract={contract} step={0} />;
    const traits = <Traits nftStorageType={nftStorageType} setActiveStep={setActiveStep} contract={contract} step={renderUploadUnRevealedImage && 1 || 0} />;
    const metadata = <Metadata nftStorageType={nftStorageType} setActiveStep={setActiveStep} contract={contract} step={renderUploadUnRevealedImage && 2 || 1} />;
    const confirmation = <Confirmation nftStorageType={nftStorageType} id={id} setIsModalOpen={setIsModalOpen} setActiveStep={setActiveStep} renderUploadUnRevealedImage={renderUploadUnRevealedImage} />;

    if (renderUploadUnRevealedImage) {
        return { 0: uploadUnRevealedImage, 1: traits, 2: metadata, 3: confirmation };
    }

    return { 0: traits, 1: metadata, 2: confirmation };
}

const UploadSteps = ({ id, setIsModalOpen, contract, renderUploadUnRevealedImage, nftStorageType }) => {
    const [activeStep, setActiveStep] = useState(0);
    const _nftStorageType_ = nftStorageType === 's3' ? 'Ambition S3 Server' : 'IPFS';

    return (
        <React.Fragment>
            <Stepper activeStep={activeStep} sx={{ marginBottom: '1em' }}>
                {renderUploadUnRevealedImage && <Step>
                    <StepLabel>Upload Unrevealed image to {_nftStorageType_}</StepLabel>
                </Step> || null}

                <Step>
                    <StepLabel>Upload images to {_nftStorageType_}</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Upload metadata to {_nftStorageType_}</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Confirmation</StepLabel>
                </Step>
            </Stepper>

            {getComponents(renderUploadUnRevealedImage, setActiveStep, contract, setIsModalOpen, id, nftStorageType)[activeStep]}

        </React.Fragment>
    );
};


export default UploadSteps;
