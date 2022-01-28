import React, { useEffect, useState } from 'react';
import { useWeb3 } from 'libs/web3';
import { Button, Stack, Card, Typography, FormLabel, TextField, Box, Grid, Fade, MenuItem, LoadingButton } from 'ds/components';
import { useDeploy } from 'libs/deploy';
import CheckoutModal from 'components/pages/Payments/CheckoutModal';
import { useToast } from 'ds/hooks/useToast';
import { Elements } from '@stripe/react-stripe-js';
import config from 'config';
import {loadStripe} from '@stripe/stripe-js';
const stripePromise = loadStripe(config.stripe.publicKey);

const Deploy = (props) => {
	const { account, loadWeb3, loadBlockchainData } = useWeb3();
	const {
		deployContract,
		start,
		setStart,
		activeStep,
        pinImages,
		validateNetwork
	} = useDeploy();
	const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToast } = useToast()

	useEffect(() => {
		(async () => {
			await loadWeb3()
			await loadBlockchainData()
		})()
	}, [])


	const callback = async () => {
		try {
            const res = await validateNetwork();
            if (!res) throw new Error("Failed to validate network");
            props.nextStep();
            await pinImages();
        }
        catch (err) {
            addToast({
                severity: 'error',
                message: err.message
            });
        }
	}

	return (
		<Box>
			<Stack gap={3}>
				<Stack>
					<Typography gutterBottom variant="h4">
						04. Review and deploy
					</Typography>
					<Typography gutterBottom variant="body">
						Smart contract will be deployed under the current Metamask address:
					</Typography>
					<Typography gutterBottom variant="body">
						{account}
					</Typography>
				</Stack>

				<Stack>
					<FormLabel sx={{fontWeight:'bold'}}>
						Deploy contract
					</FormLabel>
					<Typography gutterBottom variant="body2">
						Once you're ready, deploy the contract. Ethereum charges a small gas fee for deploying to the blockchain. Double check to confirm all your information is correct, smart contracts are immutable after deployment.
					</Typography>
					<LoadingButton
						onClick={callback}
						//onClick={() => setIsModalOpen(true)}
						variant="contained"
						fullWidth
					>
						Deploy
					</LoadingButton>
				</Stack>

				<Stack justifyContent="space-between" direction="row">
					<Button onClick={() => props.previousStep()}>
						Prev
					</Button>
				</Stack>
			</Stack>

			<Elements stripe={stripePromise}>
				<CheckoutModal 
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
					planId={config.stripe.products.contract}
					callback={callback}
				/>
			</Elements>
		</Box>
	)
};

export default Deploy;
