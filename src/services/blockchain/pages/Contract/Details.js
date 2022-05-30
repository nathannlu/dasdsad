import React from 'react';
import { getBlockchainChainId } from '@ambition-blockchain/controllers';

import { Chip, Skeleton } from '@mui/material';
import { Box, Grid, Stack, Typography } from 'ds/components';
import { useContractDetails } from './hooks/useContractDetails';

const Details = ({ contract }) => {
    const networkId = getBlockchainChainId(contract?.blockchain);

    const {
        balance,
        soldCount,
        price,
        isPublicSaleOpen,
        isPresaleOpen,
        max,
        metadataUrl,
        loading,
    } = useContractDetails(contract.address, networkId, contract.blockchain);

    return (
        <Stack>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Details
            </Typography>

            {contract.blockchain != 'solana' || contract.blockchain != 'solanadevnet' ? (
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
            ) : (<Box>
                Details not available yet for Solana contracts
            </Box>)}
        </Stack>
    );
};

export default Details;
