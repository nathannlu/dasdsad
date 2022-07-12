import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Button, Box, Grid, Typography, CircularProgress, Stack } from 'ds/components';

import { Stepper, Step, StepLabel, StepContent } from '@mui/material';

import ContractDetailsHeader from './widgets/ContractDetailsHeader';
import { useDeployContractToTestnet } from './hooks/useDeployContractToTestnet';

import { IPFSModalContent } from '../Contract/IPFSModal';
import DeploymentStepModal from './widgets/modal/DeploymentStep.modal';

import { getWalletType, getMainnetBlockchainType } from '@ambition-blockchain/controllers';

const NotComplete = ({ contract }) => {
	useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

	const { id } = useParams();

	const { activeDeploymentStep, deployContractToTestnet, isDeploying, isDeploymentStepModalOpen } = useDeployContractToTestnet(contract, id);

	const walletType = contract?.blockchain && getWalletType(contract?.blockchain) || null;
	const blockchain = contract?.blockchain && getMainnetBlockchainType(contract?.blockchain) || null;

	const hasMetadaUploaded = !!(contract?.nftCollection?.baseUri && contract?.nftCollection?.unRevealedBaseUri);

	return (
		<Grid item xs={12} sx={{ py: 4 }}>
			<Stack>
				<Typography color="primary" component="h1" sx={{ fontWeight: 600, fontSize: 45 }}>
					Deploy your NFT contract
				</Typography>
			</Stack>

			<ContractDetailsHeader contract={contract} />

			<Box mt={4}>
				<Typography sx={{ fontWeight: '500' }} variant="h5">
					Next steps
				</Typography>

				<Stepper activeStep={hasMetadaUploaded ? 1 : 0} orientation="vertical">
					<Step>
						<StepLabel>
							<Typography variant="h6" sx={{ fontWeight: 'bold' }}>
								Set NFT assets location
							</Typography>
						</StepLabel>
						<StepContent>
							<Stack sx={{ py: 3, px: 2 }}>
								<Typography variant="body">
									Link your metadata and images to the smart contract.
								</Typography>
								<Box>
									<IPFSModalContent
										id={id}
										contract={contract}
										renderUploadUnRevealedImage={true}
										setIsModalOpen={() => { return; }}
									/>
								</Box>
							</Stack>
						</StepContent>
					</Step>

					<Step>
						<StepLabel>
							<Typography variant="h6" sx={{ fontWeight: 'bold' }}>
								Deploy contract on <span sx={{ textTransform: 'capitalize' }}>{contract?.blockchain}</span>
							</Typography>
						</StepLabel>
						<StepContent>
							<Stack sx={{ py: 3, px: 2 }}>
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

							</Stack>
						</StepContent>
					</Step>
				</Stepper>
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