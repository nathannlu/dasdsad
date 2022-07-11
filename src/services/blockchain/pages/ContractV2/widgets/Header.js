import React, { useEffect } from 'react';
import { useParams } from "react-router-dom";

import { Box, Button, Stack, Typography, CircularProgress } from 'ds/components';

import { useModal } from 'ds/hooks/useModal';
import { useToast } from 'ds/hooks/useToast';

import { useDeployContractToMainnet } from '../hooks/useDeployContractToMainet';
import DeployToMainnetModal, { DeploymentStepModal } from './modal/DeployToMainet.modal';
import { isTestnetBlockchain, getWalletType, getMainnetBlockchainType } from '@ambition-blockchain/controllers';

const Header = (props) => {
    const { id } = useParams();
    const { contract, contractState } = props;
    const { addToast } = useToast();
    const { createModal } = useModal();

    const { activeDeploymentStep, deployContractToMainnet, isDeploying } = useDeployContractToMainnet(contract, contractState, id);

    const walletType = contract?.blockchain && getWalletType(contract?.blockchain) || null;
    const blockchain = contract?.blockchain && getMainnetBlockchainType(contract?.blockchain) || null;

    const [, setIsDeploymentStepModalOpen, closeDeploymentStepModal] = createModal(
        <DeploymentStepModal
            blockchain={blockchain}
            activeDeploymentStep={activeDeploymentStep}
            walletType={walletType}
        />, { styles: { maxWidth: 420 } }
    );

    const [, setIsDeployModalOpen] = createModal(
        <DeployToMainnetModal
            id={id}
            deployContractToMainnet={deployContractToMainnet}
            isDeploying={isDeploying}
            {...props}
        />
    );

    const copyContractAddress = () => {
        navigator.clipboard.writeText(contract.address);
        addToast({
            severity: 'info',
            message: 'Contract Address copied to clipboard'
        });
    };

    const isTestnet = isTestnetBlockchain(contract?.blockchain);

    useEffect(() => {
        if (activeDeploymentStep === null) {
            return;
        }

        if (activeDeploymentStep === 0) {
            setIsDeploymentStepModalOpen(true);
        }

        if (activeDeploymentStep === 4) {
            closeDeploymentStepModal();
        }
    }, [activeDeploymentStep]);

    return (
        <Stack direction="row" mt={4}>
            <Stack gap={1}>
                <Typography variant="body" sx={{ fontWeight: 'bold' }}>
                    Contract dashboard
                </Typography>
                <Typography variant="h4">{contract?.name}</Typography>
                <Typography variant="body">
                    Copy and share to start accepting payments with this link.
                </Typography>

                <Stack gap={1} mt={2} direction="row">
                    <Box
                        sx={{
                            background: '#f6f8fa',
                            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.1)',
                            borderRadius: '5px',
                            px: 1,
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {contract?.address}
                    </Box>
                    <Box>
                        <Button variant="outlined" size="small" onClick={copyContractAddress}>
                            Copy
                        </Button>
                    </Box>
                </Stack>
            </Stack>

            {isTestnet && <Box sx={{ ml: 'auto' }}>
                <Button
                    size="small"
                    onClick={() => setIsDeployModalOpen(true)}
                    variant="contained"
                    disabled={!contractState || !contract}
                >
                    {(!contractState || !contract) && <CircularProgress isButtonSpinner={true} /> || null}
                    Deploy to mainnet
                </Button>
            </Box> || null}

        </Stack>
    );
};

export default Header;