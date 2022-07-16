import React, { useState } from 'react';
import { Link, Fade, Stack, Typography, Grid, Button } from 'ds/components';
import config from 'config';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useGenerator } from 'services/generator/controllers/generator';
import { useMetadata } from 'services/generator/controllers/metadata';
import { useLayerManager } from 'services/generator/controllers/manager';
import PaymentModal from './PaymentModal';
import Model from '../New/Model';
import RenderModal from './RenderModal';
import DownloadModal from './DownloadModal';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const stripePromise = loadStripe(config?.stripe?.publicKey);

const Collection = () => {
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const {
        settingsForm: { size, name, description },
        metadataType,
    } = useMetadata();
    const {
        query: { layers },
    } = useLayerManager();
    const {
        generateImages,
        renderModalState,
        setRenderModalState,
        downloadModalState,
        setDownloadModalState,
        isFinished,
        generateJSONMetadata,
        isAutoSave,
        downloadCollection,
    } = useGenerator();

    return (
        <>
            <Fade in>
                <Stack
                    sx={{
                        display: 'flex',
                        backgroundColor: 'rgb(238, 238, 238)',
                        transition: '.2s all',
                    }}>
                    <Grid container>
                        <RenderModal
                            renderModalState={renderModalState}
                            setRenderModalState={setRenderModalState}
                        />
                        <DownloadModal
                            downloadModalState={downloadModalState}
                            setDownloadModalState={setDownloadModalState}
                        />
                        <Grid md={6} item p={4}>
                            {layers[0]?.images?.length ? (
                                <Stack spacing={8} height="100%">
                                    <Stack spacing={1}>
                                        <Typography variant="h3">
                                            Your collection
                                        </Typography>
                                        <Typography variant="body">
                                            Generate, download, or deploy your
                                            collection to a blockchain.
                                        </Typography>
                                    </Stack>
                                    <Stack spacing={2}>
                                        <Stack
                                            borderRadius="10px"
                                            backgroundColor="white"
                                            padding="2em"
                                            sx={{
                                                boxShadow:
                                                    '0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -2px rgb(0 0 0 / 5%);',
                                            }}>
                                            <Typography variant="h4">
                                                Generation Summary
                                            </Typography>
                                            <Typography variant="body">
                                                A general summary of your NFT
                                                collection.
                                            </Typography>
                                            <Stack spacing={1.5} padding="1em">
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems="center">
                                                    <InfoOutlinedIcon
                                                        fontSize="10pt"
                                                        style={{
                                                            color: 'rgb(180, 180, 180)',
                                                        }}
                                                    />
                                                    <Stack
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                        width="100%">
                                                        <Typography fontSize="14pt">
                                                            Name:
                                                        </Typography>
                                                        <Typography fontSize="12pt">
                                                            {!name?.value
                                                                ?.length
                                                                ? 'n/a'
                                                                : name?.value}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems="center">
                                                    <InfoOutlinedIcon
                                                        fontSize="10pt"
                                                        style={{
                                                            color: 'rgb(180, 180, 180)',
                                                        }}
                                                    />
                                                    <Stack
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                        width="100%">
                                                        <Typography fontSize="14pt">
                                                            Description:
                                                        </Typography>
                                                        <Typography fontSize="12pt">
                                                            {!description?.value
                                                                ?.length
                                                                ? 'n/a'
                                                                : description?.value}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems="center">
                                                    <InfoOutlinedIcon
                                                        fontSize="10pt"
                                                        style={{
                                                            color: 'rgb(180, 180, 180)',
                                                        }}
                                                    />
                                                    <Stack
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                        width="100%">
                                                        <Typography fontSize="14pt">
                                                            Layers:
                                                        </Typography>
                                                        <Stack
                                                            direction="row"
                                                            spacing={2}>
                                                            {layers?.map(
                                                                (
                                                                    layer,
                                                                    idx
                                                                ) => (
                                                                    <Typography
                                                                        key={
                                                                            idx
                                                                        }
                                                                        fontSize="12pt">
                                                                        {
                                                                            layer.name
                                                                        }
                                                                    </Typography>
                                                                )
                                                            )}
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems="center">
                                                    <InfoOutlinedIcon
                                                        fontSize="10pt"
                                                        style={{
                                                            color: 'rgb(180, 180, 180)',
                                                        }}
                                                    />
                                                    <Stack
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                        width="100%">
                                                        <Typography fontSize="14pt">
                                                            Metadata Type:
                                                        </Typography>
                                                        <Typography fontSize="12pt">
                                                            {metadataType?.toUpperCase()}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems="center">
                                                    <InfoOutlinedIcon
                                                        fontSize="10pt"
                                                        style={{
                                                            color: 'rgb(180, 180, 180)',
                                                        }}
                                                    />
                                                    <Stack
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                        width="100%">
                                                        <Typography fontSize="14pt">
                                                            Collection Count:
                                                        </Typography>
                                                        <Typography fontSize="12pt">
                                                            {size?.value} Unique
                                                            Images
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems="center">
                                                    <InfoOutlinedIcon
                                                        fontSize="10pt"
                                                        style={{
                                                            color: 'rgb(180, 180, 180)',
                                                        }}
                                                    />
                                                    <Stack
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                        width="100%">
                                                        <Typography fontSize="14pt">
                                                            Dimension:
                                                        </Typography>
                                                        <Typography fontSize="12pt">
                                                            {
                                                                layers[0]
                                                                    ?.images[0]
                                                                    ?.image
                                                                    ?.naturalWidth
                                                            }{' '}
                                                            x{' '}
                                                            {
                                                                layers[0]
                                                                    ?.images[0]
                                                                    ?.image
                                                                    ?.naturalHeight
                                                            }
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                setIsCheckoutModalOpen(true)
                                            }
                                            style={{
                                                backgroundColor:
                                                    'rgb(25,26,36)',
                                            }}
                                            mt="2em">
                                            Generate Collection
                                        </Button>
                                        {isFinished && (
                                            <Stack>
                                                {!isAutoSave ? (
                                                    <Button
                                                        variant="contained"
                                                        onClick={
                                                            downloadCollection
                                                        }
                                                        style={{
                                                            backgroundColor:
                                                                'rgb(25,26,36)',
                                                        }}
                                                        mt="2em"
                                                        endIcon={
                                                            <DownloadIcon />
                                                        }>
                                                        Download Collection
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="contained"
                                                        onClick={
                                                            generateJSONMetadata
                                                        }
                                                        style={{
                                                            backgroundColor:
                                                                'rgb(25,26,36)',
                                                        }}
                                                        mt="2em"
                                                        endIcon={
                                                            <DownloadIcon />
                                                        }>
                                                        Download Metadata
                                                    </Button>
                                                )}
                                            </Stack>
                                        )}
                                    </Stack>
                                </Stack>
                            ) : (
                                <Stack
                                    justifyContent="center"
                                    alignItems="center"
                                    spacing={2}
                                    height="100%">
                                    <Typography
                                        fontSize="32pt"
                                        sx={{ lineHeight: '20pt' }}>
                                        Something wrong occured 😥
                                    </Typography>
                                    <Typography fontSize="12pt">
                                        Please re-configure your nft collection.
                                    </Typography>
                                    <Link
                                        to="/generator"
                                        sx={{ marginTop: '2em' }}>
                                        <Button
                                            variant="contained"
                                            style={{
                                                backgroundColor:
                                                    'rgb(25,26,36)',
                                                color: 'white',
                                            }}>
                                            Go Back
                                        </Button>
                                    </Link>
                                </Stack>
                            )}
                        </Grid>
                        <Grid
                            md={6}
                            alignItems="center"
                            justifyItems="center"
                            item
                            sx={{
                                transition: 'all .5s',
                                height: '100%',
                            }}>
                            <Model activeStep={4} isLastStep={false} />
                        </Grid>
                    </Grid>

                    <Elements stripe={stripePromise}>
                        <PaymentModal
                            isModalOpen={isCheckoutModalOpen}
                            setIsModalOpen={setIsCheckoutModalOpen}
                        />
                    </Elements>
                </Stack>
            </Fade>
        </>
    );
};

export default Collection;
