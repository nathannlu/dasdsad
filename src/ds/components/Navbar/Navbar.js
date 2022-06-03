import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Container,
    Stack,
    Menu,
    MenuItem,
    ListItemText,
    ListItemIcon,
} from 'ds/components';
import { useAuth } from 'libs/auth';
import { useWeb3 } from 'libs/web3';
import { AppBar } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = ({ pageName }) => {
    const { logout } = useAuth();
    const { walletController } = useWeb3();
    const [anchorEl, setAnchorEl] = useState(null);
    const [state, setState] = useState({ walletType: null, walletAddress: null });
    const open = Boolean(anchorEl);

    useEffect(() => {
//        console.log(walletController, 'walletController NAVBAR', walletController?.getState());
        const { wallet, address } = walletController?.getState();

        setState(prevState => ({ ...prevState, walletType: wallet || null, walletAddress: address || null }));
    }, [walletController?.state?.address, walletController?.state?.wallet]);

    return (
        <AppBar
            position="fixed"
            sx={{
                bgcolor: 'grey.100',
                py: 2,
                boxShadow: 'none',
                borderBottom: '1px solid rgba(0,0,0,.2)',
                paddingTop: '10px',
                paddingBottom: '10px',
            }}>
            <Container>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center">
                    <Link to="/dashboard">
                        <img
                            style={{ height: '25px' }}
                            src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d34ab7c783ea4e08774112_combination-primary-logo.png"
                        />
                    </Link>
                    <Box className="ml-auto">
                        <div
                            id="account-button"
                            aria-controls="account-menu"
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            className="ml-auto"
                            style={{ color: 'black', cursor: 'pointer', border: '1px solid rgba(0,0,0,.5)', padding: '4px 8px', borderRadius: '9999px' }}>
                            {state.walletAddress ? (
                                <Stack gap={1} direction="row">
                                    <div>
                                        {state.walletAddress.substring(0, 4)}...{state.walletAddress.slice(-3)}
                                    </div>

                                    <div>
                                        {state.walletType === 'metamask' ? (
                                            <img style={{ height: '25px', width: '25px', objectFit: 'cover' }} src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png" />
                                        ) : (
                                            <img style={{ height: '25px', width: '25px', objectFit: 'cover' }} src="https://ph-files.imgix.net/f05a61be-d906-4ad8-a68d-88f7c257574d.png?auto=format" />
                                        )}
                                    </div>
                                </Stack>
                            ) : "Wallet not connected"}
                        </div>
                        <Menu
                            id="account-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={() => setAnchorEl(null)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}>
                            <MenuItem component={Link} to="/billing">
                                <ListItemIcon>
                                    <AccountBalanceWalletIcon />
                                </ListItemIcon>
                                <ListItemText primary="Billing" />
                            </MenuItem>
                            <MenuItem onClick={logout}>
                                <ListItemIcon>
                                    <LogoutIcon />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </MenuItem>
                        </Menu>
                    </Box>
                </Stack>
            </Container>
        </AppBar>
    );
};

export default Navbar;
