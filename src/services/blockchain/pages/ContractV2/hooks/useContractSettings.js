import React, { useState } from 'react';
import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';

import { useSetWhitelist, useSetBaseUri, useSetNftPrice, useUpdateContractDetails } from 'services/blockchain/gql/hooks/contract.hook.js';
import { getMerkleTreeRoot } from '@ambition-blockchain/controllers';

export const useContractSettings = () => {
	const { addToast } = useToast();
	const [state, setState] = useState({
		isSavingMetadatUrl: false,
		isSavingAirdrop: false,
		isSavingPublicSales: false,
		isSavingPreSales: false,
		isMinting: false,
		isWithdrawing: false,
		isNftRevealEnabled: false, // default

		whitelistAddresses: [],
		airdropAddresses: []
	});

	const [setWhitelist] = useSetWhitelist({});
	const [setBaseUri] = useSetBaseUri({});
	const [setNftPrice] = useSetNftPrice({});

	const { form: actionForm, setFormState: setActionFormState } = useForm({
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

	const onError = (err) => {
		addToast({ severity: 'error', message: err.message });
		setState(prevState => ({
			...prevState,
			isSavingMetadatUrl: false,
			isSavingAirdrop: false,
			isSavingPublicSales: false,
			isSavingPreSales: false,
			isMinting: false,
			isWithdrawing: false,
		}));
	};

	const onSuccess = (message) => {
		addToast({ severity: 'success', message });
		setState(prevState => ({
			...prevState,
			isSavingMetadatUrl: false,
			isSavingAirdrop: false,
			isSavingPublicSales: false,
			isSavingPreSales: false,
			isMinting: false,
			isWithdrawing: false,
		}));
	};

	const updateReveal = async ({ contractController, setContractState, walletAddress, contractId }) => {
		const { metadataUrl } = actionForm;

		try {
			if (!metadataUrl.value) {
				throw new Error('Metadata url can not be empty!')
			}

			setState(prevState => ({ ...prevState, isSavingMetadatUrl: true }));
			// @TODO ask to set reveal as true or false
			const contractState = await contractController.updateReveal(walletAddress, state.isNftRevealEnabled, metadataUrl.value);
			setContractState(contractState);
			setBaseUri({ variables: { id: contractId, baseUri: metadataUrl.value } });
			onSuccess('Metadata Url updated successfully!');
		} catch (e) {
			onError(e);
		}
	}

	const updateSales = async ({ contractController, setContractState, walletAddress, contractId }, isOpen) => {
		const maxPerMint = parseFloat(actionForm.maxPerMint.value);
		const maxPerWallet = parseFloat(actionForm.maxPerWallet.value);
		const price = parseFloat(actionForm.price.value);

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
		const priceInWei = web3.utils.toWei(`${price}`);

		setState(prevState => ({ ...prevState, isSavingPublicSales: true }));

		try {
			const contractState = await contractController.updateSale(walletAddress, isOpen, priceInWei, maxPerWallet, maxPerMint);
			setContractState(contractState);
			setNftPrice({ variables: { id: contractId, price } });
			onSuccess('Public Sale settings updated successfully!');
		} catch (e) {
			onError(e);
		}
	}

	const setPresales = async ({ contractController, setContractState, walletAddress, contractId }, isOpen) => {
		if (!state.whitelistAddresses.length) {
			addToast({ severity: 'error', message: `Whitelist can't be empty!` });
			return;
		}

		const markleRoot = getMerkleTreeRoot(state.whitelistAddresses);

		setState(prevState => ({ ...prevState, isSavingPreSales: true }));

		try {
			const contractState = await contractController.updatePresale(walletAddress, isOpen, markleRoot);
			setContractState(contractState);
			setWhitelist({ variables: { id: contractId, whitelist: state.whitelistAddresses } });
			onSuccess('Pre Sale settings updated successfully!');
		} catch (e) {
			onError(e);
		}
	}

	const airdrop = async ({ contractController, setContractState, walletAddress }) => {
		if (!state.airdropAddresses.length) {
			addToast({ severity: 'error', message: `Airdrop list can't be empty!` });
			return;
		}

		const recipients = state.airdropAddresses.map(({ address }) => address);
		const count = state.airdropAddresses.map(({ count }) => count);

		setState(prevState => ({ ...prevState, isSavingAirdrop: true }));

		try {
			const contractState = await contractController.airdrop(walletAddress, recipients, count);
			setContractState(contractState);
			onSuccess(`Nft's Airdroped successfully!`);
		} catch (e) {
			onError(e);
		}
	}

	const withdraw = async ({ contractController, setContractState, walletAddress }) => {
		setState(prevState => ({ ...prevState, isWithdrawing: true }));

		try {
			const contractState = await contractController.withdraw(walletAddress);
			setContractState(contractState);
			onSuccess(`Contract withdrawn successfully!`);
		} catch (e) {
			onError(e);
		}
	}

	const mint = async ({ contractController, setContractState, walletAddress }, count) => {
		setState(prevState => ({ ...prevState, isMinting: true }));

		try {
			const contractState = await contractController.mint(walletAddress, count, state.whitelistAddresses);
			setContractState(contractState);
			onSuccess(`Nft's Minted successfully!`);
		} catch (e) {
			onError(e);
		}
	}

	const setMaxPerMint = (maxPerMint) => setActionFormState(prevState => ({ ...prevState, maxPerMint: { ...prevState.maxPerMint, value: maxPerMint } }));
	const setMaxPerWallet = (maxPerWallet) => setActionFormState(prevState => ({ ...prevState, maxPerWallet: { ...prevState.maxPerWallet, value: maxPerWallet } }));
	const setMetadataUrl = (metadataUrl) => setActionFormState(prevState => ({ ...prevState, metadataUrl: { ...prevState.metadataUrl, value: metadataUrl } }));
	const setPrice = (price) => setActionFormState(prevState => ({ ...prevState, price: { ...prevState.price, value: price } }));

	const setWhitelistAddresses = (whitelistAddresses) => setState(prevState => ({ ...prevState, whitelistAddresses }));
	const setAirdropAddresses = (airdropAddresses) => setState(prevState => ({ ...prevState, airdropAddresses }));
	const setIsNftRevealEnabled = (isNftRevealEnabled) => setState(prevState => ({ ...prevState, isNftRevealEnabled }));

	return {
		...state,

		updateReveal,
		updateSales,
		setPresales,
		airdrop,
		withdraw,
		mint,

		setMaxPerMint,
		setMaxPerWallet,
		setPrice,

		setWhitelistAddresses,
		setAirdropAddresses,
		setIsNftRevealEnabled,
		setMetadataUrl,
		actionForm
	};
};
