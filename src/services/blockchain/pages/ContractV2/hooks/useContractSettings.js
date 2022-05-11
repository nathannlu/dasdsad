import React, { useState } from 'react';
// import NFTCollectible from 'services/blockchain/blockchains/ethereum/abis/AmbitionCreatorImpl.json';
import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';

import { useSetWhitelist } from 'services/blockchain/gql/hooks/contract.hook.js';

export const useContractSettings = () => {
	const { addToast } = useToast();
	const [state, setState] = useState({ isSaving: false, whitelistAddresses: [] });
	const [setWhitelist] = useSetWhitelist({});

	const { form: actionForm, setFormState: setActionFormState } = useForm({
		airdropList: {
			default: '',
			placeholder: `0x123\n0x456\n0x789`,
		},
		maxPerMint: {
			default: '',
			placeholder: '5',
		},
		maxPerWallet: {
			default: '',
			placeholder: '10',

		},
		price: {
			default: '',
			placeholder: '5',

		},
		metadataUrl: {
			default: '',
			placeholder: 'New metadata URL',
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

	const updateReveal = async ({ contractController, setContractState, walletAddress }) => {
		const { metadataUrl } = actionForm;

		console.log(metadataUrl.value);

		if (!metadataUrl.value) {
			return;
		}

		setState(prevState => ({ ...prevState, isSaving: true }));
		try {
			// @TODO ask to set reveal as true or false
			const contractState = await contractController.updateReveal(walletAddress, true, metadataUrl.value);
			setContractState(contractState);
			onSuccess('Metadata Url updated successfully!');
		} catch (e) {
			onError(e);
		}
	}

	const setPublicSales = async ({ contractController, setContractState, walletAddress }, isOpen) => {
		const maxPerMint = actionForm.maxPerMint.value;
		const maxPerWallet = actionForm.maxPerWallet.value;
		const price = actionForm.price.value;

		if (!maxPerMint || maxPerMint === 0) {
			addToast({ severity: 'error', message: `max per mint can't be zero` });
			return;
		}

		if (!maxPerWallet || maxPerWallet === 0) {
			addToast({ severity: 'error', message: `max per wallet can't be zero` });
			return;
		}

		if (!price || price === 0) {
			addToast({ severity: 'error', message: `max per wallet can't be zero` });
			return;
		}

		const web3 = window.web3;
		const priceInWei = web3.utils.toWei(`${parseFloat(actionForm.price.value)}`);

		setState(prevState => ({ ...prevState, isSaving: true }));

		try {
			const contractState = await contractController.updateSale(walletAddress, isOpen, priceInWei, maxPerWallet, maxPerMint);
			setContractState(contractState);
			onSuccess('Public Sale settings updated successfully!');
		} catch (e) {
			onError(e);
		}
	}

	const setPresales = async ({ contractController, setContractState, walletAddress }, isOpen) => {
		if (!maxPerMint || maxPerMint === 0) {
			addToast({ severity: 'error', message: `max per mint can't be zero` });
			return;
		}

		if (!maxPerWallet || maxPerWallet === 0) {
			addToast({ severity: 'error', message: `max per wallet can't be zero` });
			return;
		}

		if (!price || price === 0) {
			addToast({ severity: 'error', message: `max per wallet can't be zero` });
			return;
		}

		const web3 = window.web3;
		const priceInWei = web3.utils.toWei(`${parseFloat(actionForm.price.value)}`);

		setState(prevState => ({ ...prevState, isSaving: true }));

		try {
			const contractState = await contractController.updateSale(walletAddress, isOpen, priceInWei, maxPerWallet, maxPerMint);
			setContractState(contractState);
			onSuccess('Public Sale settings updated successfully!');
		} catch (e) {
			onError(e);
		}
		// setWhitelist({ variables: { id, whitelist: addresses } });
	}

	const setAirdropList = async ({ contractController, setContractState, walletAddress }) => {
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

	const setMerkleRoot = async ({ contractController, setContractState, walletAddress }) => { }

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

	const setMaxPerMint = (maxPerMint) => setActionFormState(prevState => ({ ...prevState, maxPerMint: { ...prevState.maxPerMint, value: maxPerMint } }));
	const setMaxPerWallet = (maxPerWallet) => setActionFormState(prevState => ({ ...prevState, maxPerWallet: { ...prevState.maxPerWallet, value: maxPerWallet } }));
	const setPrice = (price) => setActionFormState(prevState => ({ ...prevState, price: { ...prevState.price, value: price } }));
	const setWhitelistAddresses = (whitelistAddresses) => setState(prevState => ({ ...prevState, whitelistAddresses }));

	return {
		// mint,
		...state,

		updateReveal,

		setPublicSales,
		setPresales,

		setAirdropList,
		setMerkleRoot,

		setMaxPerMint,
		setMaxPerWallet,
		setPrice,

		setWhitelistAddresses,
		actionForm
	};
};
