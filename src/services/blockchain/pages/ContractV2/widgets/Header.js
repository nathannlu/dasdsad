import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import { Box, Button, Stack, Typography, CircularProgress } from 'ds/components';

import AppModal from 'components/common/appModal';
import { useToast } from 'ds/hooks/useToast';

import { useDeployContractToMainnet } from '../hooks/useDeployContractToMainet';

import DeploymentStepModal from './modal/DeploymentStep.modal';
import DeployToMainnetModal from './modal/DeployToMainet.modal';

import { isTestnetBlockchain, getWalletType, getMainnetBlockchainType } from '@ambition-blockchain/controllers';

const Header = (props) => {
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { id } = useParams();
    const { contract, contractState } = props;
    const { addToast } = useToast();

    const { activeDeploymentStep, deployContractToMainnet, isDeploying, isDeploymentStepModalOpen } = useDeployContractToMainnet(contract, contractState, id);

    const walletType = contract?.blockchain && getWalletType(contract?.blockchain) || null;
    const blockchain = contract?.blockchain && getMainnetBlockchainType(contract?.blockchain) || null;

    const copyContractAddress = () => {
        navigator.clipboard.writeText(contract.address);
        addToast({
            severity: 'info',
            message: 'Contract Address copied to clipboard'
        });
    };

    const isTestnet = isTestnetBlockchain(contract?.blockchain);

    return (
        <Stack direction="row" mt={4}>
            <Stack gap={1}>
							<Typography variant="body" sx={{ textTransform: 'uppercase', color: '#6a7383', fontSize: '13px' }}>
                    Contract dashboard
                </Typography>
                <Typography variant="h4">{contract?.name}</Typography>
							<Typography variant="body" sx={{color: '#404452', fontSize: '14px'}}>
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
                    onClick={() => setIsModalOpen(true)}
                    variant="contained"
                    disabled={!contractState || !contract}
                >
                    {(!contractState || !contract) && <CircularProgress isButtonSpinner={true} /> || null}
                    Deploy to mainnet
                </Button>
            </Box> || null}

            <DeploymentStepModal
                blockchain={blockchain}
                activeDeploymentStep={activeDeploymentStep}
                walletType={walletType}
                isModalOpen={isDeploymentStepModalOpen}
            />

            <AppModal
                content={
                    <DeployToMainnetModal
                        id={id}
                        deployContractToMainnet={deployContractToMainnet}
                        isDeploying={isDeploying}
                        {...props}
                    />
                }
                isModalOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

        </Stack>
    );
};

export default Header;
