import React  from 'react';
import { useLogin } from 'gql/hooks/users.hook';
import { useLoginForm } from '../hooks/useLoginForm';
import { Fade, TextField, Link, FormLabel, Grid, Box, Stack, Typography, Button, LoadingButton } from 'ds/components';
import MetamaskButton from '../MetamaskButton';
import PhantomButton from '../PhantomButton';

const Login = props => {
	const {
		loginForm: { email, password },
		handleRedirect,
		handleLoginError,
		redirect,
	} = useLoginForm();

	const [login, { loading }] = useLogin({
		email: email.value,
		password: password.value,
		onCompleted: handleRedirect,
		onError: handleLoginError
	});


	return (
		<Fade in>
			<Box
				sx={{
					background: `radial-gradient(
                55.87% 55.87% at 35.49% -18.37%,
                #943cff 0%,
                rgba(255, 255, 255, 0) 100%
              ),
              radial-gradient(
                91.61% 92.58% at 104.86% -43.36%,
                #fd9d52 0%,
                rgba(255, 255, 255, 0) 100%
              ),
              radial-gradient(
                50.59% 55.55% at -2.99% -8.69%,
                #dd45d3 9.06%,
                rgba(255, 255, 255, 0) 100%
              )
              #f7fafc`,
					minHeight: '100vh',
				}}
			>
				<Grid
					item
					xs={5}
					sx={{ bgcolor: 'white', px: 8 }}
				>
					<Stack 
						sx={{minHeight:'100vh'}} 
						justifyContent="center"
						gap={2}
					>
						<Typography variant="h1">
							Log In
						</Typography>

						<Typography variant="body1">
							Need an account? <Link className="link" to={redirect ? `/signup?redirect=${redirect}` : "/signup"}>Create an account</Link>
						</Typography>

						<form onSubmit={e => {
							e.preventDefault();
							login();
						}}>
							<Stack gap={2}>
								<Box>
									<FormLabel>Email</FormLabel>
									<TextField fullWidth {...email} />
								</Box>

								<Box>
									<FormLabel>Password</FormLabel>
									<TextField fullWidth type="password" {...password} />
								</Box>

								<LoadingButton
									color="primary"
									loading={loading}
									fullWidth
									variant="contained"
									type="submit"
								>
									Log In
								</LoadingButton>
							</Stack>
						</form>

                        <Stack justifyContent="center" direction="row">
							<Link to="/login/forgot" className="link">Forgot password?</Link>
						</Stack>

                        <Box sx={{textAlign:'center', opacity: .8}}>
							<Typography>
								or
							</Typography>
						</Box>

						<MetamaskButton />
                        <PhantomButton />
					</Stack>
				</Grid>
			</Box>
		</Fade>
	)
};

export default Login;
