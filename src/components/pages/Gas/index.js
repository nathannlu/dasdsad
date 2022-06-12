import React from 'react';
import { Helmet } from 'react-helmet';
import { Fade, Box, Link, Button, Typography } from 'ds/components';
import { Chip, Stack, Switch, FormGroup, FormControlLabel } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { GrCircleInformation } from 'react-icons/gr'
import { useGas } from './hooks/useGas'

const Gas = () => {
    const { fees } = useGas();

    return (
        <Fade in>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: '2em', mx: '2em', mb: '4em'}}>
                <Helmet>
                    <title>Gas Estimator - Ambition</title>
                    <link rel="canonical" href="https://app.ambition.so" />
                    <meta
                        name="description"
                        content="Generate thousands of digital arts online - The simplest way."
                    />
                </Helmet>
                <Box display='flex' flexDirection='column' maxWidth='1140px' justifyContent='flex-start' width='100%'>
                    <Typography as='h1' fontSize='2rem'>
                        Gas Estimator
                    </Typography>
                    <Typography fontSize='10pt'>
                        Estimates calculated at 34 gwei and the ETH price of $1455.27.
                    </Typography>
                    <Stack spacing='2em' mt='.5em'>
                        <Stack spacing='1em' direction='row' alignItems='center'>
                            <Stack spacing='1em'>
                                <Stack direction='row' spacing='1em' alignItems='center'>
                                    <Chip label="Ethereum (ERC721A)" />
                                    <FormGroup>
                                        <FormControlLabel control={<Switch />} label="to USD" />
                                    </FormGroup>
                                </Stack>
                                <Stack spacing='.75em' padding='1.5em' bgcolor='rgb(245,245,245)' border='1px solid #e2e8f0' borderRadius='10px'>
                                    <Typography fontWeight='bold'>
                                        NFT Collection
                                    </Typography>
                                    <Stack direction='row' alignItems='center' spacing='.5em'>
                                        <GrCircleInformation />
                                        <Typography fontSize='10pt'>
                                            Contract creation: 
                                        </Typography>
                                    </Stack>
                                    <Stack direction='row' alignItems='center' spacing='.5em'>
                                        <GrCircleInformation />
                                        <Typography fontSize='10pt'>
                                            Mint fees:
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>

                        <Stack spacing='1em' direction='row' alignItems='center'>
                            <Stack spacing='1em'>
                                <Stack direction='row' spacing='1em' alignItems='center'>
                                    <Chip label="Solana" />
                                    <FormGroup>
                                        <FormControlLabel control={<Switch />} label="to USD" />
                                    </FormGroup>
                                </Stack>
                                <Stack spacing='.75em' padding='1.5em' bgcolor='rgb(245,245,245)' border='1px solid #e2e8f0' borderRadius='10px'>
                                    <Typography fontWeight='bold'>
                                        NFT Collection
                                    </Typography>
                                    <Stack direction='row' alignItems='center' spacing='.5em'>
                                        <GrCircleInformation />
                                        <Typography fontSize='10pt'>
                                            Deployment rent: 
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            </Box>
        </Fade>
    );
};

export default Gas;
