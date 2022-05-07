import React, { useState, useEffect } from 'react';
import { Stack, Box, Container, TextField } from 'ds/components';
import { useContractActions } from './hooks/useContractActions';
import { Tabs, Tab } from '@mui/material';
import { ContractController } from 'controllers/contract/ContractController';

import { useParams } from 'react-router-dom';
import { useWeb3 } from 'libs/web3';
import { useContract } from 'services/blockchain/provider';

import IPFSModal from '../Contract/IPFSModal';
import Overview from './Overview';

const ContractV2 = () => {
	const [contract, setContract] = useState(null);
	const [contractState, setContractState] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { contracts } = useContract();
	const { id } = useParams();

	const init = async () => {
		const contract = contracts.find((c) => c.id === id);
		if (contract) {
			// Set single contract
			setContract(contract);

			const contractController = new ContractController(contract.address, contract.blockchain, contract.type);
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
			<Box
				sx={{
					borderBottom: 1,
					borderColor: 'divider',
					position: 'fixed',
					background: 'white',
					zIndex: 10,
					top: '58px',
					width: '100%',
				}}>
				<Container>
					<Tabs value={'overview'}>
						<Tab label="Overview" value="overview" />
						<Tab label="Actions" value="actions" />
						<Tab label="Balance" value="settings" />
						<Tab label="Settings" value="settings" />
					</Tabs>
				</Container>
			</Box>

			<Overview setIsModalOpen={setIsModalOpen} contract={contract} contractState={contractState} />

			<IPFSModal
				id={id}
				contract={contract}
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
			/>
		</Stack>
	);
};

export default ContractV2;
