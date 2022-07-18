import React from 'react';

import { Box, Stack, Typography, CircularProgress } from 'ds/components';
import { Card, CardContent } from '@mui/material';

import BlockIcon from '@mui/icons-material/Block';
import CircleIcon from '@mui/icons-material/Circle';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';

import imageNotFound from 'assets/images/image-not-found.png';


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
            padding: '8px',
            borderRadius: '0 8px',
            boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)'
        }}>
					{/*
            <CircleIcon sx={{ color: '#C4C4C4' }} /> &nbsp;
						*/}
					<Typography sx={{ fontSize: '12px',fontWeight: 600, color:  '#0a2540' }}>{isRevealed && 'Revealed' || 'Unrevealed'}</Typography>
        </Box>
    );
}

export const NFT = ({ contract, nftImage, height, nftPrice, isRevealed, disabled }) => {
    const rendetDetails = !!contract;

    return (
        <Card sx={{ width: '500px', height: height, borderRadius: '8px', boxShadow: '0 20px 44px rgb(50 50 93 / 12%), 0 -1px 32px rgb(50 50 93 / 6%), 0 3px 12px rgb(0 0 0 / 8%)' }} raised={true}>
            <CardContent sx={{ padding: '0 !important', height: '100%' }}>
                <Box
                    sx={{
                        backgroundColor: 'white',
                        height: rendetDetails && 'calc(100% - 114px)' || '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column'
                    }}
                >
                    {!nftImage.isLoading ? (
											<>
												{nftImage.src ? (
													<img
														style={{
																height: nftImage.src && '100%' || 'auto',
																width: nftImage.src && '100%' || '80%',
																objectFit: 'cover',
														}}
														src={nftImage.src /*|| imageNotFound*/}
														crossOrigin="*"
													/>
												) : (
													<div>
														Error loading image
													</div>
												)}
											</>
									) : (
										<CircularProgress style={{ height: '100%', alignItems: 'center' }} />
									)}
                </Box>
                {rendetDetails && <NFTDetails contract={contract} nftPrice={nftPrice} disabled={disabled} /> || null}
                <NFTIsRevealedChip isRevealed={isRevealed} disabled={disabled} />
            </CardContent>
        </Card>
    );
}

export const BlankNFT = ({ setIsModalOpen, contract, nftPrice, isRevealed, disabled }) => {
    const rendetDetails = !!contract;

    return (
        <Card sx={{ width: '100%', height: '100%', borderRadius: 16, boxShadow: '0 20px 44px rgb(50 50 93 / 12%), 0 -1px 32px rgb(50 50 93 / 6%), 0 3px 12px rgb(0 0 0 / 8%)' }} raised={true} onClick={e => setIsModalOpen(true)}>
            <CardContent sx={{ padding: '0 !important', height: '100%' }}>
                <Box
                    sx={{
                        backgroundColor: '#3C3C41',
                        height: rendetDetails && 'calc(100% - 114px)' || '100%',
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
                {rendetDetails && <NFTDetails contract={contract} nftPrice={nftPrice} disabled={disabled} /> || null}
                <NFTIsRevealedChip isRevealed={isRevealed} disabled={disabled} />
            </CardContent>
        </Card>
    );
}
