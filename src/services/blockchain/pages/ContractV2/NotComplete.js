import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Button, Box, Grid, Typography, CircularProgress, Stack } from 'ds/components';

import { useDeployContractToTestnet } from './hooks/useDeployContractToTestnet';

import { IPFSModalContent } from '../Contract/IPFSModal';
import DeploymentStepModal from './widgets/modal/DeploymentStep.modal';

import { getWalletType } from '@ambition-blockchain/controllers';

const NotComplete = ({ contract }) => {
	useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

	const { id } = useParams();

	const { activeDeploymentStep, deployContractToTestnet, isDeploying, isDeploymentStepModalOpen } = useDeployContractToTestnet(contract, id);

	const walletType = contract?.blockchain && getWalletType(contract?.blockchain) || null;
	const blockchain = contract?.blockchain;

	const hasMetadaUploaded = !!(contract?.nftCollection?.baseUri && contract?.nftCollection?.unRevealedBaseUri);

	return (
		<Grid item xs={12} sx={{ py: 4 }}>

			<Box>
				{!hasMetadaUploaded && <Stack sx={{ py: 2, px: 2 }}>
					<Typography variant="body">
						Link your metadata and images to the smart contract.
					</Typography>
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
						Deploy contract on <span sx={{ textTransform: 'capitalize' }}>{contract?.blockchain}</span>
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