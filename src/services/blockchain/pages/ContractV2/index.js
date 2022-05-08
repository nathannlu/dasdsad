import React, { useState, useEffect } from 'react';
import { Stack, Box, Container, TextField } from 'ds/components';
import { useContractActions } from './hooks/useContractActions';
import { ContractController } from '@yaman-apple-frog/controllers';

import { useParams } from 'react-router-dom';
import { useWeb3 } from 'libs/web3';
import { useContract } from 'services/blockchain/provider';

import IPFSModal from '../Contract/IPFSModal';

import ContractDetailTabs from './ContractDetailTabs';
import NotComplete from './NotComplete';
import { CircularProgress } from '@mui/material';

const ContractV2 = () => {
	const [contract, setContract] = useState(null);
	const [contractState, setContractState] = useState(null);
	const [contractController, setContractController] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true); // default

	const { contracts } = useContract();
	const { id } = useParams();

	const isSetupComplete = contract?.nftCollection?.baseUri && contract?.address;

	const init = async () => {
		const contract = contracts.find((c) => c.id === id);
		if (contract) {
			// Set single contract
			setContract(contract);
			setIsLoading(false);

			const contractController = new ContractController(contract.address, contract.blockchain, contract.type);
			setContractController(contractController);

			console.log(contractController, 'contractController');

			const contractState = await contractController.populateContractInfo();
			console.log(contractState, 'contractState');

			setContractState(contractState);
		}
	}

	useEffect(() => {
		if (contracts.length) { init(); }
	}, [contracts]);

	return (
		<Stack>
			<Container>

				{isLoading && <Stack alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
					<CircularProgress />
				</Stack>}

				{!isLoading && <Box
					sx={{
						background: 'white',
						zIndex: 10,
						top: '58px',
						width: '100%'
					}}>

					{!isSetupComplete ? (
						<NotComplete
							id={id}
							contract={contract}
							setIsModalOpen={setIsModalOpen}
						/>
					) : (
						<ContractDetailTabs
							id={id}
							contract={contract}
							contractState={contractState}
							setContractState={setContractState}
							contractController={contractController}
						/>
					)}
				</Box>}

				<IPFSModal
					id={id}
					contract={contract}
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
				/>
			</Container>

		</Stack>
	);
};

export default ContractV2;
