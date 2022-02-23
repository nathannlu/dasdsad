import React, { useState, useEffect } from 'react';
import { Fade, Box, Stack, Button, Typography } from 'ds/components';
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
						<Button fullWidth variant="contained" sx={{backgroundColor: rgb(220, 220, 220)}} onClick={() => {
							props.nextStep()
							posthog.capture('User clicked on "Generate collection" button');
						}}>
							Login to Generate
						</Button>
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


