import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Stack, Menu, MenuItem } from 'ds/components';
import { useAuth } from 'libs/auth';
import { AppBar, Toolbar } from '@mui/material';

const Navbar = ({ pageName }) => {
	const { logout } = useAuth();
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	return (
		<AppBar position="fixed" sx={{background: 'black', py: 2}}>
			<Container>
				<Stack direction="row" justifyContent="space-between" alignItems="center">
					<Box>
						<img style={{width: '125px'}} src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d34ab7c783ea4e08774112_combination-primary-logo.png" />
					</Box>
					<Box className="ml-auto">
						<div 
							id="account-button"
							aria-controls="account-menu"
							aria-haspopup="true"
							aria-expanded={open ? 'true' : undefined}
							onClick={e => setAnchorEl(e.currentTarget)}
							className="ml-auto"
						>
							Account
						</div>
						<Menu
							id="account-menu"
							anchorEl={anchorEl}
							open={open}
							onClose={()=>setAnchorEl(null)}
						>
							{/*
							<MenuItem component={Link} to="/billing">Billing</MenuItem>
							*/}
							<MenuItem onClick={logout}>Logout</MenuItem>
						</Menu>
					</Box>
				</Stack>
			</Container>
		</AppBar>
	)
};

export default Navbar;
