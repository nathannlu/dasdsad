import React, { useState, useEffect } from 'react';
import { useForgotPasswordForm } from '../hooks/useForgotPasswordForm';
import { useForgotPassword } from 'gql/hooks/auth.hook';
import { Fade, TextField, Link, FormLabel, Grid, Stack, Box, LoadingButton, Typography } from 'ds/components';

const ForgotPassword = props => {
	const {
		forgotPasswordForm: { email },
		onCompleted,
		onError
	} = useForgotPasswordForm();

	const [sendPasswordResetEmail, { loading }] = useForgotPassword({
		onCompleted,
		onError
	})

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
						<Typography variant="h1">
							Reset Your Password
						</Typography>

						<Typography variant="body1">
							Fear not. We’ll email you instructions to reset your password. If you don’t have access to your email anymore, please contact support.
						</Typography>

						<form onSubmit={e => {
								e.preventDefault();
								sendPasswordResetEmail({
									variables: { email: email.value }
								});
							}}
						>
							<Stack gap={2}>
								<Box>
									<FormLabel>Email</FormLabel>
									<TextField fullWidth {...email} />
								</Box>

								<Stack direction="row" alignItems="center">
									<LoadingButton color="primary" loading={loading} variant="contained" type="submit">
										Reset Password
									</LoadingButton>
									<Link to="/login" className="link ml-8">Return to login</Link>
								</Stack>
							</Stack>
						</form>

					</Stack>
				</Grid>
			</Box>
		</Fade>
	)
};

export default ForgotPassword;

