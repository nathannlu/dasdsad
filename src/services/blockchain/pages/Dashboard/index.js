import React, { useEffect, useState } from 'react';
import {
    Menu,
    MenuItem,
    Container,
    Button,
    IconButton,
    Link,
    Box,
    Typography,
    Stack,
    Card,
    Grid,
    Fade,
} from 'ds/components';
import { Chip } from '@mui/material';
import { useToast } from 'ds/hooks/useToast';
import { Add as AddIcon } from '@mui/icons-material';
import { useContract } from 'services/blockchain/provider';
import { useDeleteContract } from 'services/blockchain/gql/hooks/contract.hook';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { WarningAmber as WarningAmberIcon } from '@mui/icons-material';

import { isTestnetBlockchain } from '@ambition-blockchain/controllers';
import { BlockchainLogo } from '../../widgets';

const Dashboard = () => {
    const { contracts, onDeleteContract } = useContract();
    const { addToast } = useToast();
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState('');
    const [animate, setAnimation] = useState(false);

    const [deleteContract] = useDeleteContract({
        onCompleted: (data) => {
            addToast({
                severity: 'success',
                message: 'Successfully deleted contract',
            });
        },
        onError: (err) => {
            addToast({
                severity: 'error',
                message: err.message,
            });
        },
    });

    const handleClick = (event, id) => {
        setOpen(id);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
        setAnchorEl(null);
    };

    useEffect(() => {
        const interval = setInterval(() => setAnimation(prevState => !prevState), 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <Fade in>
            <Container sx={{ pt: 4 }}>
                {contracts.length > 0 ? (
                    <Stack gap={2}>
                        <Stack direction="row" alignItems="center">
                            <Box>
                                <Typography variant="h4">
                                    Your contracts
                                </Typography>
                                <Typography gutterBottom variant="body">
                                    A list of your deployed contracts
                                </Typography>
                            </Box>

                            <Stack gap={1} direction="row" sx={{ ml: 'auto' }}>
                                <a href="/generator">
                                    <Button size="small">
                                        Generate your collection
                                    </Button>
                                </a>
                                <Link to="/smart-contracts/v2/new">
                                    <Button
                                        size="small"
                                        startIcon={<AddIcon />}
                                        variant="contained">
                                        Create contract
                                    </Button>
                                </Link>
                            </Stack>
                        </Stack>

                        <Grid container>
                            {contracts.map((contract, i) => {
                                const isSetupComplete = contract?.address && contract?.nftCollection?.baseUri;
                                return (
                                    <Grid key={i} p={1} item xs={3}>
                                        <Card variant="outlined">
                                            <Link
                                                to={contract.type == 'erc721a' ? `/smart-contracts/v2/${contract.id}` : `/smart-contracts/${contract.id}`}>
                                                <Box
                                                    sx={{
                                                        bgcolor: 'grey.100',
                                                        position: 'relative',
                                                    }}>

                                                    {!isSetupComplete && (
                                                        <Box
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                right: 0,
                                                            }}
                                                            p={2}>
                                                            <Chip
                                                                size="small"
                                                                icon={<WarningAmberIcon />}
                                                                color="warning"
                                                                label="Set up required"
                                                            />
                                                        </Box>
                                                    )}

                                                    {!isTestnetBlockchain(contract?.blockchain) && isSetupComplete && (
                                                        <Box
                                                            sx={{
                                                                position: 'absolute',
                                                                bottom: 0,
                                                                right: 0,
                                                            }}
                                                            p={2}>
                                                            <Fade in={animate}>
                                                                <Chip sx={{ px: 1 }} size="small" color="success" label="LIVE" />
                                                            </Fade>
                                                        </Box>
                                                    )}

                                                    <img
                                                        style={{ width: '100%' }}
                                                        src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/620886113653fa7c2d6386a2_Contract%20(right%20side%20view).png"
                                                    />
                                                </Box>
                                            </Link>
                                            <Stack
                                                sx={{
                                                    bgcolor: 'white',
                                                    px: 2,
                                                    py: 1,
                                                }}>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    gap={1}>
                                                    <Box>
                                                        <BlockchainLogo blockchain={contract.blockchain} />
                                                    </Box>
                                                    <Box>
                                                        <Typography>
                                                            {contract.name}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ ml: 'auto' }}>
                                                        <IconButton
                                                            aria-controls={
                                                                open
                                                                    ? `${contract.id}-menu`
                                                                    : undefined
                                                            }
                                                            onClick={(e) =>
                                                                handleClick(
                                                                    e,
                                                                    contract.id
                                                                )
                                                            }>
                                                            <MoreHorizIcon />
                                                        </IconButton>
                                                        <Menu
                                                            id={`${contract.id}-menu`}
                                                            anchorEl={anchorEl}
                                                            open={
                                                                open == contract.id
                                                            }
                                                            onClose={handleClose}
                                                            anchorOrigin={{
                                                                vertical: 'bottom',
                                                                horizontal: 'right',
                                                            }}
                                                            transformOrigin={{
                                                                vertical: 'top',
                                                                horizontal: 'right',
                                                            }}>
                                                            <MenuItem
                                                                onClick={() => onDeleteContract(contract, deleteContract, handleClose)}>
                                                                Delete
                                                            </MenuItem>
                                                        </Menu>
                                                    </Box>
                                                </Stack>
                                            </Stack>
                                        </Card>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Stack>
                ) : (
                    <Grid item xs={4} sx={{ margin: '0 auto' }}>
                        <Stack mt={10} gap={2}>
                            <Box>
                                <img
                                    style={{ height: '40px' }}
                                    src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d2aac6943de77b8cf95ef1_deploy-to-blockchain-icon.png"
                                />
                            </Box>
                            <Stack>
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    sx={{ fontWeight: 'bold' }}>
                                    Create your first smart contract
                                </Typography>
                                <Typography
                                    variant="body"
                                    sx={{ opacity: 0.8 }}>
                                    Deploy your NFT collection to ethereum with
                                    our no-code smart contracts
                                </Typography>
                            </Stack>
                            <Box>
                                <Link to="/smart-contracts/v2/new">
                                    <Button
                                        startIcon={<AddIcon />}
                                        variant="contained"
                                        size="small">
                                        Create smart contract
                                    </Button>
                                </Link>
                            </Box>
                        </Stack>
                    </Grid>
                )}
            </Container>
        </Fade>
    );
};

export default Dashboard;
