import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, Stack, Link } from 'ds/components';
import {
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Typography,
    TextField,
} from '@mui/material';
import { useContract } from 'services/blockchain/provider';
import {
    useSetBaseUri,
    useSetUnRevealedBaseUri,
} from 'services/blockchain/gql/hooks/contract.hook';
import { useToast } from 'ds/hooks/useToast';
import { getNftStorageTypeLabel } from 'ambition-constants';

const Confirmation = (props) => {
    const { imagesUrl, baseUri, metadataUrl, ipfsUrl, unRevealedBaseUri } = useContract();
    const { addToast } = useToast();
    const [metadataPreview, setMetadataPreview] = useState();

    const [setBaseUri] = useSetBaseUri({
        onCompleted: () => {
            addToast({
                severity: 'success',
                message: 'Successfully added contract base URI',
            });
            props.setIsModalOpen(false, true);
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
        if (
            !imagesUrl ||
            !baseUri ||
            !unRevealedBaseUri && props.renderUploadUnRevealedImage
        ) {
            addToast({
                severity: 'error',
                message: 'Oops! something went wrong. Please try again!',
            });
            props.setActiveStep(0);
            return;
        }

        const url = props.nftStorageType === 's3' ? `${baseUri}/0.json` : `https://gateway.pinata.cloud/ipfs/${baseUri.substring(7, baseUri.length - 1)}/0.json`;

        //Get JSON from ipfsUrl
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                setMetadataPreview(JSON.parse(xhr.responseText));
            }
        };
        xhr.open('GET', url, true);
        xhr.send();
    }, [
        imagesUrl,
        baseUri,
        ipfsUrl,
        unRevealedBaseUri,
        props.renderUploadUnRevealedImage,
    ]);

    const nftStorageType = getNftStorageTypeLabel(props.nftStorageType);

    const imagesUrlLink = props.nftStorageType === 's3' ? `${imagesUrl}/0.png` : `https://gateway.pinata.cloud/ipfs/${imagesUrl?.substring(7, imagesUrl?.length - 1)}/0.png`;
    const unRevealedBaseUriLink = props.nftStorageType === 's3' ? `${unRevealedBaseUri}/0.json` : `https://gateway.pinata.cloud/ipfs/${unRevealedBaseUri.substring(7, unRevealedBaseUri.length - 1)}/0.json`;
    const baseUriLink = props.nftStorageType === 's3' ? `${baseUri}/0.json` : `https://gateway.pinata.cloud/ipfs/${baseUri.substring(7, baseUri.length - 1)}/0.json`;

    return (
        <Stack gap={2} marginTop='2em'>
            <Typography variant='body'>
                If your NFTs show here, then you have successfully connected your metadata and images.
            </Typography>
            <Box
                display='flex'
                gap={3}
            >
                <Box width='365px' borderRadius='10px' flex='1'>
                    <img
                        src={imagesUrlLink}
                        alt='NFT Picture'
                        borderRadius='10px'
                    />
                </Box>
                <Stack gap={4} flex='2'>
                    <Stack gap={2}>
                        <Typography variant='body' fontSize='9pt' fontWeight='bold'>
                            METADATA INFORMATION
                        </Typography>
                        <Stack gap='.5em'>
                            <Typography variant='body' fontWeight='bold' fontSize='14pt'>
                                {metadataPreview?.name}
                            </Typography>
                            <Typography variant='body'>
                                {metadataPreview?.description}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack gap={2}>
                        <Typography variant='body' fontSize='9pt' fontWeight='bold'>
                            PROPERTIES
                        </Typography>
                        <Stack direction='row' gap={1} flexWrap='wrap' maxW='685px'>
                            {metadataPreview?.attributes?.map((attribute, idx) => (
                                <Box
                                    display='flex'
                                    flexDirection='column'
                                    justifyContent='center'
                                    alignItems='center'
                                    border='1px solid #5AA2D9'
                                    padding='.5em'
                                    backgroundColor='#EFFAFE'
                                    borderRadius='5px'
                                    minWidth='130px'
                                    key={idx}
                                >
                                    <Typography variant='body' fontSize='9pt' color='#5AA2D9'>
                                        {attribute.trait_type.toUpperCase()}
                                    </Typography>
                                    <Typography variant='body' fontSize='9pt'>
                                        {attribute.value}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Stack>
                    <Stack gap={1}>
                        <Box>
                            <Typography fontSize='9pt' fontWeight='bold'>Pre-reveal</Typography>
                            <Typography fontSize='9pt'>Below is the {nftStorageType} url pointing to the metadata that was generated to support the pre-reveal image you uploaded in the first step.</Typography>
                        </Box>
                        <a href={unRevealedBaseUriLink} target='_blank'>
                            <Typography sx={{ fontWeight: 'bold', color: '#006aff' }} fontSize='8pt'>{unRevealedBaseUri}</Typography>
                        </a>
                    </Stack>
                    <Stack gap={1}>
                        <Box>
                            <Typography fontSize='9pt' fontWeight='bold'>Location of your NFT images on {nftStorageType}</Typography>
                            <Typography fontSize='9pt'>Below is the url pointing to the images uploaded in step 2. This data has been automatically linked with your metadata on {nftStorageType}</Typography>
                        </Box>
                        <a href={imagesUrlLink} target='_blank'>
                            <Typography sx={{ fontWeight: 'bold', color: '#006aff' }} fontSize='8pt'>{imagesUrl}</Typography>
                        </a>
                    </Stack>
                    <Stack gap={1}>
                        <Box>
                            <Typography fontSize='9pt' fontWeight='bold'>Location of your metadata</Typography>
                            <Typography fontSize='9pt'>Below is the {nftStorageType} url pointing to the metadata of your NFT collection. This metadata has been automatically linked with your images on {nftStorageType}</Typography>
                        </Box>
                        <a href={baseUriLink} target='_blank'>
                            <Typography sx={{ fontWeight: 'bold', color: '#006aff' }} fontSize='8pt'>{baseUri}</Typography>
                        </a>
                    </Stack>
                </Stack>
            </Box>

            <Box display='flex' justifyContent='flex-end' width='100%'>
                <Button
                    variant="contained"
                    onClick={() => {
											/*
                        const unRevealedBaseUri = props.nftStorageType === 's3' ? `${unRevealedBaseUri}/` : unRevealedBaseUri;
                        const baseUri = props.nftStorageType === 's3' ? `${baseUri}/` : `${baseUri}`;
												*/

                        if (props.renderUploadUnRevealedImage) {
                            setUnRevealedBaseUri({ variables: { unRevealedBaseUri, id: props.id } });
                        }

                        setBaseUri({ variables: { baseUri, id: props.id } });
                    }}
                >
                    Confirm
                </Button>
            </Box>
        </Stack>
    );
};

export default Confirmation;
