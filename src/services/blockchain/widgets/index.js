import React, { useState, useEffect } from 'react';
import { getMainnetBlockchainType, isTestnetBlockchain, getIpfsUrl } from '@ambition-blockchain/controllers';

import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import CircleIcon from '@mui/icons-material/Circle';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import useMediaQuery from '@mui/material/useMediaQuery';
import { Chip, Link, Grid, Card, CardContent, Zoom } from '@mui/material';
import {
    Fade,
    Stack,
    Box,
    Typography,
    Button,
    CircularProgress,
	LoadingButton,
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

export const ContractDetails = ({ contract, contractState, isLoading }) => {
	const [hasMintedOne, setHasMintedOne] = useState(false);
    const contractName = contract.name.replace(/\s+/g, '-').toLowerCase();
    const isContractDeployedOnTestnet = isTestnetBlockchain(contract?.blockchain);

    const openSeaLink = isContractDeployedOnTestnet && `https://testnets.opensea.io/collection/${contractName}` || `https://opensea.io/collection/${contractName}`;
    const openSeaLink2 = isContractDeployedOnTestnet && `https://testnets.opensea.io/get-listed/step-two` || `https://opensea.io/get-listed/step-two`;

	useEffect(() => {
		if(contractState?.amountSold >= 1) {
			setHasMintedOne(true)
		}
	}, [contractState])

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

            <Box sx={{ my: 2 }}>
                <Typography sx={{ textTransform: 'capitalize' }}>{contract?.blockchain} address:</Typography>
                {contract?.address && <Link target="_blank" href={`https://etherscan.io/address/${contract?.address}`} sx={{ fontSize: 14, color: '#000' }}>
                    {contract?.address}
                </Link> || null}
            </Box>

            <Stack sx={{ my: 2 }}>
							{/*
                <Link target="_blank" href={openSeaLink} sx={{ fontSize: 14, color: '#000' }}>{openSeaLink}</Link>
							*/}
							<Box>
								<LoadingButton onClick={() => window.open(openSeaLink2,"_blank").focus()} variant="contained" size="small" loading={isLoading} disabled={!hasMintedOne}>
									Connect with Opensea
								</LoadingButton>
							</Box>
							{!isLoading && !hasMintedOne && (
								<Typography sx={{fontSize: '14px'}} variant="small">
									You must have one NFT minted before you can connect with Opensea
								</Typography>
							)}
							{/*
                <Typography sx={{ fontSize: 13, fontStyle: 'italic', mt: 1 }} color="GrayText">
                    **Trouble opening above link**<br />
                    <Link target="_blank" href={openSeaLink2} sx={{ color: '#000' }}>{openSeaLink2}</Link>
                </Typography>
								*/}
            </Stack>
        </Box>
    );
};

export const ErrorMessage = ({ message }) => {
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

const NFTDetails = ({ contract, nftPrice, disabled }) => {
    return (
        <Box sx={{ height: 114, filter: 'drop-shadow(2px 2px 8px gray)' }}>
            <Stack p={2} sx={{ borderTop: '1px solid black' }}>
                <Typography variant="body" sx={{ fontWeight: 'bold', color: disabled && 'rgba(0, 0, 0, 0.38)' || undefined }}>
                    Collection name:&nbsp;
                    <Typography variant="span" sx={{ textTransform: 'capitalize', fontWeight: '400' }}>
                        {contract?.name}
                    </Typography>
                </Typography>
            </Stack>

            <Stack direction="horizontal">
                <Stack sx={{ flex: 1, borderRight: '1px solid black', borderTop: '1px solid black', padding: '8px 8px 8px 16px', justifyContent: 'center' }}>
                    <Typography variant="body" sx={{ fontWeight: 'bold', color: disabled && 'rgba(0, 0, 0, 0.38)' || undefined }}>
                        Symbol:&nbsp;
                        <Typography variant="span" sx={{ textTransform: 'capitalize', fontWeight: '400' }}>
                            {contract?.symbol}
                        </Typography>
                    </Typography>
                </Stack>

                <Stack sx={{ flex: 1, borderRight: '1px solid black', borderTop: '1px solid black', padding: '8px 8px 8px 16px', justifyContent: 'center' }}>
                    <Typography variant="body" sx={{ fontWeight: 'bold', color: disabled && 'rgba(0, 0, 0, 0.38)' || undefined }}>
                        Size:&nbsp;
                        <Typography variant="span" sx={{ textTransform: 'capitalize', fontWeight: '400' }}>
                            {contract?.nftCollection?.size}
                        </Typography>
                    </Typography>
                </Stack>


                <Stack sx={{ flex: 1, borderTop: '1px solid black', padding: '8px 8px 8px 16px', justifyContent: 'center' }}>
                    <Typography variant="body" sx={{ fontWeight: 'bold', color: disabled && 'rgba(0, 0, 0, 0.38)' || undefined }}>
                        Price:&nbsp;
                        <Typography variant="span" sx={{ textTransform: 'capitalize', fontWeight: '400' }}>
                            {nftPrice.price} {nftPrice.currency}
                        </Typography>
                    </Typography>
                </Stack>
            </Stack>
        </Box >
    );
}

const NFTIsRevealedChip = ({ disabled, isRevealed }) => {
    return (
        <Box sx={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff',
            top: 0,
            right: 0,
            height: 36,
            padding: '0 12px',
            borderRadius: '0 16px',
            boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)'
        }}>
            <CircleIcon sx={{ color: '#C4C4C4' }} /> &nbsp;
            <Typography sx={{ fontWeight: 600, color: disabled && 'rgba(0, 0, 0, 0.38)' || undefined }}>{isRevealed && 'Revealed' || 'Unrevealed'}</Typography>
        </Box>
    );
}

