import React, { useEffect } from 'react';
import { Fade, Box, Stack, Grid, Typography, Button, IconButton } from 'ds/components';
import { useWeb3 } from 'libs/web3';
import { useGetNonceByAddress, useVerifySignature } from 'gql/hooks/users.hook';
import { useLayerManager } from 'core/manager';
import { useMetadata } from 'core/metadata';
import { useAuth } from 'libs/auth';
import { useCreateCollection } from 'gql/hooks/collection.hook';
import posthog from 'posthog-js';

import { Close as CloseIcon, Email as EmailIcon } from '@mui/icons-material';


const Login = (props) => {
	const { account, loadWeb3, signNonce, loadBlockchainData } = useWeb3()
	const { query: {layers} } = useLayerManager();
	const { user } = useAuth();
	const { settingsForm } = useMetadata();
	const [createCollection] = useCreateCollection({
		onCompleted: data => {
			console.log(data);
		}
	});

	const [getNonceByAddress] = useGetNonceByAddress({
		address: account
	})
	const [verifySignature] = useVerifySignature({
		onCompleted: async data => {
			posthog.capture(
				'User logged in with metamask', {
					$set: {
						publicAddress: account
					}
			});

			// On successful log in, save layers to person
			let _layers = [...layers]
			_layers.forEach(layer => {
				layer.images.map(trait => {
					trait.url = trait.base64	
					delete trait.base64
					delete trait.rarity
					delete trait.preview
					delete trait.type
					delete trait.url
				})
			});


			let obj = {
				layers: _layers,
				name: settingsForm.name.value,
				description: settingsForm.description.value,
				collectionSize: settingsForm.collectionSize.value
			};

			await createCollection({variables: {collection: obj}})

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
		<Fade in={typeof props.in !== 'undefined' ? props.in : true}>
			<Stack sx={{position: 'fixed', height: '100vh', width: '100vw', background: 'white', top: 0, left: 0}}>
				<Stack p={2} justifyContent="space-between" direction="row" zIndex={10}>
					<Box>
						<img style={{width: '125px'}} src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d34ab7c783ea4e08774112_combination-primary-logo.png" />
					</Box>
					<Box>
						<IconButton onClick={() => props.setDisplayAuth(false)}>
							<CloseIcon sx={{fontSize: '35px'}} />
						</IconButton>
					</Box>
				</Stack>
				<Grid container alignItems="center" justifyContent="center" sx={{position: 'fixed', height: '100%', width: '100%'}}>
					<Grid item xs={4}>
						<Stack gap={2}>
							<Box>
								<Typography gutterBottom variant="h3">
									Log Into My Account
								</Typography>
							</Box>

							<Button
								startIcon={<img style={{width:'20px'}} src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png" />} 
								fullWidth 
								onClick={onClick} 
								variant="outlined"
								color="black"
							>
								Continue with metamask
							</Button>
							<Button 
								startIcon={<EmailIcon />}
								fullWidth 
								variant="outlined"
								color="black"
							>
								Continue with Email	
							</Button>

						</Stack>
					</Grid>
				</Grid>
			</Stack>
		</Fade>
	)
};

export default Login;
