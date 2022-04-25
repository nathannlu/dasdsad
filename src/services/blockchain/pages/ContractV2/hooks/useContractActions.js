import React from 'react';
import NFTCollectible from 'services/blockchain/blockchains/ethereum/abis/AmbitionCreatorImpl.json';

export const useContractActions = () => {
	const to = '0xa8C801F27164E840c9F931147aCDe37fdCCBea4c';
	const from = '0xfd6c3bD6dB6D7cbB77Ee64d1E406B2ACB63A5166';
	const impl = '0x65Cf89C53cC2D1c21564080797b47087504a3815';

	const retrieveContract = (contractAddress) => {
		const web3 = window.web3;
		if (web3.eth) {
			try {
				const contract = new web3.eth.Contract(
					NFTCollectible.abi,
					contractAddress
				);
				console.log(contract);
				return contract;
			} catch (e) {
				console.log(e);
			}
		}
	};

	const updateReveal = () => {
		const { methods: { updateReveal }} = retrieveContract(impl);

		const revealed = false, uri = "ipfs://QmY3ru7ZeAihUU3xexCouSrbybaBV1hPe5EwvNqph1AYdS/"

		const rawTxn = updateReveal(revealed, uri).encodeABI();
		web3.eth.sendTransaction(
			{
				from,
				to,
				data: rawTxn,
			},
			function (error, hash) {
				console.log(error);
			}
		);
	}

	const airdrop = () => {
		const { methods: { airdrop }} = retrieveContract(impl);
		const recipients = ["0xfd6c3bD6dB6D7cbB77Ee64d1E406B2ACB63A5166"]
		const amount = [1]

		const rawTxn = airdrop(recipients, amount).encodeABI();
		web3.eth.sendTransaction(
			{
				from,
				to,
				data: rawTxn,
			},
			function (error, hash) {
				console.log(error);
			}
		);
	}

	const updateSale = () => {
		const { methods: { updateSale }} = retrieveContract(impl);
		const 
			open= true,
			cost= 1,
			maxPerWallet= 10,
			maxPerMint= 10

		const rawTxn = updateSale(open, cost, maxPerWallet, maxPerMint).encodeABI();

		web3.eth.sendTransaction(
			{
				from,
				to,
				data: rawTxn,
			},
			function (error, hash) {
				console.log(error);
			}
		);
	};

	const getPublicVariables = () => {
		const { methods: { open }} = retrieveContract(impl);

		const rawTxn =open().call().encodeABI();
		console.log(rawTxn)
			web3.eth.sendTransaction(
			{
				from,
				to,
				data: rawTxn,
			},
			function (error, hash) {
				console.log(error);
			}
		);	
		
	}

	const mint = () => {
		const to = '0xa8C801F27164E840c9F931147aCDe37fdCCBea4c';
		const from = '0xfd6c3bD6dB6D7cbB77Ee64d1E406B2ACB63A5166';
		const impl = '0x65Cf89C53cC2D1c21564080797b47087504a3815';
		const { methods: { mint }} = retrieveContract(impl);

//		const code = '0x1d02161d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';

		const rawTxn = mint(1).encodeABI();
		console.log(rawTxn)

		web3.eth.sendTransaction(
			{
				from,
				to,
				data: rawTxn,
				value: 1
			},
			function (error, hash) {
				console.log(error);
			}
		);
	};

	return {
		mint,
		updateSale,
		getPublicVariables,
		updateReveal,
		airdrop,
	};
};
