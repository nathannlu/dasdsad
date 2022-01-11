import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Menu, MenuItem } from 'ds/components';
import { useAuth } from 'libs/auth';

const Navbar = ({ pageName }) => {
	const { logout } = useAuth();
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	return (
		<Box
			className="w-full z-10 fixed text-white py-5 shadow-lg"
			sx={{bgcolor: 'rgba(0, 0, 0, 0.9)'}}
		>
			<div className="container mx-auto flex flex-wrap">
				<Box>
					<a href="/dashboard">Web3</a>
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
			</div>
		</Box>
	)
};

export default Navbar;
