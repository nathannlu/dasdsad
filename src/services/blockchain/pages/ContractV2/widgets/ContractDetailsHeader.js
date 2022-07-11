import React, { useState, useEffect } from 'react';

import { getMainnetBlockchainType, isTestnetBlockchain } from '@ambition-blockchain/controllers';

import { Chip, Link } from '@mui/material';
import { Box, Fade, Stack, Typography } from 'ds/components';

import etherLogo from 'assets/images/ether.png';
import polygonLogo from 'assets/images/polygon.png';
import solanaLogo from 'assets/images/solana.png';

export const BlockchainLogo = ({ blockchain }) => {
    const blockchainType = getMainnetBlockchainType(blockchain);
    const logo = blockchainType === 'ethereum' && etherLogo
        || blockchainType === 'polygon' && polygonLogo
        || blockchainType === 'solana' && solanaLogo
        || null;

    if (!logo) {
        return null;
    }

    return <img style={{ width: 'auto', height: 24, borderRadius: 9999 }} src={logo} />;
};

export const BlockchainTypeChip = ({ blockchain }) => {
    const [animate, setAnimation] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => setAnimation(prevState => !prevState), 800);
        return () => clearInterval(interval);
    }, []);

    const isContractDeployedOnTestnet = isTestnetBlockchain(blockchain);

    if (!blockchain) {
        return null;
    }

    return (
        <Fade in={isContractDeployedOnTestnet && true || animate}>
            <Chip sx={{ textTransform: 'capitalize' }} label={isContractDeployedOnTestnet && blockchain || 'LIVE'} color={isContractDeployedOnTestnet && 'warning' || 'success'} />
        </Fade>
    );
}

const ContractDetailsHeader = ({ contract }) => {
    return (
        <Box>
            <Stack
                gap={2}
                direction="horizontal"
                alignItems="center"
            >
                <BlockchainLogo blockchain={contract?.blockchain} />
                <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
                    {contract?.name}
                </Typography>
                <BlockchainTypeChip blockchain={contract?.blockchain || null} />
            </Stack>

            <Typography sx={{ textTransform: 'uppercase' }}>{contract?.type}</Typography>
        </Box>
    );
};

export default ContractDetailsHeader;