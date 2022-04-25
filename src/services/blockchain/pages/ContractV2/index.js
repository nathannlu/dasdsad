import React, { useState, useEffect } from 'react';
import { Stack } from 'ds/components';
import { useContractActions } from './hooks/useContractActions';
import { ContractController } from 'controllers/ContractController';

import { useParams } from 'react-router-dom';
import { useWeb3 } from 'libs/web3';
import { useContract } from 'services/blockchain/provider';

import IPFSModal from '../Contract/IPFSModal';

import Overview from './Overview';

const ContractV2 = () => {
	const { updateSale, getPublicVariables, updateReveal, airdrop } =
		useContractActions();
	const { contracts } = useContract();

	const contractAddress = '0xa8C801F27164E840c9F931147aCDe37fdCCBea4c';
	const from = '0xfd6c3bD6dB6D7cbB77Ee64d1E406B2ACB63A5166';
	const impl = '0x65Cf89C53cC2D1c21564080797b47087504a3815';
	const { id } = useParams();

	const blockchain = 'solana';
	const version = 'erc721a';
	const [contract, setContract] = useState({});

	useEffect(() => {
		console.log(contracts);
		const c = contracts.find((c) => c.id == id);
		setContract(c);
		console.log(c);
	}, [contracts]);

	//	const contract = new ContractController(contractAddress, blockchain, version)
	//	console.log(contract)

	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<Stack>
			<Overview setIsModalOpen={setIsModalOpen} />

			{/*
			<button onClick={()=>contract.mint(from, 1)}>
				Mint
			</button>
			<button onClick={()=>updateSale()}>
				Open
			</button>
			<button onClick={()=>getPublicVariables()}>
				getPublicVarables
			</button>
			<button onClick={()=>updateReveal()}>
				updateReveal
			</button>
			<button onClick={()=>airdrop()}>
				airdrop
			</button>
			*/}

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
