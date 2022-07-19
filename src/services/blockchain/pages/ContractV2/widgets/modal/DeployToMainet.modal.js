import React, { useEffect } from 'react';

import { Box, Button, CircularProgress, Grid, Stack, Typography } from 'ds/components';

import { Details } from '../ContractDetails';
import { NFT } from '../Nft';

import { getMainnetBlockchainType } from '@ambition-blockchain/controllers';

const DeployToMainnetModal = ({ contract, contractState, unRevealedtNftImage, revealedNftImage, nftPrice, deployContractToMainnet, isDeploying }) => {
    const blockchain = contract?.blockchain && getMainnetBlockchainType(contract?.blockchain) || null;
    const isLoading = !contractState;

    console.log({ contract, contractState }, 'check here ==>');

    return (
        <Stack>
            <Grid container>
                <Grid xs={5} item>
                    <Stack p={4} gap={2}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Deploy to <span sx={{ textTransform: 'capitalize' }}>{blockchain}</span> mainnet
                            </Typography>
                            <Typography variant="body">
                                Here is a quick recap. You can change the name, symbol, and collection size later only by re-creating the contract.
                            </Typography>
                        </Box>

                        <Grid container sx={{ py: 2 }}>

                            <Details
                                primary="Name"
                                secondary={contract?.name}
                                isLoading={isLoading}
                            />

                            <Details
                                primary="Symbol"
                                secondary={contract?.symbol}
                                isLoading={isLoading}
                            />

                            <Details
                                primary="Collection size"
                                secondary={contractState?.collectionSize}
                                isLoading={isLoading}
                            />

                            <Details
                                primary="Cost"
                                secondary={`${contractState?.price} ${nftPrice.currency}`}
                                isLoading={isLoading}
                            />

                            <Details
                                primary="Max per mint"
                                secondary={contractState?.maxPerMint}
                                isLoading={isLoading}
                            />

                            <Details
                                primary="Max per wallet"
                                secondary={contractState?.maxPerWallet}
                                isLoading={isLoading}
                            />

                            <Details
                                primary="Deployer address"
                                secondary={contractState?.owner}
                                isLoading={isLoading}
                            />

                            <Details
                                primary="Sales status"
                                secondary={(contractState?.isPresaleOpen && contractState?.isPublicSaleOpen && 'Whitelist and Public sales')
                                    || (contractState?.isPresaleOpen && 'Whitelist only')
                                    || (contractState?.isPublicSaleOpen && 'Public sales only')
                                    || 'Closed'}
                                isLoading={isLoading}
                            />

                        </Grid>

                        <Box>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={deployContractToMainnet}
                                disabled={isLoading || isDeploying}
                            >
                                {isDeploying && <CircularProgress isButtonSpinner={true} /> || null}
                                Deploy
                            </Button>
                        </Box>
                    </Stack>
                </Grid>

                <Grid
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    xs={7}
                    item={true}
                >
                    <Stack gap={2} direction="row">
                        <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'flex-end', minWidth: 328, maxWidth: 328, height: 328 }}>
                            <NFT nftImage={revealedNftImage} isRevealed={true} />
                        </Box>

                        <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'flex-end', minWidth: 328, maxWidth: 328, height: 328 }}>
                            <NFT nftImage={unRevealedtNftImage} isRevealed={false} />
                        </Box>
                    </Stack>
                </Grid>

            </Grid>
        </Stack>
    );
}

export default DeployToMainnetModal;
