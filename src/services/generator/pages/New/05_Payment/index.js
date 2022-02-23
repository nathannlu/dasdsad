import React, { useState, useEffect } from 'react';
import { Link, Fade, Box, Stack, Button, Typography } from 'ds/components';
import { Chip } from '@mui/material'
import posthog from 'posthog-js';
import useMediaQuery from '@mui/material/useMediaQuery';

const Payment = props => {
	const [fadeIn, setFadeIn] = useState(false);
	const smallerThanTablet = useMediaQuery(theme => theme.breakpoints.down('md'));

	useEffect(() => {
		if(!smallerThanTablet) {
			if(props.isActive) {
				setTimeout(() => setFadeIn(true), 1700)
			} else {
				setFadeIn(false)
			}
		} else {
			setFadeIn(true)
		}
	}, [props.isActive])
	
	return (
		<Fade in={fadeIn}>
			<Stack justifyContent="space-between" sx={{minHeight: '90vh', paddingTop: '120px'}}>
				<Stack gap={2}>
					<Box>
						<Chip sx={{opacity: .8, mb: 1}} label={"Step 4/4"} />
						<Typography variant="h2">
							Last step
						</Typography>
						<Typography variant="body">
							Ready to launch the next BAYC?
						</Typography>
					</Box>

					<Stack direction="row">
						<Link to="/login?redirect=generator/download">
							<Button fullWidth variant="contained" style={{backgroundColor: 'rgb(25,26,36)', color: 'white'}} onClick={() => {
								posthog.capture('User clicked on "Login to Generate Collection" button');
							}}>
								Login to Generate Collection
							</Button>
						</Link>
					</Stack>
				</Stack>

				<Stack justifyContent="space-between" direction="row">
					<Button onClick={() => props.previousStep()}>
						Prev
					</Button>
				</Stack>
			</Stack>
		</Fade>
	)
};

export default Payment;


