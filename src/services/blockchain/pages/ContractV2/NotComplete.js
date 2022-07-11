import React from 'react';
import { useParams, useHistory } from 'react-router-dom';

import {
	Button,
	Box,
	Grid,
	Typography,
	CircularProgress,
	Stack
} from 'ds/components';
import { Stepper, Step, StepLabel } from '@mui/material';
import ContractDetailsHeader from './widgets/ContractDetailsHeader';
import { useDeployContractToTestnet } from './hooks/useDeployContractToTestnet';

const NotComplete = ({ contract }) => {
	const history = useHistory();
	const { id } = useParams();
	const { deployContractToTestnet, isDeploying } = useDeployContractToTestnet(contract, id);

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

				<Typography sx={{ fontWeight: 'bold' }}>
					Deploy contract on <span sx={{ textTransform: 'capitalize' }}>{contract?.blockchain}</span>
				</Typography>
				<Typography>
					Configure your contract and deploy it on the <span sx={{ textTransform: 'capitalize' }}>{contract?.blockchain}</span> Test Network
				</Typography>

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
		</Grid>
	)
};

export default NotComplete;
