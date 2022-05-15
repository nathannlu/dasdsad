import React, { useState, useEffect } from 'react';
import { getMainnetBlockchainType, isTestnetBlockchain, getIpfsUrl } from '@ambition-blockchain/controllers';

import { Chip, Link, Grid } from '@mui/material';
import {
    Fade,
    Stack,
    Box,
    Typography,
    Button,
    CircularProgress,
} from 'ds/components';

import solanaLogo from 'assets/images/solana.png';
import etherLogo from 'assets/images/ether.png';
import polygonLogo from 'assets/images/polygon.png';
import imageNotFound from 'assets/images/image-not-found.png';

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

export const BlankNFT = ({ setIsModalOpen, contract }) => {
    const [animate, setAnimation] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => setAnimation(prevState => !prevState), 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box
            sx={{
                borderRadius: '10px',
                border: 'solid 2px white',
                background: 'rgba(0,0,0,.2)',
                boxShadow: '0 4px 8px rgba(0,0,0,.1)',
                backdropFilter: 'blur(3px)',
                my: 2
            }}
            p={3}
        >
            <Stack sx={{ border: '1px solid black', height: '100%' }}>

                <Box sx={{ height: '500px' }}>
                    <Button onClick={e => setIsModalOpen(true)}>
                        <Fade in={animate}>
                            <span>
                                Connect your images &amp; metadata
                            </span>
                        </Fade>
                    </Button>
                </Box>

                <Stack p={2} sx={{ borderTop: '1px solid black' }}>
                    <Typography variant="body" sx={{ fontWeight: 'bold' }}>
                        Collection name:&nbsp;
                        <Typography variant="span" sx={{ textTransform: 'capitalize', fontWeight: '400' }}>
                            {contract?.name}
                        </Typography>
                    </Typography>
                </Stack>
                <Stack direction="horizontal">
                    <Stack p={2} sx={{ flex: 1, borderRight: '1px solid black', borderTop: '1px solid black' }}>
                        <Typography variant="body" sx={{ fontWeight: 'bold' }}>
                            Symbol:&nbsp;
                            <Typography variant="span" sx={{ textTransform: 'capitalize', fontWeight: '400' }}>
                                {contract?.symbol}
                            </Typography>
                        </Typography>
                    </Stack>

                    <Stack p={2} sx={{ flex: 1, borderTop: '1px solid black' }}>
                        <Typography variant="body" sx={{ fontWeight: 'bold' }}>
                            Collection size:&nbsp;
                            <Typography variant="span" sx={{ textTransform: 'capitalize', fontWeight: '400' }}>
                                {contract?.nftCollection?.size}
                            </Typography>
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    );
};

export const NFT = ({ contract, nftImage, nftPrice }) => {
    return (
        <Box
            sx={{
                borderRadius: '10px',
                border: 'solid 2px white',
                background: 'rgba(0,0,0,.5)',
                boxShadow: '0 4px 8px rgba(0,0,0,.1)',
                backdropFilter: 'blur(3px)',
                color: 'white',
            }}
            p={3}>
            <Stack
                sx={{
                    border: '1px solid white',
                    height: '100%',
                }}>
                <Box sx={{ height: '400px' }}>
                    {nftImage.isLoading && <CircularProgress style={{ height: '100%', alignItems: 'center' }} /> || null}
                    {!nftImage.isLoading && <img
                        style={{
                            height: '100%',
                            width: '100%',
                            objectFit: 'cover',
                        }}
                        src={nftImage.src || imageNotFound}
                    /> || null}
                </Box>
                <Stack p={2} sx={{ borderTop: '1px solid black' }}>
                    <Typography variant="body" sx={{ fontWeight: 'bold' }}>
                        Collection name:&nbsp;
                        <Typography variant="span" sx={{ textTransform: 'capitalize', fontWeight: '400' }}>
                            {contract?.name}
                        </Typography>
                    </Typography>
                </Stack>
                <Stack direction="horizontal">
                    <Stack
                        p={2}
                        sx={{
                            flex: 1,
                            borderRight: '1px solid white',
                            borderTop: '1px solid white',
                        }}>
                        <Typography variant="body" sx={{ fontWeight: 'bold' }}>
                            Symbol:&nbsp;
                            <Typography variant="span" sx={{ textTransform: 'capitalize', fontWeight: '400' }}>
                                {contract?.symbol}
                            </Typography>
                        </Typography>
                    </Stack>
                    <Stack
                        p={2}
                        sx={{
                            flex: 1,
                            borderTop: '1px solid white',
                        }}>
                        <Typography variant="body" sx={{ fontWeight: 'bold' }}>
                            Price:&nbsp;
                            <Typography variant="span" sx={{ textTransform: 'capitalize', fontWeight: '400' }}>
                                {nftPrice.price} {nftPrice.currency}
                            </Typography>
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    );
};

