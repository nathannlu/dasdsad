import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, Stack } from 'ds/components';
import { Stepper, Step, StepLabel, StepContent, Typography, TextField } from '@mui/material';
import { useContract } from 'services/blockchain/provider';
import { useSetBaseUri, useSetUnRevealedBaseUri } from 'services/blockchain/gql/hooks/contract.hook';
import { useToast } from 'ds/hooks/useToast';

import UploadUnRevealedImage from './UploadUnRevealedImage';
import Traits from './Traits';
import Metadata from './Metadata';

const getComponents = (renderUploadUnRevealedImage, setActiveStep, contract, setIsModalOpen, id) => {
    const uploadUnRevealedImage = <UploadUnRevealedImage setActiveStep={setActiveStep} contract={contract} step={0} />;
    const traits = <Traits setActiveStep={setActiveStep} contract={contract} step={renderUploadUnRevealedImage && 1 || 0} />;
    const metadata = <Metadata setActiveStep={setActiveStep} contract={contract} step={renderUploadUnRevealedImage && 2 || 1} />;
    const confirmation = <Confirmation id={id} setIsModalOpen={setIsModalOpen} setActiveStep={setActiveStep} renderUploadUnRevealedImage={renderUploadUnRevealedImage} />;

    if (renderUploadUnRevealedImage) {
        return { 0: uploadUnRevealedImage, 1: traits, 2: metadata, 3: confirmation };
    }

    return { 0: traits, 1: metadata, 2: confirmation };
}

const Steps = ({ id, setIsModalOpen, contract, renderUploadUnRevealedImage }) => {
    const [activeStep, setActiveStep] = useState(0);

    return (
        <React.Fragment>
            <Stepper activeStep={activeStep}>
                {renderUploadUnRevealedImage && <Step>
                    <StepLabel>Upload Unrevealed image to IPFS</StepLabel>
                </Step> || null}

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

            {getComponents(renderUploadUnRevealedImage, setActiveStep, contract, setIsModalOpen, id)[activeStep]}

        </React.Fragment>
    );
};

const Confirmation = (props) => {
    const { imagesUrl, metadataUrl, ipfsUrl, unRevealedBaseUri } = useContract();
    const { addToast } = useToast();
    const [metadataPreview, setMetadataPreview] = useState('');

    const [setBaseUri] = useSetBaseUri({
        onCompleted: () => {
            addToast({
                severity: 'success',
                message: 'Successfully added contract base URI',
            });
            props.setIsModalOpen(false);
        },
    });

    const [setUnRevealedBaseUri] = useSetUnRevealedBaseUri({
        onCompleted: () => {
            addToast({
                severity: 'success',
                message: 'Successfully updated contract unrevealed base URI',
            });
        },
    });

    /**
     * restrict user from proceeding if
     * - imagesUrl is null
     *  or
     * - metadataUrl is null
     *  or
     * - ipfsUrl is null
     */
    useEffect(() => {
        if (!imagesUrl || !metadataUrl || !ipfsUrl || (!unRevealedBaseUri && props.renderUploadUnRevealedImage)) {
            addToast({
                severity: 'error',
                message: 'Oops! something went wrong. Please try again!',
            });
            props.setActiveStep(0);
            return;
        }

        // Get JSON from ipfsUrl
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                setMetadataPreview(JSON.stringify(JSON.parse(xhr.responseText), null, 2));
            }
        };
        xhr.open('GET', `https://gateway.pinata.cloud/ipfs/${metadataUrl}/1.json`, true);
        xhr.send();
    }, [imagesUrl, metadataUrl, ipfsUrl, unRevealedBaseUri, props.renderUploadUnRevealedImage]);

    return (
        <Stack gap={2}>
            <Box display='flex' sx={{ marginTop: '1em', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

                {props.renderUploadUnRevealedImage && <Box display='flex' flexDirection='column' alignItems='center' justifyContent='space-between'>
                    <Typography>
                        Un-revealed NFT Preview
                    </Typography>
                    <Box
                        component="img"
                        sx={{
                            height: 300,
                            width: 300,
                            objectFit: 'cover'
                        }}
                        alt="Un-revealed NFT Preview"
                        src={unRevealedBaseUri}
                    />
                    <Typography fontSize='8pt'>
                        Source:{' '}
                        <a
                            style={{ color: 'blue' }}
                            href={unRevealedBaseUri}
                            target="_blank"
                            rel="noreferrer">
                            {unRevealedBaseUri}
                        </a>
                    </Typography>
                </Box>}

                <Box display='flex' flexDirection='column' alignItems='center' justifyContent='space-between'>
                    <Typography>
                        NFT Preview
                    </Typography>
                    <Box
                        component="img"
                        sx={{
                            height: 300,
                            width: 300,
                            objectFit: 'cover'
                        }}
                        alt="NFT Preview"
                        src={`https://gateway.pinata.cloud/ipfs/${imagesUrl}/1.png`}
                    />
                    <Typography fontSize='8pt'>
                        Source:{' '}
                        <a
                            style={{ color: 'blue' }}
                            href={`https://gateway.pinata.cloud/ipfs/${imagesUrl}/1.png`}
                            target="_blank"
                            rel="noreferrer">
                            ipfs://{imagesUrl}/
                        </a>
                    </Typography>
                </Box>

                <Box display='flex' flexDirection='column' alignItems='center' justifyContent='space-between'>
                    <Typography>
                        Metadata Preview
                    </Typography>
                    <TextField
                        label=""
                        defaultValue=""
                        variant="filled"
                        value={metadataPreview}
                        multiline
                        rows={11}
                        maxRows={11}
                        fullWidth
                    />
                    <Typography fontSize='8pt'>
                        Source:{' '}
                        <a
                            style={{ color: 'blue' }}
                            href={`https://gateway.pinata.cloud/ipfs/${metadataUrl}/1.json`}
                            target="_blank"
                            rel="noreferrer">
                            {ipfsUrl}
                        </a>
                    </Typography>
                </Box>
            </Box>

            <Button
                variant="contained"
                onClick={() => {
                    if (props.renderUploadUnRevealedImage) {
                        setUnRevealedBaseUri({ variables: { unRevealedBaseUri, id: props.id } });
                    }
                    setBaseUri({ variables: { baseUri: ipfsUrl, id: props.id } });
                }}
            >
                Confirm
            </Button>
        </Stack>
    );
};

export default Steps;
