import React from 'react';

import { Button, CircularProgress, Grid, Stack, TextField, Typography } from 'ds/components';
import { Skeleton } from '@mui/material';
import { Lock as LockIcon, LockOpen as LockOpenIcon } from '@mui/icons-material';

import { getNftStorageTypeLabel } from 'ambition-constants';
import { IPFSModalContent } from '../../../Contract/IPFSModal';

const AdvancedSettingsModal = ({
    id,
    contractState,
    contract,
    updateSales,
    isSavingPublicSales,
    setPresales,
    isSavingPreSales,
    actionForm: { maxPerMint, maxPerWallet, price }
}) => {

    const isLoading = !contractState;

    const cardStyle = {
        maxWidth: 760,
        boxShadow: "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
        padding: 3,
        borderRadius: 4
    };

    const nftStorageType = getNftStorageTypeLabel(contract?.nftStorageType);

    return (
        <Stack>
            <Grid container={true} direction="column">

                <Stack gap={2} mt={8} sx={cardStyle}>
                    <Grid container={true} justifyContent="space-between">
                        <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
                            Public Sale Settings
                        </Typography>

                        {isLoading ? <Skeleton width={100} /> : contractState?.isPublicSaleOpen ? (
                            <Button
                                startIcon={<LockIcon />}
                                size="small"
                                variant="contained"
                                onClick={() => updateSales(false)}
                                color="error"
                                sx={{ margin: 'auto 0' }}
                                disabled={isSavingPublicSales}
                            >
                                {isSavingPublicSales && <CircularProgress isButtonSpinner={true} /> || null}
                                Close Public Sales
                            </Button>
                        ) : (
                            <Button
                                startIcon={<LockOpenIcon />}
                                size="small"
                                variant="contained"
                                onClick={() => updateSales(true)}
                                sx={{ margin: 'auto 0' }}
                                disabled={isSavingPublicSales}
                            >
                                {isSavingPublicSales && <CircularProgress isButtonSpinner={true} /> || null}
                                Open Public Sales
                            </Button>
                        )}
                    </Grid>

                    <Stack gap={2} direction="horizontal">
                        <Stack direction="column">
                            {isLoading ? <Skeleton width={60} /> : <TextField {...maxPerMint} size="small" label='Max per mint' />}
                        </Stack>

                        <Stack direction="column">
                            {isLoading ? <Skeleton width={60} /> : <TextField {...maxPerWallet} size="small" label='Max per wallet' />}
                        </Stack>

                        <Stack direction="column">
                            {isLoading ? <Skeleton width={60} /> : <TextField
                                {...price}
                                label='Price'
                                size="small"
                                InputProps={{ endAdornment: contract.nftCollection.currency }}
                            />}
                        </Stack>
                    </Stack>

                    <Stack>
                        {isLoading ? <Skeleton width={100} /> : <Button
                            size="small"
                            variant="contained"
                            onClick={() => updateSales(contractState?.isPublicSaleOpen)}
                            color="secondary"
                            sx={{ ml: 'auto' }}
                            disabled={isSavingPublicSales}
                        >
                            {isSavingPublicSales && <CircularProgress isButtonSpinner={true} /> || null}
                            UPDATE
                        </Button>}
                    </Stack>
                </Stack>

                {contractState?.isPresaleOpen && contract?.nftCollection?.whitelist?.length && <Stack gap={2} mt={8} sx={cardStyle}>
                    <Grid container={true} justifyContent="space-between">
                        <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
                            Pre Sale Settings
                        </Typography>
                    </Grid>

                    <Stack>
                        <Button
                            startIcon={<LockIcon />}
                            size="small"
                            variant="contained"
                            onClick={() => setPresales(false, contract?.nftCollection?.whitelist)}
                            color="error"
                            sx={{ ml: 'auto' }}
                            disabled={isSavingPreSales}
                        >
                            {isSavingPreSales && <CircularProgress isButtonSpinner={true} /> || null}
                            Close Pre-Sales
                        </Button>
                    </Stack>
                </Stack> || null}

                <Stack gap={2} mt={8} mb={8} sx={{ ...cardStyle, maxWidth: 1200 }}>
                    <Grid container={true} justifyContent="space-between" direction="column">
                        <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
                            Re-Upload NFT Collection
                        </Typography>
                        <Typography variant="body">
                            We allow re-uploading NFT collection to {nftStorageType}
                        </Typography>
                    </Grid>

                    <IPFSModalContent
                        id={id}
                        contract={contract}
                        renderUploadUnRevealedImage={true}
                        setIsModalOpen={() => { return; }}
                    />

                </Stack>

            </Grid>
        </Stack>
    );
};

export default AdvancedSettingsModal;