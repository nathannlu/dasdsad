import React, { useState, useEffect } from 'react';
import { CollectionProvider } from '../../provider';
import { Link, Fade, Container, Tabs, Tab, Stack, Box, Typography, Grid, Navbar, Button } from 'ds/components';
import { Radio, RadioGroup, FormControl, FormControlLabel } from '@mui/material'
import config from 'config'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useGenerator } from 'services/generator/controllers/generator';
import { useMetadata } from 'services/generator/controllers/metadata';
import PaymentModal from 'services/generator/pages/New/05_Payment/PaymentModal';
import { useLayerManager } from 'services/generator/controllers/manager';
import Model from '../New/Model';
import RenderModal from './RenderModal'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const stripePromise = loadStripe(config.stripe.publicKey);

const Collection = () => {
	const [ isCheckoutModalOpen, setIsCheckoutModalOpen ] = useState(false);
	const { settingsForm: { size, name, description } } = useMetadata();
	const { query: { layers }} = useLayerManager();
	const { generateImages, metadataType, setMetadataType } = useGenerator();

	useEffect(() => {
        console.log(layers);
		console.log(size);
    })

	return (
		<>
		<Fade in>
			<Stack sx={{
				display: 'flex',
				backgroundColor: 'rgb(238, 238, 238)',
				transition: '.2s all',
			}}>
				<Grid container>
					<RenderModal />
					<Grid md={6} item p={4}>
						<Stack
							spacing={2}
							height='100%'
						>
							<Stack spacing={1}>
								<Typography variant="h3">
									Your collection
								</Typography>
								<Typography variant="body">
									Generate your collection, download, or deploy to a blockchain.
								</Typography>
							</Stack>
							<Stack spacing={2}>
								<Stack 
									borderRadius='10px'
									backgroundColor='white'
									padding='1em'
									sx={{
										boxShadow: '0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -2px rgb(0 0 0 / 5%);'
									}}
								>
									<Typography variant="h4">
										Generation Summary
									</Typography>
									<Typography variant="body">
										A general summary of your NFT collection.
									</Typography>
									<Stack direction='row' spacing={2} alignItems='center'>
										<InfoOutlinedIcon fontSize='10pt' style={{ borderColor: 'rgb(120, 120, 120)' }}/>
										<Typography fontSize='14pt'>
											Name: 
										</Typography>
										<Typography mt='.5em' fontSize='12pt'>
											{name}
										</Typography>
									</Stack>
									<Stack direction='row' spacing={2} alignItems='center'>
										<InfoOutlinedIcon fontSize='10pt' style={{ borderColor: 'rgb(120, 120, 120)' }}/>
										<Typography fontSize='14pt'>
											Description: 
										</Typography>
										<Typography mt='.5em' fontSize='12pt'>
											{description}
										</Typography>
									</Stack>
									<Stack direction='row' spacing={2} alignItems='center' mt='1em'>
										<InfoOutlinedIcon fontSize='10pt' style={{ borderColor: 'rgb(120, 120, 120)' }}/>
										<Typography fontSize='14pt'>
											Layers: 
										</Typography>
										{layers?.map((layer, idx) => (
											<Typography key={idx} mt='.5em' fontSize='12pt'>
												{layer.name}
											</Typography>
										))}
									</Stack>
									<Stack direction='row' spacing={2} alignItems='center'>
										<InfoOutlinedIcon fontSize='10pt' style={{ borderColor: 'rgb(120, 120, 120)' }}/>
										<Typography fontSize='14pt'>
											Metadata Type: 
										</Typography>
										<FormControl>
											<RadioGroup row value={metadataType} onChange={(e) => setMetadataType(e.target.value)}>
												<FormControlLabel value="eth" control={<Radio />} label="ETH" />
												<FormControlLabel value="sol" control={<Radio />} label="SOL" />
											</RadioGroup>
										</FormControl>
									</Stack>
									<Stack direction='row' spacing={2} alignItems='center'>
										<InfoOutlinedIcon fontSize='10pt' style={{ borderColor: 'rgb(120, 120, 120)' }}/>
										<Typography fontSize='14pt'>
											Collection Count: 
										</Typography>
										<Typography mt='.5em' fontSize='12pt'>
											{size?.value}
										</Typography>
									</Stack>
									<Stack direction='row' spacing={2} alignItems='center'>
										<InfoOutlinedIcon fontSize='10pt' style={{ borderColor: 'rgb(120, 120, 120)' }}/>
										<Typography fontSize='14pt'>
											Dimensions: 
										</Typography>
										<Typography mt='.5em' fontSize='12pt'>
											
										</Typography>
									</Stack>
								</Stack>
								<Button 
									variant="contained"
									onClick={generateImages}
									style={{
										backgroundColor: 'rgb(25,26,36)',
									}}
									mt='2em'
								>
									Generate Collection
								</Button>
							</Stack>
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
