import React, { useState, useEffect } from 'react';
import { CollectionProvider } from '../../provider';
import { Link, Fade, Container, Tabs, Tab, Stack, Box, Typography, Grid, Navbar, Button } from 'ds/components';
import { CircularProgress } from '@mui/material'
import config from 'config'
import { Elements } from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
const stripePromise = loadStripe(config.stripe.publicKey);
import { useGenerator } from 'services/generator/controllers/generator';
import { useMetadata } from 'services/generator/controllers/metadata';
import PaymentModal from 'services/generator/pages/New/05_Payment/PaymentModal';

import Model from '../New/Model';


const Collection = () => {
	const [settings, setSettings] = useState('layers')
	const [ isCheckoutModalOpen, setIsCheckoutModalOpen ] = useState(false);

	const { settingsForm: { size } } = useMetadata();
	const { save, start, done, progress, zipProgress, listenToWorker, generateImages, downloaded } = useGenerator();

	useEffect(listenToWorker,[])
	
	return (
		<>
		<Fade in>
			<Stack sx={{
				display: 'flex',
				backgroundColor: 'white',
				transition: '.2s all',
			}}>
				<Grid container>
					<Grid md={6} item p={4}>
						<Stack justifyContent="space-between" direction="row">
							<Box>
								<Typography variant="h3">
									Your collection
								</Typography>
								<Typography variant="body">
									Re-generate your collection, download, or deploy to a blockchain.
								</Typography>
							</Box>

							{/*
							<Link to="/generator">
								<Button variant="contained" size="small">
									Edit
								</Button>
							</Link>
							*/}
						</Stack>

						{/*
						<Box py={2}>
							<Traits editing={false} />
						</Box>
						*/}

						<Stack alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
							<CircularProgress variant="determinate" value={Math.round((progress / size.value) * 100)} size={100} />
							<Box
								sx={{
									top: 0,
									left: 0,
									bottom: 0,
									right: 0,
									position: 'absolute',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<Typography variant="h6" component="div" color="text.secondary">
									{`${Math.round((progress / size.value) * 100)}%`}
								</Typography>
							</Box>
							{zipProgress !== null && (
								<>
									Zipping... {Math.round(zipProgress)}%
								</>
							)}
						</Stack>

						<Stack direction="row" gap={2}>
							<Button disabled={!done} onClick={() => {
								setIsCheckoutModalOpen(true);
							}} variant="outlined">
								Download collection
							</Button>
							{downloaded && (
								<Link to="/smart-contracts">
									<Button variant="contained">
										Deploy NFT
									</Button>
								</Link>
							)}

							{/*
							<Button onClick={generateImages} variant="outlined">
								Generate collection
							</Button>
							*/}
						</Stack>
					</Grid>

					<Grid
						md={6}
						alignItems="center" 
						justifyItems="center" 
						item 
						sx={{
							transition: 'all .5s',
							height: '100%',
						}}
					>
						<Model activeStep={4} isLastStep={false} />
					</Grid>
				</Grid>

				<Elements stripe={stripePromise}>
					<PaymentModal
						isModalOpen={isCheckoutModalOpen}
						setIsModalOpen={setIsCheckoutModalOpen}
					/>
				</Elements>
			</Stack>
		</Fade>
		</>
	)
};

const Main = () => (
	<CollectionProvider>
		<Collection />
	</CollectionProvider>
);


export default Main
