import React, { useState, useEffect } from 'react';
import { Link, Fade, Container, Tabs, Tab, Stack, Box, Typography, Grid, Navbar, Button } from 'ds/components';

import Model from 'components/pages/Generator/Model';
import Metadata from 'components/pages/Generator/01_Settings';
import Layers from 'components/pages/Generator/02_Layers/Layers';
import Traits from 'components/pages/Generator/03_Traits/Traits';
import Rarity from 'components/pages/Generator/04_Rarity';

import config from 'config'
import { Elements } from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
const stripePromise = loadStripe(config.stripe.publicKey);

import { useGenerator } from 'core/generator';

import PaymentModal from 'components/pages/Generator/05_Payment/PaymentModal';


const Collection = () => {
	const [settings, setSettings] = useState('layers')
	const [ isCheckoutModalOpen, setIsCheckoutModalOpen ] = useState(false);

	const { save, start, done, progress, zipProgress, listenToWorker, generateImages } = useGenerator();

	useEffect(listenToWorker,[])
	
	return (
		<>
		<Navbar />
		<Fade in>
			<Stack sx={{
				display: 'flex',
				backgroundColor: 'white',
				transition: '.2s all',
				marginTop: '65px',
				minHeight: '100vh',
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
							<Link to="/generator">
								<Button variant="contained" size="small">
									Edit
								</Button>
							</Link>

						</Stack>

						<Box py={2}>
							<Traits editing={false} />
						</Box>

						<Stack direction="row" gap={2}>
							{done || start ? (
								<Link to="/upload">
									<Button variant="contained">
										Deploy NFT
									</Button>
								</Link>
							):null}
							{done || start ? (
								<Button disabled={!done} onClick={() => {
									setIsCheckoutModalOpen(true);
								}} variant="outlined">
									Download collection
								</Button>
							) : (
								<Button onClick={generateImages} variant="outlined">
									Generate collection
								</Button>
							)}
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

export default Collection
