import React, { useEffect } from 'react';

import { useModal } from 'ds/hooks/useModal';

import { Box, Button, Grid, Stack, Typography, CircularProgress } from 'ds/components';
import { Step, StepLabel, Stepper } from '@mui/material';

import { Details } from '../ContractDetails';
import { NFT } from '../Nft';
import { useDeployContractToMainnet } from '../../hooks/useDeployContractToMainet';

import { getMainnetBlockchainType, getWalletType } from '@ambition-blockchain/controllers';

export const DeploymentStepModal = ({ blockchain, activeDeploymentStep, walletType }) => {
    const deploymentSteps = [
        {
            key: 0,
            title: `Awaiting signature`,
            description: `Open ${walletType} and sign the transaction.`
        }, {
            key: 1,
            title: `Deploying Contract`,
            description: `Please be patient, this will take couple of seconds...`
        }, {
            key: 2,
            title: `Updating NFT metadata`,
            description: `Open ${walletType} and sign the transaction.`
        }, {
            key: 3,
            title: `Updating Sales Settings`,
            description: `Open ${walletType} and sign the transaction.`
        }, {
            key: 4,
            title: `Confirming Deployment`,
            description: `Waiting for final transaction confirmation.`
        }
    ];

    return (
        <Box>
            <Typography variant="h6">
                Deploying to {blockchain}
            </Typography>

            <Stepper orientation="vertical" activeStep={activeDeploymentStep}>
                {deploymentSteps.map(step => (
                    <Step key={step.key}>
                        <StepLabel optional={<Typography variant="caption">{step.description}</Typography>}>
                            {step.title}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
};

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
                        <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'flex-end', minWidth: 328, maxWidth: 328, height: 428 }}>
                            <NFT nftImage={revealedNftImage} isRevealed={true} />
                        </Box>

                        <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'flex-end', minWidth: 328, maxWidth: 328, height: 428 }}>
                            <NFT nftImage={unRevealedtNftImage} isRevealed={false} />
                        </Box>
                    </Stack>
                </Grid>

            </Grid>
        </Stack>
    );
}

export default DeployToMainnetModal;