export const NFTStack = ({ contract, nftPrice, nftImage }) => {
    return (
        <Box sx={{ position: 'relative', width: '100%', maxWidth: 460, display: 'flex', justifyContent: 'flex-end', marginLeft: 'auto' }}>
            <Box sx={{ position: 'absolute', top: 0 }}>
                <NFT contract={contract} nftImage={nftImage} nftPrice={nftPrice} />
            </Box>
            <Box sx={{ position: 'absolute', top: 40, transform: 'scale(1.05)' }}>
                <NFT contract={contract} nftImage={nftImage} nftPrice={nftPrice} />
            </Box>
            <Box sx={{ position: 'absolute', top: 80, transform: 'scale(1.1)' }}>
                <NFT contract={contract} nftImage={nftImage} nftPrice={nftPrice} />
            </Box>
        </Box>
    );
};

export const ContractDetails = ({ contract }) => {
    return (
        <Box>
            <Stack
                gap={2}
                direction="horizontal"
                alignItems="center"
            >
                <BlockchainLogo blockchain={contract.blockchain} />
                <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
                    {contract?.name}
                </Typography>
                <BlockchainTypeChip blockchain={contract?.blockchain || null} />
            </Stack>

            <Typography sx={{ textTransform: 'uppercase' }}>{contract?.type}</Typography>

            <Box sx={{ my: 2 }}>
                <Typography sx={{ textTransform: 'capitalize' }}>{contract?.blockchain} address:</Typography>
                {contract?.address && <Link target="_blank" href={`https://etherscan.io/address/${contract?.address}`} sx={{ fontSize: 14, color: '#000' }}>
                    {contract?.address}
                </Link> || null}
            </Box>
        </Box>
    );
};

export const EmptyAddressList = ({ message }) => {
    return (<Typography color="error" sx={{ my: 4 }}>{message}</Typography>);
}

export const AddressList = ({ addresses }) => {
    const length = addresses.length;

    const count = (
        <Typography key={4} sx={{ mb: 1 }}>
            <b>Total Address Count:</b>
            <Typography component="span" color="green">&nbsp;&nbsp;{length}</Typography>
        </Typography>
    );

    if (length <= 3) {
        return (
            <Grid container={true} flexDirection="column">
                {addresses.map((a, i) => <Typography key={i} sx={{ mb: 1 }}>{a}</Typography>)}
                {count}
            </Grid>
        );
    }

    return (
        <Grid container={true} flexDirection="column">
            <Typography key={1} sx={{ mb: 1 }}>{addresses[0]}</Typography>
            <Typography key={2}>{addresses[1]}</Typography>

            <Grid container={true} flexDirection="column">
                <span style={{ lineHeight: '1em' }}>.</span>
                <span style={{ lineHeight: '1em' }}>.</span>
                <span style={{ lineHeight: '1em', marginBottom: 6 }}>.</span>
            </Grid>

            <Typography key={3} sx={{ mb: 1 }}>{addresses[length - 1]}</Typography>
            {count}
        </Grid>
    );
}