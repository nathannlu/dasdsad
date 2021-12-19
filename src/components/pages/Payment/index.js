import React, { useState } from 'react';
import { Typography, Fade, Box, Container, TextField, FormLabel, Stack, Button } from 'ds/components';
import LockIcon from '@mui/icons-material/Lock';
import { useCollection } from 'libs/collection';
import { useToast } from 'ds/hooks/useToast';

const Payment = () => {
	const { settingsForm } = useCollection();
	const [filledIn, setFilledIn] = useState(false);
	const { addToast } = useToast();

	const onSubmit = e => {
		e.preventDefault();
		
		if(!filledIn) {
			addToast({
				severity: 'error',
				message: 'Please fill in all the fields before submitting the form'
			});
			return;
		}

		alert('Sorry! Your payment did not go through. Please message the discord staff for help')
	}
	
	return (
		<Fade in>
			<Box>
				<Container>
					<form onSubmit={onSubmit}>
						<Stack gap={2} sx={{mt: 5, p: 2, bgcolor: 'white', borderRadius: 2}}>
							<Box>
								<Typography variant="h3">
									One last step...
								</Typography>
								<Typography variant="body">
									Submit the payment form below to start generating your collection.
								</Typography>
								<Typography>
									Once you click `Pay`, your card will be charged and we will start generating your collection. You will not be able to modify it after this step.
								</Typography>
							</Box>
							<Box>
								<FormLabel>
									Name
								</FormLabel>
								<TextField placeholder="John Doe" fullWidth />
							</Box>

							<Box>
								<FormLabel>
									Email
								</FormLabel>
								<TextField placeholder="john@mail.com" fullWidth />
							</Box>

							<Stack gap={2}>
								<Box>
									<FormLabel>
										Card information
									</FormLabel>
									<TextField placeholder="1234 1234 1234 1234" fullWidth />
								</Box>
								<Stack gap={2} direction="row">
									<TextField placeholder="MM/YY" fullWidth />
									<TextField onChange={() => setFilledIn(true)} placeholder="CVC" fullWidth />
									<TextField placeholder="Zip/Postal code" fullWidth />
								</Stack>
							</Stack>

							<Button type="submit" variant="contained" startIcon={<LockIcon />} >
								PAY ${settingsForm.collectionSize.value * 0.1} USD
							</Button>

						</Stack>
					</form>
				</Container>
			</Box>
		</Fade>
	)
};

export default Payment;
