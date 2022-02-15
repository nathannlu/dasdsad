import React from 'react';
import { useToast } from 'ds/hooks/useToast';
import { useRegister } from 'gql/hooks/users.hook';
import { useSignupForm } from '../hooks/useSignupForm';
import { Fade, TextField, Link, FormLabel, Grid, Stack, Box, LoadingButton, Typography } from 'ds/components';
import MetamaskButton from '../MetamaskButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Signup = props => {
	const { addToast } = useToast();
	const {
		signupForm: { email, name, password },
		onCompleted,
		handleSignupError,
		redirect
	} = useSignupForm();

	const [register, { loading }] = useRegister({
		email: email.value,
		name: name.value,
		password: password.value,
		onCompleted,
		onError: handleSignupError
	});

	return (
		<Fade in>
			<Grid 
				container
				alignItems="center"
				sx={{
					background: `radial-gradient(
                92.81% 48.44% at -24.53% -16.02%,
                #943cff 0%,
                rgba(255, 255, 255, 0) 100%
              ),
              radial-gradient(
                75.78% 68.16% at 56.74% -24.02%,
                #fd9d52 0%,
                rgba(255, 255, 255, 0) 100%
              ),
              radial-gradient(
                160.86% 46.39% at 177.14% -15.62%,
                #dd45d3 9.06%,
                rgba(255, 255, 255, 0) 100%
              ),
              #f7fafc`,
					minHeight: '100vh',
				}}
			>
				<Grid xs={4} sx={{pl: 10, mx: 'auto'}}>
					<Stack gap={4}>
						<img
							style={{width: '124px'}}
							src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d268bc8d677c289b54e405_ambition-logo-dark.png" 
						/>
						<Typography>
							The creator platform for NFTs. Launch the next big collection with Ambition.	
						</Typography>
						<Stack gap={1} direction="row">
							<CheckCircleIcon />
							<Stack>
								<Typography variant="body" sx={{fontWeight: 'bold'}}>
									Generate your collection
								</Typography>
								<Typography variant="body" sx={{opacity: .8}}>
									Turn layers of traits into a production-ready 10,000 NFT collection.
								</Typography>
							</Stack>
						</Stack>
						<Stack gap={1} direction="row">
							<CheckCircleIcon />
							<Stack>
								<Typography variant="body" sx={{fontWeight: 'bold'}}>
									Deploy to the blockchain
								</Typography>
								<Typography variant="body" sx={{opacity: .8}}>
									Upload your generated collection onto a blockchain of your choice
								</Typography>
							</Stack>
						</Stack>
						<Stack gap={1} direction="row">
							<CheckCircleIcon />
							<Stack>
								<Typography variant="body" sx={{fontWeight: 'bold'}}>
									Build a minting website
								</Typography>
								<Typography variant="body" sx={{opacity: .8}}>
									Release a website for users to mint NFTs from your collection.
								</Typography>
							</Stack>
						</Stack>


						<Stack sx={{background: '#ededed', borderRadius: '10px'}} >
							<Typography>
								"#NFT smart contract & minting website made with the help of @ambition_so. It was so easy and fast!"
							</Typography>

							<Stack direction="row">
								<img 
									style={{borderRadius: '9999px', width: '25px'}}
									src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/6209aa313592bf81872363f9_yo_frens_avatar.jpeg" 
								/>
								<Typography>
									<b>MMMG</b>, Founder of @yo_frens
								</Typography>
	
							</Stack>
						</Stack>
					</Stack>
				</Grid>
				<Grid xs={6} sx={{bgcolor: 'white', px: 12}}>
					<Stack 
						sx={{minHeight:'100vh'}} 
						justifyContent="center"
						gap={2}
					>
						<Typography variant="h4">
							Create your account
						</Typography>
						{/*
						<Typography variant="body">
							Launch your NFT collection in minutes without a developer.
						</Typography>

						<MetamaskButton />

						<Box sx={{textAlign:'center', opacity: .8}}>
							<Typography>
								or
							</Typography>
						</Box>
						*/}

						<form onSubmit={e => {
							e.preventDefault();
							if (email.value.length < 1 || password.value.length < 1) {
								addToast({
									severity: 'error',
									message: 'Please fill in all the fields',
								});
							} else {
								register();
							}
						}}>
							<Stack gap={2}>
								<Box>
									<FormLabel>Email</FormLabel>
									<TextField fullWidth {...email} />
								</Box>

								<Box>
									<FormLabel>Name</FormLabel>
									<TextField fullWidth {...name} />
								</Box>

								<Box>
									<FormLabel>Password</FormLabel>
									<TextField type="password" fullWidth {...password} />
								</Box>

								<LoadingButton color="primary" loading={loading} fullWidth variant="contained" type="submit">
									Sign Up
								</LoadingButton>
							</Stack>
						</form>

						<Stack direction="row" justifyContent="center">
							<Typography variant="body1">
								Already have an account? <Link className="link" to={redirect ? `/login?redirect=${redirect}` : "/login"}>Log in</Link>
							</Typography>
						</Stack>
					</Stack>
				</Grid>

			</Grid>
		</Fade>
	)
};

export default Signup;
