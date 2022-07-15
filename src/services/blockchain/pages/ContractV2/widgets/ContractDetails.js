
import React, { useState } from 'react';

import {
    Container,
    Stack,
    Box,
    Grid,
    Typography,
    Divider,
    Button,
    CircularProgress
} from 'ds/components';
import { Skeleton, Chip, Link, Fade } from '@mui/material';
import { isTestnetBlockchain } from '@ambition-blockchain/controllers';

import AppModal from 'components/common/appModal';
import { useContractSettings } from '../hooks/useContractSettings';

import AdvancedSettingsModal from './modal/AdvancedSettings.modal';
import { NFT, BlankNFT } from './Nft';

export const Details = ({ primary, secondary, isLoading }) => {
    return (
        <React.Fragment>
            <Grid xs={4} item>
                <Stack gap={0.5} sx={{ color: '#6a7383' }}>
                    <Typography sx={{ fontWeight: 'bold', display: 'flex', my: 1, gap: 1.5, maxWidth: 600, color: '#6a7383' }}>
                        {primary}:
                    </Typography>
                </Stack>
            </Grid>

            <Grid xs={8} item>
                <Stack gap={0.5} sx={{ color: '#6a7383' }}>
                    {!isLoading && <Typography
                        sx={{
                            my: 1,
                            fontWeight: '400',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            paddingRight: 4,
                            color: '#404452'
                        }}
                    >
                        {secondary}
                    </Typography> || <Skeleton sx={{ width: '50%', my: 1 }} />}
                </Stack>
            </Grid>
        </React.Fragment>
    );
}

const ContractDetails = (props) => {
    const { contract, contractState, nftPrice, unRevealedtNftImage, revealedNftImage } = props;
    const {
        updateReveal,
        updateSales,
        setPresales,
        isSavingMetadatUrl,
        isSavingPublicSales,
        isSavingPreSales,
        actionForm
    } = useContractSettings();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isLoading = !contractState;
    const isTestnet = isTestnetBlockchain(contract?.blockchain);

    return (
        <Grid mt={4} container>
            <Grid xs={6} item>
                <Stack gap={1}>
                    <Typography variant="h6">Details</Typography>

                    <Divider />

                    <Grid container sx={{ py: 2 }}>
                        <Details
                            primary="Blockchain"
                            secondary={`${isTestnet && 'Testnet' || 'Mainnet'} (${contract?.blockchain})`}
                            isLoading={isLoading}
                        />
                        <Details
                            primary="Owner"
                            secondary={contractState?.owner}
                            isLoading={isLoading}
                        />
                        <Details
                            primary="Collection size"
                            secondary={contractState?.collectionSize}
                            isLoading={isLoading}
                        />
                        <Details
                            primary="Earnings"
                            secondary={`${contractState?.balanceInEth} ${nftPrice.currency}`}
                            isLoading={isLoading}
                        />
                        <Details
                            primary="NFTs sold"
                            secondary={contractState?.amountSold}
                            isLoading={isLoading}
                        />

                        {!isLoading && contractState?.isRevealed && <Details
                            primary={<span style={{ minWidth: 110, marginRight: -12 }}>Reveal metadata</span>}
                            secondary={contract?.nftCollection?.baseUri}
                            isLoading={isLoading}
                        /> || null}

                        {!isLoading && !contractState?.isRevealed && <Details
                            primary={<span style={{ minWidth: 110, marginRight: -12 }}>Pre-reveal metadata</span>}
                            secondary={contract?.nftCollection?.unRevealedBaseUri}
                            isLoading={isLoading}
                        /> || null}

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
                            primary="Sales status"
                            secondary={(contractState?.isPresaleOpen && contractState?.isPublicSaleOpen && 'Whitelist and Public sales')
                                || (contractState?.isPresaleOpen && 'Whitelist only')
                                || (contractState?.isPublicSaleOpen && 'Public sales only')
                                || 'Closed'}
                            isLoading={isLoading}
                        />

                        <Details
                            primary="Pre sale status"
                            secondary={<Chip label={contractState?.isPresaleOpen && 'OPEN' || 'CLOSED'} color={contractState?.isPresaleOpen && 'success' || 'error'} size="small" />}
                            isLoading={isLoading}
                        />

                        <Details
                            primary="Public sale status"
                            secondary={<Chip label={contractState?.isPublicSaleOpen && 'OPEN' || 'CLOSED'} color={contractState?.isPublicSaleOpen && 'success' || 'error'} size="small" />}
                            isLoading={isLoading}
                        />

                    </Grid>
                    <Stack mt={2} gap={0.5}>
                        <Link onClick={() => setIsModalOpen(true)} sx={{ cursor: 'pointer' }}>
                            View advanced settings
                        </Link>
                    </Stack>
                </Stack>
            </Grid>

            <Grid xs={5} sx={{ ml: 'auto' }} item>
                <Stack gap={4}>

                    <Stack direction="row">
                        <Typography variant="h6">Preview</Typography>

                        <Box sx={{ ml: 'auto' }}>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={e => {
                                    updateReveal();
                                }}
                                disabled={isLoading || isSavingMetadatUrl}
                            >
                                {((isLoading || isSavingMetadatUrl) && <CircularProgress isButtonSpinner={true} />) || null}
                                {contractState?.isRevealed && 'Un-reveal NFT' || 'Reveal NFT'}
                            </Button>
                        </Box>
                    </Stack>

                    <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'flex-end', maxWidth: 480, height: 620 }}>
                        {contract?.nftCollection?.baseUri && <NFT
                            // contract={contract}
                            nftPrice={nftPrice}
                            nftImage={contractState?.isRevealed ? revealedNftImage : unRevealedtNftImage}
                            isRevealed={contractState?.isRevealed}
                        /> || <BlankNFT
                                contract={contract}
                                nftPrice={nftPrice}
                                isRevealed={contractState?.isRevealed}
                            />}
                    </Box>

                </Stack>
            </Grid>

            <AppModal
                content={
                    <AdvancedSettingsModal
                        {...props}
                        updateSales={updateSales}
                        isSavingPublicSales={isSavingPublicSales}
                        setPresales={setPresales}
                        isSavingPreSales={isSavingPreSales}
                        actionForm={actionForm}
                    />
                }
                fullScreen={true}
                title="Advanced Settings"
                isModalOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

        </Grid>
    );
};

export default ContractDetails;