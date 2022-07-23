import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
	Box,
	Container,
	Stack,
	Menu,
	MenuItem,
	Button,
	ListItemText,
	ListItemIcon,
	Typography,
} from 'ds/components';
import { useAuth } from 'libs/auth';
import { useWeb3 } from 'libs/web3';
import { AppBar, Chip } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutIcon from '@mui/icons-material/Logout';
import { LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js'
import * as anchor from '@project-serum/anchor'

const Navbar = ({ pageName }) => {
	const { logout } = useAuth();
	const { walletController, wallet, walletState, setWalletState } = useWeb3();
	const [anchorEl, setAnchorEl] = useState(null);
	// const [state, setState] = useState({
	// 	walletType: null,
	// 	walletAddress: null,
	// });
	const open = Boolean(anchorEl);
	const [balance, setBalance] = useState('');

	useEffect(() => {
		const { wallet, address } = walletController?.getState();
		setWalletState((prevState) => ({
			...prevState,
			walletType: wallet || null,
			walletAddress: address || null,
		}));
	}, [walletController?.state?.address, walletController?.state?.wallet]);

	useEffect(() => {
		/*
		if eth
			web3.getbalance(address)
		else sol
			const connection = new anchor.web3.Connection("devnet")	
			const balance = await connection.getBalance(wallet.publicKey)
			setBalance(balance)
		*/
	}, []);

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
					alignItems="center"
				>
					<Link to="/dashboard">
						<img
							style={{ height: '25px' }}
							src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d34ab7c783ea4e08774112_combination-primary-logo.png"
						/>
					</Link>
					<Stack direction="row" alignItems="center" gap='2em' className="ml-auto">
						<Box>
							<a target="_blank" style={{ color: 'black', fontSize: '16px' }} href="/gas">
								Gas Estimate
							</a>
						</Box>
						<Box>
							<a target="_blank" style={{ color: 'black', fontSize: '16px' }} href="https://www.youtube.com/channel/UCJbdL1g7FnfwBIYuhzDoyGA">
								Tutorials
							</a>
						</Box>
						<Box>
							<a target="_blank" style={{ color: 'black', fontSize: '16px' }} href="https://ambition.so/help-center">
								Docs
							</a>
						</Box>
						<Box style={{color: 'black'}}>
							<Link to="/dashboard">
								Billing
							</Link>
						</Box>
						{walletState.walletAddress ? (

							<Box
								id="account-button"
								aria-controls="account-menu"
								aria-haspopup="true"
								aria-expanded={open ? 'true' : undefined}
								onClick={(e) => setAnchorEl(e.currentTarget)}
								className="ml-auto"
								sx={{
									color: '#000',
									cursor: 'pointer',
									border: '1px solid rgba(0,0,0,.25)',
									padding: '8px',
									borderRadius: '5px',
									width: '260px',
									transition: 'all .2s',
									'&:hover': {
										backgroundColor: '#E5E5EA'
									},
									backgroundColor: open ? '#E5E5EA' : '#fff'
								}}>
								<Stack alignItems="center" justifyContent="center" gap={1} direction="row">
									<Box sx={{ margin: '0 auto' }}>
										{{
											'solana': (<img src="https://static.opensea.io/solana-just-s-symbol-colored.svg" />),
											'0x1': (<img style={{ height: '25px' }} src="https://openseauserdata.com/files/6f8e2979d428180222796ff4a33ab929.svg" />),
											'0x4': (<img style={{ height: '25px' }} src="https://openseauserdata.com/files/6f8e2979d428180222796ff4a33ab929.svg" />),
											'0x89': (<img style={{ height: '25px' }} src="https://cryptopolitanimg.s3.amazonaws.com/wp-content/uploads/2021/06/10164005/polygon-matic-logo.png" />),
											'0x13881': (<img style={{ height: '25px' }} src="https://cryptopolitanimg.s3.amazonaws.com/wp-content/uploads/2021/06/10164005/polygon-matic-logo.png" />),
										}[walletController.getNetworkID()]}
									</Box>

									<Stack sx={{ width: '60%' }}>
										<Typography sx={{ fontSize: '13px', lineHeight: 1.2, fontWeight: 'bold' }} size="small">
											{balance} {{
												'solana': 'SOL',
												'0x1': 'ETH',
												'0x4': 'ETH',
												'0x89': 'MATIC',
												'0x13881': 'MATIC'
											}[walletController.getNetworkID()]}
										</Typography>
										<Typography sx={{ fontSize: '13px', lineHeight: 1.2, opacity: .5 }} size="small">
											{walletState.walletAddress.substring(0, 4)}...
											{walletState.walletAddress.slice(-3)} {{
												'solana': '(Solana)',
												'0x1': '(Ethereum)',
												'0x4': '(Rinkeby)',
												'0x89': '(Polygon)',
												'0x13881': '(Mumbai)'
											}[walletController.getNetworkID()]}
										</Typography>
									</Stack>

									<Box>
										{walletState.walletType === 'metamask' ? (
											<img
												style={{
													height: '25px',
													width: '25px',
													objectFit: 'cover',
												}}
												src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png"
											/>
										) : (
											<img
												style={{
													height: '25px',
													width: '25px',
													objectFit: 'cover',
												}}
												src="https://ph-files.imgix.net/f05a61be-d906-4ad8-a68d-88f7c257574d.png?auto=format"
											/>
										)}
									</Box>

									<Box>
										<KeyboardArrowDownIcon sx={{ fontSize: '16px' }} />
									</Box>
								</Stack>

							</Box>
						) : (
							<Button
								variant="contained"
								size="small"
								startIcon={<AccountBalanceWalletIcon />}
								sx={{
									width: '260px',
									height: '49px',
									color: 'white',
									borderRadius: '5px',
								}}
								color="black"
								onClick={async () => {
									const curentWalletType = window.localStorage.getItem('ambition-wallet');
									await walletController.loadWalletProvider(curentWalletType || 'metamask');
									const { wallet, address } = walletController?.getState();

									setWalletState((prevState) => ({
										...prevState,
										walletType: wallet || null,
										walletAddress: address || null,
									}));
								}}>
								Connect wallet
							</Button>
						)}

						<Menu
							id="account-menu"
							anchorEl={anchorEl}
							open={open}
							onClose={() => setAnchorEl(null)}
							sx={{ mt: 1 }}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'center',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'center',
							}}>
							<Box sx={{ width: '260px', borderRadius: '8px' }}>
								<Stack px={2} py={1} direction="row" gap={1}>
									<Typography sx={{ fontWeight: 'bold' }}>
										Personal Wallet
									</Typography>
									<Chip label="CONNECTED" color="success" size="small" sx={{ fontSize: '12px' }} />
								</Stack>

								<MenuItem component={Link} to="/billing">
									<ListItemIcon>
										<AccountBalanceWalletIcon sx={{ fontSize: '16px' }} />
									</ListItemIcon>
									<ListItemText primary="Billing" />
								</MenuItem>
								<MenuItem onClick={logout}>
									<ListItemIcon>
										<LogoutIcon sx={{ fontSize: '16px' }} />
									</ListItemIcon>
									<ListItemText primary="Disconnect" />
								</MenuItem>
							</Box>
						</Menu>
					</Stack>
				</Stack>
			</Container>
		</AppBar>
	);
};

export default Navbar;
