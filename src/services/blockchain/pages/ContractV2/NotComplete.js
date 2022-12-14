import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Box, Grid, Typography, CircularProgress, Stack } from 'ds/components';
import { Stepper, Step, StepLabel, Divider } from '@mui/material';
import { useDeployContractToTestnet } from './hooks/useDeployContractToTestnet';

import { IPFSModalContent } from '../Contract/IPFSModal';
import DeploymentStepModal from './widgets/modal/DeploymentStep.modal';

import { getWalletType } from '@ambition-blockchain/controllers';

const steps = [
  'Configure NFT details',
  'Connect NFT images & metadata',
  'Deploy onto the blockchain',
];

const NotComplete = ({ contract }) => {
	useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

	const { id } = useParams();

	const { activeDeploymentStep, deployContractToTestnet, isDeploying, isDeploymentStepModalOpen } = useDeployContractToTestnet(contract, id);

	const walletType = contract?.blockchain && getWalletType(contract?.blockchain) || null;
	const blockchain = contract?.blockchain;

	const hasMetadaUploaded = !!(contract?.nftCollection?.baseUri && contract?.nftCollection?.unRevealedBaseUri);


	const activeStep = !hasMetadaUploaded ? 1 : 2
	const isCompleted = (i) => {
		if(hasMetadaUploaded) {
			if(i == 0 || i == 1) return true
		} else {
			if (i == 0) return true;
		}
	}

	return (
		<Grid item xs={12} sx={{ py: 4 }}>
			<Box>
			  <Stepper activeStep={activeStep} alternativeLabel mb={2}>
					{steps.map((label, i) => (
						<Step completed={isCompleted(i)} key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
				<Divider sx={{marginTop: '24px'}} />
			</Box>

			<Box>
				{!hasMetadaUploaded && <Stack sx={{ py: 2, px: 2 }}>
					<Box marginTop='1em'>
						<IPFSModalContent
							id={id}
							contract={contract}
							renderUploadUnRevealedImage={true}
							setIsModalOpen={() => { return; }}
						/>
					</Box>
				</Stack> || null}

				{hasMetadaUploaded && <Stack sx={{ py: 3, px: 2 }}>
					<Typography variant="h6" sx={{ fontWeight: 'bold' }}>
						Deploy contract on <span style={{ textTransform: 'capitalize' }}>{contract?.blockchain}</span>
					</Typography>
					<Typography variant="body">
						Deploy your smart contract to the blockchain in
						order to accept public mints, configure whitelists,
						set public sale.
					</Typography>

					<Box>
						<Button
							variant="contained"
							size="small"
							onClick={deployContractToTestnet}
							disabled={isDeploying}
							sx={{ my: 2 }}
						>
							{isDeploying && <CircularProgress isButtonSpinner={true} /> || null}
							Deploy Contract
						</Button>
					</Box>
				</Stack>}
			</Box>

			<DeploymentStepModal
				blockchain={blockchain}
				activeDeploymentStep={activeDeploymentStep}
				walletType={walletType}
				isModalOpen={isDeploymentStepModalOpen}
			/>

		</Grid>
	);
};

export default NotComplete;
