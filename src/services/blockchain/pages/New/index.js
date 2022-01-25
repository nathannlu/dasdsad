import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, IconButton, Divider, Fade, Grid, Stack, Container, Typography } from 'ds/components';
import { AppBar, Toolbar } from '@mui/material';
import StepWizard from 'react-step-wizard';
import CloseIcon from '@mui/icons-material/Close';

import Settings from './01_Settings';
import Traits from './02_Traits';
import Metadata from './03_Metadata';
import Deploy from './04_Deploy';
import Preview from './00_Preview';
import Uploading from './05_Uploading';

import Model from './Model';

const Upload = () => {
	const [activeStep, setActiveStep] = useState();
	const history = useHistory();

	return (
		<Fade in>
			<Grid 
				container
				sx={{
					minHeight: '100vh',
					overflow: 'hidden',
					bgcolor: '#191A24',
					position: 'absolute',
					zIndex: 2000,
					top: 0,
					paddingTop: '67px'
				}}
			>
				<AppBar position="fixed" sx={{bgcolor: 'grey.100', py: 2, boxShadow: 'none', borderBottom: '1px solid rgba(0,0,0,.2)', color: '#000'}}>
					<Stack direction="row" px={2} gap={2} alignItems="center">
						<IconButton onClick={() => history.goBack()}>
							<CloseIcon sx={{fontSize: '18px'}} />
						</IconButton>
						<Divider sx={{height: '20px', borderWidth: .5}} orientation="vertical" />
						<Box>
							<Typography variant="body">
								Create a contract
							</Typography>
						</Box>
					</Stack>
				</AppBar>

				<Grid md={6} item sx={{transition: 'all .5s'}}>
					<Stack
						p={4}
						gap={2}
						sx={{
							backgroundColor: 'white',
							height: '100%',
						}}
					>
						<StepWizard transitions={{}} onStepChange={s => setActiveStep(s.activeStep)}>
							<Preview />
							<Settings />
							<Traits />
							<Metadata />
							<Deploy />
							<Uploading />
						</StepWizard>
					</Stack>
				</Grid>

				<Grid 
					md={6} 
					alignItems="center" 
					justifyContent="center" 
					item 
					sx={{
						display: 'flex',
						transition: 'all .5s',
						height: '100%',
						minHeight: '100vh'
					}}
				>
					<Model activeStep={activeStep} />
				</Grid>
			</Grid>
		</Fade>

	)
};

export default Upload;
