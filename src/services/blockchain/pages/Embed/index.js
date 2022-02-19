import React, { useEffect } from 'react';
import { Box, Typography, Button, IconButton } from 'ds/components';
import { Stack, TextField, ButtonGroup } from '@mui/material';
import { LoadingButton  } from '@mui/lab';
import { useEmbed } from './hooks/useEmbed'
import { useWeb3 } from 'libs/web3';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Embed = () => {   
    const { loadWeb3, loadBlockchainData } = useWeb3();
    const { contract, prefix, price, maxSupply, currentSupply, isSwitch, isMinting, count, onMint, onSwitch, setCount } = useEmbed();

    useEffect(() => {
		(async () => {
			await loadWeb3();
            await loadBlockchainData();
		})()
	}, [])

    return (
        <Box
            sx={{
                height: '100vh',
                overflow: 'hidden',
                position: 'absolute',
                zIndex: 1100,
                top: 0,
                width: '100%',
                bgcolor: 'white'
            }}
        >
            {maxSupply != -1 && contract ? (
                <Box
                    display='flex'
                    flexDirection='column'
                    height='100vh'
                >
                    {!isSwitch ? (
                        <Stack direction='row' spacing={1}>
                            <LoadingButton
                                variant='contained'
                                loading={isMinting}
                                loadingIndicator='Minting...'
                                startIcon={<DoneAllIcon />}
                                onClick={onMint}
                                sx={{
                                    flex: '1'
                                }}
                            >
                                Mint {(price * count).toString().substring(0, 5)} {prefix}
                            </LoadingButton>
                            <Box
                                width='100px'
                                display='flex'
                                height='100%'
                                alignItems='center'
                            >
                                <TextField 
                                    type='number'
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 1, max: contract.nftCollection.size }} 
                                    value={count}
                                    onChange={(e) => setCount(e.target.value)}
                                />
                                <ButtonGroup
                                    orientation="vertical"
                                    aria-label="vertical outlined button group"
                                >
                                    <IconButton 
                                        key="one" 
                                        variable='contained' 
                                        size='small' 
                                        sx={{ padding: 0 }}
                                        onClick={() => {
                                            if (count < contract.nftCollection.size) {
                                                setCount(prevCount => prevCount + 1);
                                            }
                                        }}
                                    >
                                        <KeyboardArrowUpIcon/>
                                    </IconButton>
                                    <IconButton 
                                        key="two" 
                                        variable='contained' 
                                        size='small' 
                                        sx={{ padding: 0 }}
                                        onClick={() => {
                                            if (count > 1) {
                                                setCount(prevCount => prevCount - 1);
                                            }
                                        }}
                                    >
                                        <KeyboardArrowDownIcon/>
                                    </IconButton>
                                </ButtonGroup>
                            </Box>
                        </Stack>
                    ) : (
                        <Button
                            variant='contained'
                            startIcon={<CompareArrowsIcon />}
                            onClick={onSwitch}
                            sx={{
                                bgcolor: 'darkgray',
                                "&:hover": {
                                    bgcolor: "gray"
                                }
                            }}
                            
                        >
                            Switch Network
                        </Button>
                    )}
                    <Box
                        display='flex'
                        justifyContent='space-between'
                    >
                        <Typography fontSize='10pt'>
                            {currentSupply}/{maxSupply}
                        </Typography>
                        <Box 
                            display='flex'
                            alignItems='center'
                        >
                            <Typography 
                                fontSize='10pt'
                                color='rgba(0,0,0,0.4)'
                                sx={{
                                    mr: '.25em'
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
                    height='100vh'
                >
                    Something wrong occured
                </Box>
            )}
        </Box>
    )
}

export default Embed
