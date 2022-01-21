import React, { useEffect } from 'react';
import { Fade, Box, Stack, Grid, Typography, Button, IconButton } from 'ds/components';
import { useWeb3 } from 'libs/web3';
import { useGetNonceByAddress, useVerifySignature } from 'gql/hooks/users.hook';
import { useLoginForm } from '../hooks/useLoginForm';
import posthog from 'posthog-js';

import { Close as CloseIcon, Email as EmailIcon } from '@mui/icons-material';

const Login = (props) => {
	const { account, loadWeb3, signNonce, loadBlockchainData } = useWeb3()
	const { handleLoginSuccess } = useLoginForm();

	const [getNonceByAddress] = useGetNonceByAddress({
		address: account
	})
	const [verifySignature] = useVerifySignature({
		onCompleted: async data => {
			posthog.capture( 'User logged in with metamask', {$set: {
				publicAddress: account
			}});

			await handleLoginSuccess();
		}
	});


	const onClick = async () => {
		await loadWeb3();
		await loadBlockchainData();

		// Check if address has nonce
		const res = await getNonceByAddress()
		const nonce = res.data.getNonceByAddress

		// Create a signature from address
		const { address, signature } = await signNonce({ address: account, nonce });
		await verifySignature({variables: {address, signature}})
	}


	useEffect(() => {
		(async() => {
			await loadWeb3();
			await loadBlockchainData();
		})()
	}, [])

	return (
		<Button
			startIcon={<img style={{width:'20px'}} src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png" />} 
			fullWidth 
			onClick={onClick} 
			sx={{color: 'white'}} 
			variant="contained" 
			color="black"
		>
			Continue with metamask
		</Button>
	)
};

export default Login;
