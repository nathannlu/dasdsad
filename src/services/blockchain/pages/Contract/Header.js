import React from 'react';
import {
    Fade,
    Container,
    Link,
    TextField,
    Stack,
    Box,
    Grid,
    Typography,
    Button,
    Divider,
} from 'ds/components';
import { Chip } from '@mui/material';
import {
    WarningAmber as WarningAmberIcon,
    SwapVert as SwapVertIcon,
    Payment as PaymentIcon,
    Upload as UploadIcon,
} from '@mui/icons-material';

const Header = ({ contract }) => {
    const isSetupComplete =
        contract?.nftCollection?.baseUri && contract?.address ? true : false;

    return (
        <Stack direction="column" gap={2}>
            <Stack direction="row" gap={1}>
                {
                    {
                        ethereum: (
                            <img
                                style={{ width: '25px', borderRadius: 9999 }}
                                src="https://opensea.io/static/images/logos/ethereum.png"
                            />
                        ),
                        polygon: (
                            <img
                                style={{ width: '25px', borderRadius: 9999 }}
                                src="https://opensea.io/static/images/logos/polygon.svg"
                            />
                        ),
                    }[contract.blockchain]
                }
                <Typography>{contract?.blockchain?.indexOf('solana') !== -1 ? 'Solana' : 'ERC-721'} contract</Typography>
            </Stack>
            <Box>
                <Typography variant="h4">Contract overview</Typography>
                <Typography variant="body">
                    Your deployed smart-contract&apos;s address on the
                    blockchain
                </Typography>
            </Box>

            <Stack direction="row" gap={1}>
                <Typography variant="body">Status:</Typography>
                {!isSetupComplete ? (
                    <Chip
                        icon={<WarningAmberIcon />}
                        color="warning"
                        label="Set up required"
                        size='small'
                    />
                ) : (
                    <Chip color="success" label="Live on blockchain"  size='small'/>
                )}
            </Stack>
            {contract?.address && (
                <Stack direction="column" gap={2}>
                    <Box>
                        <Stack
                            sx={{
                                px: 1,
                                py: 0.5,
                                bgcolor: 'grey.100',
                                fontWeight: 'bold',
                                border: '0.5px solid rgba(0,0,0,.1)',
                                borderRadius: 2,
                            }}>
                            {contract.address ? contract.address : null}
                        </Stack>
                    </Box>
                    <Box>
                        <a
                            style={{ color: 'blue' }}
                            href="https://opensea.io/get-listed/step-two"
                            target="_blank"
                            rel="noreferrer">
                            Connect with OpenSea &rarr;
                        </a>
                    </Box>
                </Stack>
            )}
        </Stack>
    );
};

export default Header;
