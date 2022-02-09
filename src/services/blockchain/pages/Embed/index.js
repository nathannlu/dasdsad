import React, { useEffect } from 'react';
import { Box, Typography, Button } from 'ds/components';
import { LoadingButton  } from '@mui/lab';
import { useEmbed } from './hooks/useEmbed'
import { useWeb3 } from 'libs/web3';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const Embed = () => {   
    const { loadWeb3, loadBlockchainData } = useWeb3();
    const { prefix, price, maxSupply, currentSupply, isSwitch, isMinting, onMint, onSwitch } = useEmbed();

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
            {maxSupply != -1 ? (
                <Box
                    display='flex'
                    flexDirection='column'
                    height='100vh'
                >
                    {!isSwitch ? (
                        <LoadingButton
                            variant='contained'
                            loading={isMinting}
                            loadingIndicator='Minting...'
                            startIcon={<DoneAllIcon />}
                            onClick={onMint}
                        >
                            Mint {price} {prefix}
                        </LoadingButton>
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
                    Chain ID does not match current smart contract
                </Box>
            )}
        </Box>
    )
}

export default Embed