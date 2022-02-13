import React from 'react';
import { useToast } from 'ds/hooks/useToast';
import { useRegister } from 'gql/hooks/users.hook';
import { useSignupForm } from '../hooks/useSignupForm';
import { Fade, TextField, Link, FormLabel, Grid, Stack, Box, LoadingButton, Typography } from 'ds/components';

const Signup = props => {
	const { addToast } = useToast();
	const {
		signupForm: { email, name, password },
		onCompleted,
		handleSignupError
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
			<Box
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
				<Grid xs={7} sx={{bgcolor: 'white', px: 18}}>
					<Stack 
						sx={{minHeight:'100vh'}} 
						justifyContent="center"
						gap={2}
					>
						<Typography variant="h1">
							Welcome to Ambition 
						</Typography>

						<Typography variant="body1">
							Make your mark in web3. We have the easiest-to-use tools to help you launch NFT collections, interact with blockchains, and set up websites for your collection.
						</Typography>

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
								Already have an account? <Link className="link" to="/login">Log in</Link>
							</Typography>
						</Stack>
					</Stack>
				</Grid>
			</Box>
		</Fade>
	)
};

export default Signup;
