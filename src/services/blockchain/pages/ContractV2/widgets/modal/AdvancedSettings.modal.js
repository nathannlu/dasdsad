import React from 'react';

import { Button, CircularProgress, Grid, Stack, TextField, Typography } from 'ds/components';
import { Lock as LockIcon, LockOpen as LockOpenIcon } from '@mui/icons-material';

import { useContractSettings } from '../../hooks/useContractSettings';

const AdvancedSettingsModal = ({
    contractState,
    contract,
    updateSales,
    isSavingPublicSales,
    setPresales,
    isSavingPreSales,
    actionForm: { maxPerMint, maxPerWallet, price }
}) => {

    const cardStyle = {
        maxWidth: 760,
        boxShadow: "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
        padding: 3,
        borderRadius: 4
    };

    return (
        <Stack>
            <Grid container>
                <Stack gap={2} mt={8} sx={cardStyle}>
                    <Grid container={true} justifyContent="space-between">
                        <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
                            Public Sale Settings
                        </Typography>

                        {contractState?.isPublicSaleOpen ? (
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
                            <TextField {...maxPerMint} size="small" label='Max per mint' />
                        </Stack>

                        <Stack direction="column">
                            <TextField {...maxPerWallet} size="small" label='Max per wallet' />
                        </Stack>

                        <Stack direction="column">
                            <TextField
                                {...price}
                                label='Price'
                                size="small"
                                InputProps={{ endAdornment: contract.nftCollection.currency }}
                            />
                        </Stack>
                    </Stack>

                    <Stack>
                        <Button
                            size="small"
                            variant="contained"
                            onClick={() => updateSales(methodProps, contractState?.isPublicSaleOpen)}
                            color="secondary"
                            sx={{ ml: 'auto' }}
                            disabled={isSavingPublicSales}
                        >
                            {isSavingPublicSales && <CircularProgress isButtonSpinner={true} /> || null}
                            UPDATE
                        </Button>
                    </Stack>
                </Stack>

                {contractState?.isPresaleOpen && <Stack gap={2} mt={8} sx={cardStyle}>
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
                            onClick={() => setPresales(methodProps, false)}
                            color="error"
                            sx={{ ml: 'auto' }}
                            disabled={isSavingPreSales}
                        >
                            {isSavingPreSales && <CircularProgress isButtonSpinner={true} /> || null}
                            Close Pre-Sales
                        </Button>
                    </Stack>
                </Stack> || null}

            </Grid>
        </Stack>
    );
};

export default AdvancedSettingsModal;