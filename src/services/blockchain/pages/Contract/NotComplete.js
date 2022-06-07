import React from 'react';
import { useWeb3 } from 'libs/web3';

import { useDeployContract } from './hooks/useDeployContract';
import { Stack, Typography, Box, Button } from 'ds/components';
import { useToast } from 'ds/hooks/useToast';

import { Stepper, Step, StepLabel, StepContent, Alert } from '@mui/material';

const NotComplete = ({ id, contract, setIsModalOpen }) => {
    const { addToast } = useToast();

    const { deployContract } = useDeployContract(contract);
    const { walletController } = useWeb3();

    const activeStep = contract?.nftCollection?.baseUri ? 1 : 0;

    return (
        <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
                <StepLabel>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Set NFT assets location
                    </Typography>
                </StepLabel>
                <StepContent>
                    <Stack>
                        <Typography variant="body">
                            Link your metadata and images to the smart contract.
                        </Typography>
                        <Box>
                            <Button
                                variant="contained"
                                onClick={() => setIsModalOpen(true)}>
                                Connect your images
                            </Button>
                        </Box>
                    </Stack>
                </StepContent>
            </Step>

            <Step>
                <StepLabel>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Deploy to the blockchain
                    </Typography>
                </StepLabel>
                <StepContent>
                    <Stack>
                        <Typography variant="body">
                            Deploy your smart contract to the blockchain in
                            order to accept public mints, configure whitelists,
                            set public sale.
                        </Typography>
                        <Box>
                            <Button
                                onClick={async () => {
                                    await walletController.compareNetwork(contract?.blockchain, async (error) => {
                                        if (error) {
                                            console.error(error);
                                            addToast({ severity: 'error', message: e.message });
                                            return;
                                        }
                                        await deployContract();
                                    });
                                }}
                                variant="contained"
                            >
                                Deploy to blockchain
                            </Button>
                        </Box>
                        {contract.blockchain === 'solana' || contract.blockchain === 'solanadevnet' && (
                            <Alert severity="info" sx={{ mt: 2, maxWidth: '740px' }}>
                                <Stack gap={1}>
                                    <Box>
                                        Setting up a candy machine project means that you have to pay a one-time fee (porportional to your collection size) to Solana in order to store the candy machine config on their blockchain.
                                    </Box>

                                    <Stack direction="row">
                                        Your collection size:
                                        <Box sx={{ fontWeight: 'bold' }}>
                                            {contract.nftCollection.size}
                                        </Box>
                                    </Stack>

                                    <Stack direction="row">
                                        Your estimated fees for Solana rent:
                                        <Box sx={{ fontWeight: 'bold' }}>
                                            {(contract.nftCollection.size * 0.001672).toFixed(2)} sol
                                        </Box>
                                    </Stack>

                                    <Box>
                                        This is a rough estimate. You may need more or less than the estimated amount.
                                    </Box>
                                </Stack>
                            </Alert>
                        )}
                    </Stack>
                </StepContent>
            </Step>
        </Stepper>
    );
};

export default NotComplete;
