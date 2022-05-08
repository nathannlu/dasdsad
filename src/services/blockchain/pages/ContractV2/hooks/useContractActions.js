import React, { useState } from 'react';
// import NFTCollectible from 'services/blockchain/blockchains/ethereum/abis/AmbitionCreatorImpl.json';
import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';

export const useContractActions = () => {
	const { addToast } = useToast();
	const [state, setState] = useState({ isSaving: false });

	const { form: actionForm } = useForm({
		airdropList: {
			default: '',
			placeholder: `0x123\n0x456\n0x789`,
			rules: [],
		},
		whitelistAddresses: {
			default: '',
			placeholder: `0x123\n0x456\n0x789`,
			rules: [],
		},
		maxPerMintCount: {
			default: '',
			placeholder: '5',
			rules: [],
		},
		maxPerWalletCount: {
			default: '',
			placeholder: '10',
			rules: [],
		},
		newPrice: {
			default: '',
			placeholder: '5',
			rules: [],
		},
		newMetadataUrl: {
			default: '',
			placeholder: 'New metadata URL',
			rules: [],
		},
	});

	const to = '0xa8C801F27164E840c9F931147aCDe37fdCCBea4c';
	const from = '0xfd6c3bD6dB6D7cbB77Ee64d1E406B2ACB63A5166';
	const impl = '0x65Cf89C53cC2D1c21564080797b47087504a3815';

	const onError = (err) => {
		addToast({ severity: 'error', message: err.message });
		setState(prevState => ({ ...prevState, isSaving: false }));
	};
	const onSuccess = (message) => {
		addToast({ severity: 'success', message });
		setState(prevState => ({ ...prevState, isSaving: false }));
	};

	const updateReveal = async (contractController, walletAddress) => {
		const { newMetadataUrl } = actionForm;

		console.log(newMetadataUrl.value);

		if (!newMetadataUrl.value) {
			return;
		}

		setState(prevState => ({ ...prevState, isSaving: true }));
		try {
			// @TODO ask to set reveal as true or false
			await contractController.updateReveal(walletAddress, true, newMetadataUrl.value);
			onSuccess('Metadata Url updated successfully!');
		} catch (e) {
			onError(e);
		}
	}

	const setMaxPerMint = async (contractController) => {
		const { maxPerMintCount } = actionForm;

		console.log(maxPerMintCount.value);

		if (!maxPerMintCount.value) {
			return;
		}

		setState(prevState => ({ ...prevState, isSaving: true }));

		try {
			// @TODO ask to set reveal as true or false
			onSuccess('Max per mint updated successfully!');
		} catch (e) {
			onError(e);
		}
	}

	const setMaxPerWallet = async (contractController) => {
		const { maxPerWalletCount } = actionForm;

		console.log(maxPerWalletCount.value);

		if (!maxPerWalletCount.value) {
			return;
		}

		setState(prevState => ({ ...prevState, isSaving: true }));
		try {
			// @TODO ask to set reveal as true or false
			onSuccess('Max per wallet updated successfully!');
		} catch (e) {
			onError(e);
		}
	}

	const setOpenSales = async (contractController) => { }
	const setOpenPresale = async (contractController) => { }

	const setCost = async (contractController) => { }

	const setAirdropList = async (contractController) => {
		const { airdropList } = actionForm;

		console.log(airdropList.value);

		if (!airdropList.value) {
			return;
		}

		setState(prevState => ({ ...prevState, isSaving: true }));

		const count = airdropList.split('\n').length;
		const amount = new Array(count).fill(1);

		console.log(airdropList.split('\n'));
		console.log(amount);

		contract.airdrop(from, airdropList.split('\n'), amount);
		try {
			// @TODO ask to set reveal as true or false
			onSuccess('Max per wallet updated successfully!');
		} catch (e) {
			onError(e);
		}
	}

	const setMerkleRoot = async (contractController) => { }


	// const airdrop = () => {
	// 	const { methods: { airdrop } } = retrieveContract(impl);
	// 	const recipients = ["0xfd6c3bD6dB6D7cbB77Ee64d1E406B2ACB63A5166"]
	// 	const amount = [1]

	// 	const rawTxn = airdrop(recipients, amount).encodeABI();
	// 	web3.eth.sendTransaction(
	// 		{
	// 			from,
	// 			to,
	// 			data: rawTxn,
	// 		},
	// 		function (error, hash) {
	// 			console.log(error);
	// 		}
	// 	);
	// }

	const updateSale = () => {
		const { methods: { updateSale } } = retrieveContract(impl);
		const
			open = true,
			cost = 1,
			maxPerWallet = 10,
			maxPerMint = 10

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

	// const mint = () => {
	// 	const to = '0xa8C801F27164E840c9F931147aCDe37fdCCBea4c';
	// 	const from = '0xfd6c3bD6dB6D7cbB77Ee64d1E406B2ACB63A5166';
	// 	const impl = '0x65Cf89C53cC2D1c21564080797b47087504a3815';
	// 	const { methods: { mint } } = retrieveContract(impl);

	// 	//		const code = '0x1d02161d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';

	// 	const rawTxn = mint(1).encodeABI();
	// 	console.log(rawTxn)

	// 	web3.eth.sendTransaction(
	// 		{
	// 			from,
	// 			to,
	// 			data: rawTxn,
	// 			value: 1
	// 		},
	// 		function (error, hash) {
	// 			console.log(error);
	// 		}
	// 	);
	// };

	return {
		// mint,
		updateReveal,

		updateSale,

		setOpenSales,
		setOpenPresale,

		setAirdropList,
		setMaxPerMint,
		setMaxPerWallet,
		setCost,
		setMerkleRoot,

		actionForm,
		isSaving: state.isSaving
	};
};
