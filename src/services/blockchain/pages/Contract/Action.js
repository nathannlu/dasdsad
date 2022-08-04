import React, { useState } from 'react';
import { getBlockchainChainId } from '@ambition-blockchain/controllers';

import {
    Lock as LockIcon,
    LockOpen as LockOpenIcon,
    Payment as PaymentIcon,
    SwapVert as SwapVertIcon,
    Upload as UploadIcon
} from '@mui/icons-material';
import { CardHeader } from '@mui/material';
import {
    Box,
    Button,
    Card,
    Grid,
    Stack,
    TextField,
    Typography
} from 'ds/components';
import { useContractActions } from './hooks/useContractActions';
import { useContractDetails } from './hooks/useContractDetails';

const ethActions = [
    { title: 'Update metadata', value: 'metadata' },
    { title: 'Update max per mint', value: 'max' },
    { title: 'Update max per wallet', value: 'maxWallet' },
    { title: 'Update price', value: 'price' },
    { title: 'Airdrop addresses', value: 'airdrop' },
    { title: 'Set whitelist', value: 'whitelist' },
];

const solActions = [
	/*
    // { title: 'Update price', value: 'price' },
    { title: 'Set whitelist token', value: 'whitelistToken' },
    { title: 'Set live date', value: 'livedate' },
    { title: 'Set price', value: 'price' },
		*/
];

const Actions = ({ id, contract }) => {
    const networkId = getBlockchainChainId(contract?.blockchain);

    const { isPresaleOpen, isPublicSaleOpen } = useContractDetails(contract.address, networkId, contract?.blockchain);
    const {
        actionForm: {
            airdropList,
            whitelistAddresses,
            maxPerMintCount,
            newPrice,
            newMetadataUrl,
            maxPerWalletCount,
            whitelistToken,
            goLiveDate,
        },
        updateBaseUri,
        setMaxPerMint,
        setCost,
        airdrop,
        openSales,
        openPresale,
        setMerkleRoot,
        updateWhiteListToken,
        presaleMint,
        mint,
        withdraw,
        setMaxPerWallet,
        updateGoLiveDate
    } = useContractActions(contract.address, contract?.blockchain);

    const [selectedUpdate, setSelectedUpdate] = useState('metadata');
    const env = contract?.blockchain == 'solanadevnet' && 'devnet' || 'mainnet';

    return (
        <Stack gap={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Interact
            </Typography>
            {contract?.blockchain?.indexOf('solana') === -1 ? (
                <React.Fragment>
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
                                                    onClick={() => updateBaseUri()}>
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
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Stack direction="row" gap={2}>
                        <Button
                            startIcon={<SwapVertIcon />}
                            size="small"
                            variant="contained"
                            onClick={() => withdraw(env)}>
                            Close smart contract &amp; withdraw rent
                        </Button>
                        <Button
                            startIcon={<PaymentIcon />}
                            size="small"
                            variant="contained"
                            onClick={() => mint(1, env, true, {})}>
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

                                        <CardHeader
                                            action={
                                                <p style={{ color: 'red' }}> Beta! </p>
                                            }
                                        />
                                        <Typography>
                                            {action.title}
                                        </Typography>
                                    </Card>
                                ))}
                            </Stack>
                        </Grid>
                        <Grid xs={9} item>
                            <Stack>
                                {{
                                    whitelistToken: (
                                        <Grid>
                                            <Stack direction="row">
                                                <TextField
                                                    size="small"
                                                    {...whitelistToken}
                                                />

                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    onClick={() =>
                                                        updateWhiteListToken(env, true)
                                                    }>
                                                    <UploadIcon />
                                                </Button>
                                            </Stack>
                                            <Typography>
                                                Please refer to <a href="https://spl.solana.com/token" target="_blank">SPL-Token documentation </a>
                                                about how to use these for WL!
                                            </Typography>
                                        </Grid>
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
                                    livedate: (
                                        <Grid>
                                            <Stack direction="row">
                                                <input type="datetime-local"
                                                    // value="2017-06-01T08:30"
                                                    {...goLiveDate}
                                                />

                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    onClick={() =>
                                                        updateGoLiveDate(env)
                                                    }>
                                                    <UploadIcon />
                                                </Button>
                                            </Stack>
                                            <Typography>
                                                Set date for public sale! SPL token required for presale.
                                            </Typography>
                                        </Grid>
                                    )
                                }[selectedUpdate]}
                            </Stack>
                        </Grid>
                    </Grid>
                </React.Fragment>
            )}
        </Stack>
    );
};

export default Actions;