const NFT = ({ contract, nftImage, nftPrice, isRevealed, disabled }) => {
    return (
        <Card sx={{ width: '100%', height: '100%', borderRadius: 16 }} raised={true}>
            <CardContent sx={{ padding: '0 !important', height: '100%' }}>
                <Box
                    sx={{
                        backgroundColor: '#3C3C41',
                        height: 'calc(100% - 114px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column'
                    }}
                >
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
                <NFTDetails contract={contract} nftPrice={nftPrice} disabled={disabled} />
                <NFTIsRevealedChip isRevealed={isRevealed} disabled={disabled} />
            </CardContent>
        </Card>
    );
}

const BlankNFT = ({ setIsModalOpen, contract, nftPrice, isRevealed, disabled }) => {
    return (
        <Card sx={{ width: '100%', height: '100%', borderRadius: 16 }} raised={true} onClick={e => setIsModalOpen(true)}>
            <CardContent sx={{ padding: '0 !important', height: '100%' }}>
                <Box
                    sx={{
                        backgroundColor: '#3C3C41',
                        height: 'calc(100% - 114px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        cursor: disabled && 'not-allowed' || 'pointer'
                    }}
                >
                    {disabled && 'not-allowed' && <BlockIcon sx={{ fontSize: 136, color: 'rgba(255, 0, 0, 0.38)' }} /> || <UploadFileRoundedIcon sx={{ fontSize: 136, color: '#fff' }} />}
                    <Typography sx={{ color: disabled && 'rgba(0, 0, 0, 0.38)' || '#fff', fontStyle: 'italic', fontWeight: 600 }}>Click to add your collection here</Typography>
                </Box>
                <NFTDetails contract={contract} nftPrice={nftPrice} disabled={disabled} />
                <NFTIsRevealedChip isRevealed={isRevealed} disabled={disabled} />
            </CardContent>
        </Card>
    );
}

// type NFTStackProps = {
//     contract
//     nftPrice
//     unRevealedtNftImage
//     revealedNftImage
//     setIsModalOpen
//     disabled
//     isLargeScreen
// }
export const NFTStack = (props) => {
    const [activeNFTImageType, setActiveNFTImageType] = useState('REVEALED'); // "REVEALED" | "UNREVEALED"

    const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    const style = { position: 'absolute', top: 0, width: '100%', height: '100%' };
    const isRevealedActive = activeNFTImageType === 'REVEALED';

    return (
        <Grid item xs={12} sx={{ flex: 1 }}>
            <Grid container={true} justifyContent="space-between" sx={{ padding: '0 16px 8px 0', maxWidth: 600, margin: !isLargeScreen && 'auto' || undefined }}>
                <Button
                    disabled={props.disabled}
                    size="small"
                    onClick={e => {
                        setActiveNFTImageType(prevState => prevState === 'REVEALED' ? 'UNREVEALED' : 'REVEALED');
                    }}
                >
                    <AutorenewIcon />&nbsp;Toggle reveal state
                </Button>
            </Grid>
            <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'flex-end', maxWidth: 600, height: 742, margin: !props.isLargeScreen && 'auto' || undefined }}>

                {/* REVEALED NFT */}
                <Zoom in={true} timeout={900}>
                    <Box sx={{ ...style, pointerEvents: isRevealedActive && 'auto' || 'none', zIndex: isRevealedActive && 1 || 0, top: !isRevealedActive && 40 || 0, left: !isRevealedActive && 40 || 0 }}>
                        {(props.revealedNftImage?.isLoading || props.revealedNftImage?.src) && <NFT {...props} nftImage={props.revealedNftImage} isRevealed={true} /> || <BlankNFT {...props} isRevealed={true} />}
                    </Box>
                </Zoom>

                {/* UNREVEALED NFT */}
                <Zoom in={true} timeout={900}>
                    <Box sx={{ ...style, pointerEvents: !isRevealedActive && 'auto' || 'none', zIndex: !isRevealedActive && 1 || 0, top: isRevealedActive && 40 || 0, left: isRevealedActive && 40 || 0 }}>
                        {(props.unRevealedtNftImage.isLoading || props.unRevealedtNftImage.src) && <NFT {...props} nftImage={props.unRevealedtNftImage} isRevealed={false} /> || <BlankNFT {...props} isRevealed={false} />}
                    </Box>
                </Zoom>
            </Box>
        </Grid>
    );
}
