import React, { useState, useEffect } from 'react';
import { Stack, TextField } from 'ds/components';
import { useContractActions } from './hooks/useContractActions';
import { ContractController } from 'controllers/ContractController';

import { useParams } from 'react-router-dom';
import { useWeb3 } from 'libs/web3';
import { useContract } from 'services/blockchain/provider';

import IPFSModal from '../Contract/IPFSModal';

import Overview from './Overview';

const ContractV2 = () => {
//	const { updateSale, getPublicVariables, updateReveal, airdrop } =
		useContractActions();
//	const { contracts } = useContract();
	const [airdropList, setAirdropList] = useState('');

	const contractAddress = '0xd4975541438a06e5b6dc7dd2d5bc646aed652616'
	const from = '0xfd6c3bD6dB6D7cbB77Ee64d1E406B2ACB63A5166';
	const impl = '0x65Cf89C53cC2D1c21564080797b47087504a3815';
	const { id } = useParams();

	const blockchain = 'ethereum';
	const version = 'erc721a';
//	const [contract, setContract] = useState({});

	/*j
	useEffect(() => {
		console.log(contracts);
		const c = contracts.find((c) => c.id == id);
		setContract(c);
		console.log(c);
	}, [contracts]);
	*/

	const contract = new ContractController(contractAddress, blockchain, version)

	const [isModalOpen, setIsModalOpen] = useState(false);


	const airdropAddresses = () => {
		const count = airdropList.split('\n').length
		const amount = new Array(count).fill(1);

		console.log(airdropList.split('\n'))
		console.log(amount)


		contract.airdrop(from, airdropList.split('\n'), amount);
	}

	const setMetadataUrl = () => {
		const ipfsUri = 'ipfs://QmY3ru7ZeAihUU3xexCouSrbybaBV1hPe5EwvNqph1AYdS/'
		contract.updateReveal(from, true, ipfsUri)
	}



	return (
		<Stack>

			{/*
			<Overview setIsModalOpen={setIsModalOpen} />

			<button onClick={()=>contract.mint(from, 1)}>
				Mint
			</button>
			*/}

			<button onClick={()=>setMetadataUrl()}>
				Set metadata URL 
			</button>

			<button onClick={()=>airdropAddresses()}>
				airdrop
			</button>


			<TextField
					sx={{ width: '500px' }}
					multiline
					rows={7}
					size="small"
					onChange={e=>setAirdropList(e.target.value)}
			/>



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
