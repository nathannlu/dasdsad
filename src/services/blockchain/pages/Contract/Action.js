import React, { useState } from 'react';
import { useContractDetails } from './hooks/useContractDetails';
import { useContractActions } from './hooks/useContractActions';
import { useWeb3 } from 'libs/web3';
import { Chip } from '@mui/material';
import {
    Fade,
    Container,
    Link,
    TextField,
    Stack,
    Box,
    Grid,
    Card,
    Typography,
    Button,
    Divider,
} from 'ds/components';
import {
    LockOpen as LockOpenIcon,
    Lock as LockIcon,
    SwapVert as SwapVertIcon,
    Payment as PaymentIcon,
    Upload as UploadIcon,
} from '@mui/icons-material';

const ethActions = [
    { title: 'Update metadata', value: 'metadata' },
    { title: 'Update max per mint', value: 'max' },
    { title: 'Update max per wallet', value: 'maxWallet' },
    { title: 'Update price', value: 'price' },
    { title: 'Airdrop addresses', value: 'airdrop' },
    { title: 'Set whitelist', value: 'whitelist' },
];

const solActions = [
    { title: 'Update price', value: 'price' },
    { title: 'Set whitelist token', value: 'whitelistToken' },
];

const Actions = ({ id, contract }) => {
    const { getNetworkID, wallet } = useWeb3();
    const { isPresaleOpen, isPublicSaleOpen } = useContractDetails(
        contract.address,
        getNetworkID()
    );
    const {
        actionForm: {
            airdropList,
            whitelistAddresses,
            maxPerMintCount,
            newPrice,
            newMetadataUrl,
            maxPerWalletCount,
            whitelistToken
        },
        updateBaseUri,
        setMaxPerMint,
        setCost,
        airdrop,
        openSales,
        openPresale,
        setMerkleRoot,
        presaleMint,
        mint,
        withdraw,
        setMaxPerWallet,
    } = useContractActions(contract.address, getNetworkID());
    const [selectedUpdate, setSelectedUpdate] = useState('metadata');

    let env;
    if (contract.blockchain == 'solanadevnet') {
        env = 'devnet';
    } else if (contract.blockchain == 'solana') {
        env = 'mainnet';
    }

    return (
        <>
            <Stack gap={3}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Interact
                </Typography>
                {contract?.blockchain?.indexOf('solana') === -1 ? (
                    <>
                        <Stack direction="row" gap={2}>
                            <Button
                                startIcon={<SwapVertIcon />}
                                size="small"
                                variant="contained"
                                onClick={() => withdraw()}>
                                Pay out to bank
                            </Button>
                            {isPublicSaleOpen ? (
                                <Button
                                    startIcon={<LockIcon />}
                                    size="small"
                                    variant="contained"
                                    onClick={() => openSales(false)}
                                    color="error">
                                    Close Public Sales
                                </Button>
                            ) : (
                                <Button
                                    startIcon={<LockOpenIcon />}
                                    size="small"
                                    variant="contained"
                                    onClick={() => openSales(true)}>
                                    Open Public Sales
                                </Button>
                            )}
                            {isPresaleOpen ? (
                                <Button
                                    startIcon={<LockIcon />}
                                    size="small"
                                    variant="contained"
                                    onClick={() => openPresale(false)}
                                    color="error">
                                    Close Pre-Sales
                                </Button>
                            ) : (
                                <Button
                                    startIcon={<LockOpenIcon />}
                                    size="small"
                                    variant="contained"
                                    onClick={() => openPresale(true)}>
                                    Open Pre-Sales
                                </Button>
                            )}

                            <Button
                                startIcon={<PaymentIcon />}
                                size="small"
                                variant="contained"
                                onClick={() => mint(1)}
                                disabled={!isPublicSaleOpen}>
                                Mint
                            </Button>
                            <Button
                                startIcon={<PaymentIcon />}
                                size="small"
                                variant="contained"
                                onClick={() =>
                                    presaleMint(
                                        contract.nftCollection.whitelist || ['']
                                    )
                                }
                                disabled={!isPresaleOpen}>
                                Presale Mint
                            </Button>
                        </Stack>
                        <Grid container>
                            <Grid xs={3} item pr={2}>
                                <Stack gap={1}>
                                    {ethActions.map((action, i) => (
                                        <Card
                                            key={i}
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                cursor: 'pointer',
                                                background:
                                                    selectedUpdate ==
                                                        action.value &&
                                                    '#42a5f520',
                                                color:
                                                    selectedUpdate ==
                                                        action.value &&
                                                    'primary.main',
                                                transition: '.2s all',
                                            }}
                                            onClick={() =>
                                                setSelectedUpdate(action.value)
                                            }
                                            variant="contained">
                                            <Typography>
                                                {action.title}
                                            </Typography>
                                        </Card>
                                    ))}
                                </Stack>
                            </Grid>
                            <Grid xs={9} item>
                                <Stack>
                                    {
                                        {
                                            metadata: (
                                                <Stack direction="row">
                                                    <TextField
                                                        size="small"
                                                        {...newMetadataUrl}
                                                    />
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        onClick={() =>
                                                            updateBaseUri()
                                                        }>
                                                        <UploadIcon />
                                                    </Button>
                                                </Stack>
                                            ),
                                            max: (
                                                <Stack direction="row">
                                                    <TextField
                                                        size="small"
                                                        {...maxPerMintCount}
                                                    />
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        onClick={() =>
                                                            setMaxPerMint()
                                                        }>
                                                        <UploadIcon />
                                                    </Button>
                                                </Stack>
                                            ),
                                            maxWallet: (
                                                <Stack direction="row">
                                                    <TextField
                                                        size="small"
                                                        {...maxPerWalletCount}
                                                    />
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        onClick={() =>
                                                            setMaxPerWallet()
                                                        }>
                                                        <UploadIcon />
                                                    </Button>
                                                </Stack>
                                            ),
                                            price: (
                                                <Stack direction="row">
                                                    <TextField
                                                        size="small"
                                                        {...newPrice}
                                                    />
                                                    {
                                                        contract.nftCollection
                                                            .currency
                                                    }

                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        onClick={() =>
                                                            setCost()
                                                        }>
                                                        <UploadIcon />
                                                    </Button>
                                                </Stack>
                                            ),
                                            airdrop: (
                                                <Stack direction="row">
                                                    <TextField
                                                        sx={{ width: '500px' }}
                                                        multiline
                                                        rows={7}
                                                        size="small"
                                                        {...airdropList}
                                                    />
                                                    <Box>
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            onClick={() =>
                                                                airdrop()
                                                            }>
                                                            <UploadIcon />
                                                        </Button>
                                                    </Box>
                                                </Stack>
                                            ),
                                            whitelist: (
                                                <Stack direction="row">
                                                    <TextField
                                                        sx={{ width: '500px' }}
                                                        multiline
                                                        rows={7}
                                                        size="small"
                                                        {...whitelistAddresses}
                                                    />
                                                    <Box>
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            onClick={() =>
                                                                setMerkleRoot(
                                                                    id
                                                                )
                                                            }>
                                                            <UploadIcon />
                                                        </Button>
                                                    </Box>
                                                </Stack>
                                            ),
                                        }[selectedUpdate]
                                    }
                                </Stack>
                            </Grid>
                        </Grid>
                    </>
                ) : (
                    <>
                        <Stack direction="row" gap={2}>
                            <Button
                                startIcon={<SwapVertIcon />}
                                size="small"
                                variant="contained"
                                onClick={() => withdraw(wallet, env)}>
                                Close smart contract & withdraw rent
                            </Button>
                            <Button
                                startIcon={<PaymentIcon />}
                                size="small"
                                variant="contained"
                                onClick={() => mint(1, wallet, env)}>
                                Mint
                            </Button>
                        </Stack>

                        <Grid container>
                            <Grid xs={3} item pr={2}>
                                <Stack gap={1}>
                                    {solActions.map((action, i) => (
                                        <Card
                                            key={i}
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                cursor: 'pointer',
                                                background:
                                                    selectedUpdate ==
                                                        action.value &&
                                                    '#42a5f520',
                                                color:
                                                    selectedUpdate ==
                                                        action.value &&
                                                    'primary.main',
                                                transition: '.2s all',
                                            }}
                                            onClick={() =>
                                                setSelectedUpdate(action.value)
                                            }
                                            variant="contained">
                                            <Typography>
                                                {action.title}
                                            </Typography>
                                        </Card>
                                    ))}
                                </Stack>
                            </Grid>
                            <Grid xs={9} item>
                                <Stack>
                                    {
                                        {
                                        
                                            whitelistToken: (
                                                <Stack direction="row">
                                                    <TextField
                                                        size="small"
                                                        {...whitelistToken}
                                                    />
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        onClick={() =>
                                                            setMaxPerWallet()
                                                        }>
                                                        <UploadIcon />
                                                    </Button>
                                                </Stack>
                                            ),
                                            price: (
                                                <Stack direction="row">
                                                    <TextField
                                                        size="small"
                                                        {...newPrice}
                                                    />
                                                    {
                                                        contract.nftCollection
                                                            .currency
                                                    }

                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        onClick={() =>
                                                            setCost()
                                                        }>
                                                        <UploadIcon />
                                                    </Button>
                                                </Stack>
                                            )
                                        }[selectedUpdate]
                                    }
                                </Stack>
                            </Grid>
                        </Grid>

                    </>
                    
                )}
            </Stack>
        </>
    );
};

export default Actions;
