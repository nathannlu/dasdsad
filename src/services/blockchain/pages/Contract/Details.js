import React, { useState, useEffect } from 'react';
import { Stack, Box, Grid, Typography, Button, Divider } from 'ds/components';
import { Chip, Skeleton } from '@mui/material';
import { useWeb3 } from 'libs/web3';
import { useContractDetails } from './hooks/useContractDetails';

const Details = ({ contract }) => {
    const { getNetworkID, wallet } = useWeb3();
    const {
        balance,
        soldCount,
        price,
        isPublicSaleOpen,
        isPresaleOpen,
        max,
        metadataUrl,
        loading,
    } = useContractDetails(contract.address, getNetworkID());

    return (
        <Stack>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Details
            </Typography>

            {wallet != 'phantom' && (
                <Grid container>
                    <Grid item xs={6}>
                        Balance:
                    </Grid>
                    <Grid sx={{ fontWeight: 'bold' }} item xs={6}>
                        {loading ? (
                            <Skeleton width={60} />
                        ) : (
                            balance + contract.nftCollection.currency
                        )}
                    </Grid>
                    <Grid item xs={6}>
                        NFTs sold:
                    </Grid>
                    <Grid sx={{ fontWeight: 'bold' }} item xs={6}>
                        {loading ? <Skeleton width={60} /> : soldCount}
                    </Grid>
                    <Grid item xs={6}>
                        Price per NFT:
                    </Grid>
                    <Grid sx={{ fontWeight: 'bold' }} item xs={6}>
                        {loading ? (
                            <Skeleton width={60} />
                        ) : (
                            price + contract.nftCollection.currency
                        )}
                    </Grid>
                    <Grid item xs={6}>
                        Collection size:
                    </Grid>
                    <Grid sx={{ fontWeight: 'bold' }} item xs={6}>
                        {loading ? (
                            <Skeleton width={60} />
                        ) : (
                            contract.nftCollection.size
                        )}
                    </Grid>

                    <Grid item xs={6}>
                        Pre sales status:
                    </Grid>
                    <Grid sx={{ fontWeight: 'bold' }} item xs={6}>
                        {loading ? (
                            <Skeleton width={60} />
                        ) : isPresaleOpen ? (
                            <Chip label="Open" color="success" size="small" />
                        ) : (
                            <Chip label="Closed" color="error" size="small" />
                        )}
                    </Grid>

                    <Grid item xs={6}>
                        Public sales status:
                    </Grid>
                    <Grid sx={{ fontWeight: 'bold' }} item xs={6}>
                        {loading ? (
                            <Skeleton width={60} />
                        ) : isPublicSaleOpen ? (
                            <Chip label="Open" color="success" size="small" />
                        ) : (
                            <Chip label="Closed" color="error" size="small" />
                        )}
                    </Grid>

                    <Grid item xs={6}>
                        Metadata URL
                    </Grid>
                    <Grid sx={{ fontWeight: 'bold' }} item xs={6}>
                        {loading ? <Skeleton width={60} /> : metadataUrl}
                    </Grid>
                    <Grid item xs={6}>
                        Max per mint
                    </Grid>
                    <Grid sx={{ fontWeight: 'bold' }} item xs={6}>
                        {loading ? <Skeleton width={60} /> : max}
                    </Grid>
                </Grid>
            )}
        </Stack>
    );
};

export default Details;
