import React, { useEffect } from 'react';
import { Fade, Box, Stack, Grid, Typography, Button, IconButton } from 'ds/components';
import { useWeb3 } from 'libs/web3';

const Login = (props) => {
	const { loginToWallet } = useWeb3();

	return (
		<Button
			startIcon={<img style={{width:'20px'}} src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png" />} 
			fullWidth 
			onClick={() => loginToWallet('metamask')} 
			variant="contained" 
            style={{
                backgroundColor: 'rgb(25,26,36)',
                color: 'white',
                textTransform: 'none'
            }}
		>
			Continue with Metamask
		</Button>
	)
};

export default Login;
