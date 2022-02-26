import React from 'react';
import { Box, Typography, Button, IconButton } from 'ds/components';
import { Stack, TextField, ButtonGroup, CircularProgress, Menu, MenuList, MenuItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import { LoadingButton  } from '@mui/lab';
import { useEmbed } from './hooks/useEmbed'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DiamondIcon from '@mui/icons-material/Diamond';

const Embed = () => {
    const { contract, buttonState, textColor, bgImage, price, prefix, soldCount, size, isMinting, mintCount, metadataUrl, max, chooseWalletState, onConnectWallet, onSwitch, onMint, setMintCount, setChooseWalletState } = useEmbed();

    return (
        <Box
            sx={{
                height: '100vh',
                overflow: 'hidden',
                position: 'absolute',
                zIndex: 1100,
                top: 0,
                width: '100%',
                bgcolor: 'white',
                backgroundImage: `url('${bgImage}')`,
                objectFit: 'cover',
            }}
        >
            {contract && metadataUrl.length > 0 ? (
                <Box
                    display='flex'
                    flexDirection='column'
                    height='100vh'
                    padding='1em'
                >
                    {buttonState === 0 && (
                        <>
                            {!chooseWalletState ? (
                                <Button
                                    variant='contained'
                                    startIcon={<AccountBalanceWalletIcon />}
                                    sx={{
                                        bgcolor: 'rgb(238,72,0)',
                                        "&:hover": {
                                            bgcolor: "rgb(212, 66, 2)"
                                        }
                                    }}
                                    onClick={() => setChooseWalletState(true)}
                                >
                                    Connect Wallet
                                </Button>
                            ) : (
                                <Stack
                                    direction='row'
                                    spacing={1}
                                    justifyContent='center'
                                >
                                    <Chip 
                                        icon={<AccountBalanceWalletIcon fontSize='12pt'/>} 
                                        label="Metamask" 
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                                cursor: 'pointer'
                                            }
                                        }} 
                                        onClick={() => onConnectWallet(0)}
                                    />
                                    <Chip 
                                        icon={<AccountBalanceWalletIcon fontSize='12pt'/>} 
                                        label="Phantom" 
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                                cursor: 'pointer'
                                            }
                                        }} 
                                        onClick={() => onConnectWallet(1)}
                                    />
                                </Stack>
                            )}
                        </>
                    )}
                    {buttonState === 1 && (
                        <Stack direction='row' spacing={1} sx={{width: '100%'}}>
                            <LoadingButton
                                variant='contained'
                                loading={isMinting}
                                loadingIndicator='Minting...'
                                startIcon={<DiamondIcon />}
                                sx={{
                                    flex: '1'
                                }}
                                onClick={onMint}
                            >
                                Mint {(price * mintCount).toString().substring(0, 5)} {prefix}
                            </LoadingButton>
                            <Box
                                width='100px'
                                display='flex'
                                height='100%'
                                alignItems='center'
                            >
                                <TextField 
                                    type='number'
                                    inputProps={{ 
                                        inputMode: 'numeric', 
                                        pattern: '[0-9]*', 
                                        min: 1, 
                                        max: contract.nftCollection.size,
                                    }} 
                                    value={mintCount}
                                    onChange={(e) => setMintCount(e.target.value)}
                                    sx={{
                                        input: {
                                            borderColor: `${textColor}`,
                                            color: `${textColor}`,
                                        },
                                        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                            borderColor: `${textColor}`,
                                        },
                                    }}
                                />
                                <ButtonGroup
                                    orientation="vertical"
                                    aria-label="vertical outlined button group"
                                >
                                    <IconButton 
                                        key="one" 
                                        variable='contained' 
                                        size='small' 
                                        sx={{ 
                                            padding: 0,
                                            color: `${textColor}`
                                        }}
                                        onClick={() => {
                                            if (mintCount < contract.nftCollection.size && mintCount <= max) {
                                                setMintCount(prevCount => prevCount + 1);
                                            }
                                        }}
                                    >
                                        <KeyboardArrowUpIcon/>
                                    </IconButton>
                                    <IconButton 
                                        key="two" 
                                        variable='contained' 
                                        size='small' 
                                        sx={{ 
                                            padding: 0,
                                            color: `${textColor}`
                                        }}
                                        onClick={() => {
                                            if (mintCount > 1) {
                                                setMintCount(prevCount => prevCount - 1);
                                            }
                                        }}
                                    >
                                        <KeyboardArrowDownIcon/>
                                    </IconButton>
                                </ButtonGroup>
                            </Box>
                        </Stack>
                    )}
                    {buttonState === 2 && (
                        <Button
                            variant='contained'
                            startIcon={<CompareArrowsIcon />}
                            sx={{
                                bgcolor: 'darkgray',
                                "&:hover": {
                                    bgcolor: "gray"
                                }
                            }}
                            onClick={onSwitch}
                        >
                            Switch Network
                        </Button>
                    )}
                    <Box
                        display='flex'
                        justifyContent={buttonState === 1 ? 'space-between' : 'flex-end'}
                        width='100%'
                        mt='.5em'
                    >
                        {buttonState === 1 && (
                            <Typography fontSize='12pt' sx={{ color: `${textColor}`, fontWeight: 600 }}>
                                {soldCount}/{size}
                            </Typography>
                        )}
                        <Box 
                            display='flex'
                            alignItems='center'
                        >
                            <Typography 
                                fontSize='10pt'
                                color='rgba(0,0,0,0.4)'
                                sx={{
                                    mr: '.25em',
                                    color: `${textColor}`
                                }}
                            >
                                Powered by
                            </Typography>
                            <a href="https://ambition.so/">
                                <img style={{height: '15px'}} src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d34ab7c783ea4e08774112_combination-primary-logo.png" alt='Ambition Logo'/>
                            </a>
                        </Box>
                    </Box>
                </Box>
            ) : (
                <Box
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                    justifyContent='center'
                    height='100vh'
                >
                    <CircularProgress />
                </Box>
            )}
        </Box>
    )
}

export default Embed