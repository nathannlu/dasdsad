import React from 'react';
import { useResetPasswordForm } from '../hooks/useResetPasswordForm';
import { useAuthorizeResetPassword } from '../hooks/useAuthorizeResetPassword';
import { useResetPassword } from 'gql/hooks/auth.hook';
import { Fade, TextField, FormLabel, Grid, Stack, Box, CircularProgress, Typography, LoadingButton } from 'ds/components';

const Reset = props => {
	const {
		isTokenVerified,
		token,
		loading
	} = useAuthorizeResetPassword(props);
	const {
		resetPasswordForm: { newPassword, confirmPassword},
		onCompleted,
		onError
	} = useResetPasswordForm();
	const [resetPassword, { loading: loadingResetPassword }] = useResetPassword({
		token: token,
		password: newPassword.value,
		onCompleted,
		onError
	});

	return (
		<Fade in>

			<Box
				sx={{
					backgroundImage: 'url(https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/6208747ded33564312b6ef56_background.png)', 
					backgroundSize: 'cover', 
					backgroundPosition: 'right',
					backgroundRepeat: 'no-repeat',
					minHeight: '100vh',
				}}
			>
				<Grid xs={7} sx={{bgcolor: 'white', px: 18}}>
					<Stack 
						sx={{minHeight:'100vh'}} 
						justifyContent="center"
						gap={2}
					>
						{ loading ? ( <CircularProgress /> ) : isTokenVerified ? (
							<>
								<Typography variant="h1">
									Reset Your Password
								</Typography>
								<Typography variant="body">
									Almost done. Enter your new password, and you're good to go.
								</Typography>

								<form onSubmit={e => {
									e.preventDefault();
									resetPassword();
								}}>
									<Stack gap={2}>
										<Box>
											<FormLabel>New password</FormLabel>
											<TextField fullWidth {...newPassword} />
										</Box>

										<Box>
											<FormLabel>Confirm password</FormLabel>
											<TextField fullWidth {...confirmPassword} />
										</Box>

										<LoadingButton color="primary" loading={loadingResetPassword} fullWidth variant="contained" type="submit">
											Reset Password
										</LoadingButton>
									</Stack>
								</form>
							</>
						):(<>Invalid token</>)}
					</Stack>
				</Grid>
			</Box>
		</Fade>
	)
};

export default Reset;
