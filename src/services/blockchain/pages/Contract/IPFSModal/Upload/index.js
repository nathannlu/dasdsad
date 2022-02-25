import React, { useState } from 'react';
import { Modal, Box, Button, Stack } from 'ds/components';
import { Stepper, Step, StepLabel, StepContent } from '@mui/material';
import { useContract } from 'services/blockchain/provider';
import { useSetBaseUri } from 'services/blockchain/gql/hooks/contract.hook';
import { useToast } from 'ds/hooks/useToast';

import Traits from './Traits';
import Metadata from './Metadata';

const Steps = ({id, setIsModalOpen}) => {
	const [activeStep, setActiveStep] = useState(0); 
	
	return (
		<>
			<Stepper activeStep={activeStep}>
				<Step>
					<StepLabel>
						Upload images to IPFS
					</StepLabel>
				</Step>
				<Step>
					<StepLabel>
						Upload metadata to IPFS
					</StepLabel>
				</Step>
				<Step>
					<StepLabel>
						Confirmation
					</StepLabel>
				</Step>
			</Stepper>
			{{
				0: <Traits setActiveStep={setActiveStep} />,
				1: <Metadata setActiveStep={setActiveStep} />,
				2: <Confirmation id={id} setIsModalOpen={setIsModalOpen} />
			}[activeStep]}
		</>
	)
};

const Confirmation = props => {
	const { imagesUrl, metadataUrl, ipfsUrl } = useContract();
	const { addToast } = useToast();

  const [setBaseUri] = useSetBaseUri({
		onCompleted: () => {
			addToast({
				severity: 'success',
				message: 'Successfully added contract base URI'
			})
			props.setIsModalOpen(false)
		}
	})

	return (
		<Stack gap={2}>
			<Box>
				Your first NFT is stored at <a style={{color: 'blue'}} href={`https://gateway.pinata.cloud/ipfs/${imagesUrl}/1.png`} target="_blank">ipfs://{imagesUrl}/</a>. Please verify the content is correct.
			</Box>

			<Box>
				Metadata for your first NFT is stored at <a style={{color: 'blue'}} href={`https://gateway.pinata.cloud/ipfs/${metadataUrl}/1.json`} target="_blank">{ipfsUrl}</a>. Please verify the content is correct.
			</Box>

			<Button variant="contained" onClick={() => setBaseUri({variables: {baseUri: ipfsUrl, id: props.id}})}>
				Confirm
			</Button>
		</Stack>
	)
};


export default Steps;
