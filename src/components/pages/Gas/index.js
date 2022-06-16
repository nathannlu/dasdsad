import React from 'react';
import { Helmet } from 'react-helmet';
import { Fade, Box, Typography } from 'ds/components';
import { Chip, Stack, Switch, FormGroup, FormControlLabel } from '@mui/material';
import { GrCircleInformation } from 'react-icons/gr'
import { useGas } from './hooks/useGas'

const Gas = () => {
    const { 
        gasBaseFee,
        priceUSD,
        estimates,
        isEthUsd,
        setIsEthUsd,
        isSolUsd,
        setIsSolUsd 
    } = useGas();

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
                    <Box display='flex' flexDirection='column' mt='.5em'>
                        <Stack spacing='1em' direction='row' alignItems='center' mt='1em'>
                            <Stack spacing='1em'>
                                <Stack direction='row' spacing='1em' alignItems='center'>
                                    <Chip label="Ethereum (ERC721A)" />
                                    <FormGroup>
                                        <FormControlLabel control={<Switch checked={isEthUsd} onChange={(e) => setIsEthUsd(e.target.checked)} />} label="in USD" />
                                    </FormGroup>
                                </Stack>
                                <Typography fontSize='10pt'>
                                    Estimates calculated at {gasBaseFee?.ethereum} gwei and the ETH price of ${priceUSD?.ethereum}
                                </Typography>
                                <Stack spacing='.75em' padding='1.5em' bgcolor='rgb(245,245,245)' border='1px solid #e2e8f0' borderRadius='10px' maxWidth='300px'>
                                    <Typography fontWeight='bold'>
                                        NFT Collection
                                    </Typography>
                                    <Stack direction='row' alignItems='center' spacing='.5em' justifyContent='space-between'>
                                        <Stack direction='row' alignItems='center' spacing='.5em'>
                                            <GrCircleInformation />
                                            <Typography fontSize='10pt'>
                                                Contract creation:
                                            </Typography>
                                        </Stack>
                                        <Typography fontSize='10pt'>
                                            {isEthUsd ? `$${estimates?.ethereum?.contractCreation?.usd} USD` : `${estimates?.ethereum?.contractCreation?.eth} ETH`}
                                        </Typography>
                                    </Stack>
                                    <Stack direction='row' alignItems='center' spacing='.5em' justifyContent='space-between'>
                                        <Stack direction='row' alignItems='center' spacing='.5em'>
                                            <GrCircleInformation />
                                            <Typography fontSize='10pt'>
                                                Mint fees:
                                            </Typography>
                                        </Stack>
                                        <Typography fontSize='10pt'>
                                            {isEthUsd ? `$${estimates?.ethereum?.mintFees?.usd} USD` : `${estimates?.ethereum?.mintFees?.eth} ETH`}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>

                        <Stack spacing='1em' direction='row' alignItems='center' mt='2em'>
                            <Stack spacing='1em'>
                                <Stack direction='row' spacing='1em' alignItems='center'>
                                    <Chip label="Solana" />
                                    <FormGroup>
                                        <FormControlLabel control={<Switch checked={isSolUsd} onChange={(e) => setIsSolUsd(e.target.checked)} />} label="in USD" />
                                    </FormGroup>
                                </Stack>
                                <Typography fontSize='10pt'>
                                    Estimates calculated at {gasBaseFee?.solana} gwei and the SOL price of ${priceUSD?.solana}
                                </Typography>
                                <Stack spacing='.75em' padding='1.5em' bgcolor='rgb(245,245,245)' border='1px solid #e2e8f0' borderRadius='10px' maxWidth='300px'>
                                    <Typography fontWeight='bold'>
                                        NFT Collection
                                    </Typography>
                                    <Stack direction='row' alignItems='center' spacing='.5em' justifyContent='space-between'>
                                        <Stack direction='row' alignItems='center' spacing='.5em'>
                                            <GrCircleInformation />
                                            <Typography fontSize='10pt'>
                                                Deployment rent:
                                            </Typography>
                                        </Stack>
                                        <Typography fontSize='10pt'>
                                            {isSolUsd ? `$${estimates?.solana?.deploymentRent?.usd} USD` : `${estimates?.solana?.deploymentRent?.sol} SOL`}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </Fade>
    );
};

export default Gas;
