import React, { useState } from 'react';
import { Modal, Box, Button, IconButton, Stack } from 'ds/components';
import { Stepper, Step, StepLabel, StepContent } from '@mui/material';
import StepWizard from 'react-step-wizard';
import CloseIcon from '@mui/icons-material/Close';


import Preview from './Preview';
import ImportLink from './ImportLink';
import Payment from './Payment';
import Upload from './Upload';

const IPFSModal = ({ isModalOpen, setIsModalOpen, id }) => {

	return (
		<Modal
			open={isModalOpen}
			//onClose={()=>setIsModalOpen(false)}
			sx={{overflow: 'auto', alignItems: 'center', display: 'flex', zIndex: 5000}}
		>
			<Box p={3} pt={1} sx={{
				width: '1200px',
				margin: '0 auto',
				background: '#fff'
			}}>
				<Stack>
					<IconButton sx={{ml:'auto'}}>
						<CloseIcon onClick={() => setIsModalOpen(false)} />
					</IconButton>
				</Stack>

				<StepWizard transitions={{}}>
					<Preview />
					{/* user imports their own link */}
					<ImportLink id={id} setIsModalOpen={setIsModalOpen}  />

					{/* uploads to ipfs with us */}
					<Payment />
					<Upload id={id} setIsModalOpen={setIsModalOpen} />

				</StepWizard>
			</Box>
		</Modal>
	)
};




export default IPFSModal;
