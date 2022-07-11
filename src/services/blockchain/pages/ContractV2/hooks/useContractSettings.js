import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';
import { useWeb3 } from 'libs/web3';

import { useSetWhitelist, useSetBaseUri, useSetNftPrice, useSetUnRevealedBaseUri } from 'services/blockchain/gql/hooks/contract.hook.js';
import { getMerkleTreeRoot } from '@ambition-blockchain/controllers';

import { useContractDetailsV2 } from './useContractDetailsV2';

export const useContractSettings = () => {
	const { addToast } = useToast();
    const { id } = useParams();

	const { contractController, contract, contractState, setContractState } = useContractDetailsV2();

	const { walletController } = useWeb3();
	const walletAddress = walletController?.state?.address;

	const [state, setState] = useState({
		isSavingMetadatUrl: false,
		isSavingAirdrop: false,
		isSavingPublicSales: false,
		isSavingPreSales: false,
		isMinting: false,
		isWithdrawing: false,
		whitelistAddresses: [],
		airdropAddresses: [],
		isWhitelistAddressDialogOpen: false,
		isAirdropDialogOpen: false
	});

	const [setWhitelist] = useSetWhitelist({});
	const [setBaseUri] = useSetBaseUri({});
	const [setUnRevealedBaseUri] = useSetUnRevealedBaseUri({});
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

		}
	});

	const onError = (error) => {
		console.error(error);
		addToast({ severity: 'error', message: error.message });
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

	const updateReveal = async () => {
		try {

			// set false if already revealed
			const isRevealed = !contractState?.isRevealed;
			const url = isRevealed ? contract?.nftCollection?.baseUri : contract?.nftCollection?.unRevealedBaseUri;

			console.log({ contractController, isRevealed, walletAddress, url, contract, contractState }, 'updateReveal ===>');

			if (!url) {
				throw new Error('Metadata url can not be empty!');
			}

			setState(prevState => ({ ...prevState, isSavingMetadatUrl: true }));

			const newContractState = await contractController.updateReveal(walletAddress, isRevealed, url);
			setContractState(newContractState);

			if (newContractState?.isRevealed) {
				setBaseUri({ variables: { id, baseUri: url } });
			} else {
				setUnRevealedBaseUri({ variables: { id, unRevealedBaseUri: url } });
			}

			onSuccess('Metadata Url updated successfully!');
		} catch (e) {
			onError(e);
		}
	}

	const updateSales = async (isOpen) => {
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

		const web3 = window.web3;
		const priceInWei = web3.utils.toWei(`${price}`);

		setState(prevState => ({ ...prevState, isSavingPublicSales: true }));

		try {
			const contractState = await contractController.updateSale(walletAddress, isOpen, priceInWei, maxPerWallet, maxPerMint);
			setContractState(contractState);
			setNftPrice({ variables: { id, price } });
			onSuccess('Public Sale settings updated successfully!');
		} catch (e) {
			onError(e);
		}
	}

	const setPresales = async (isOpen, whitelistAddresses) => {
		if (!whitelistAddresses.length) {
			addToast({ severity: 'error', message: `Whitelist can't be empty!` });
			return;
		}

		const markleRoot = getMerkleTreeRoot(whitelistAddresses);

		setState(prevState => ({ ...prevState, isSavingPreSales: true }));

		console.log({ walletAddress, isOpen, markleRoot });

		try {
			const contractState = await contractController.updatePresale(walletAddress, isOpen, markleRoot);
			setContractState(contractState);
			setWhitelist({ variables: { id, whitelist: whitelistAddresses } });
			onSuccess('Pre Sale settings updated successfully!');
		} catch (e) {
			onError(e);
		}
	}

	const airdrop = async (airdropAddresses) => {
		if (!airdropAddresses.length) {
			addToast({ severity: 'error', message: `Airdrop list can't be empty!` });
			return;
		}

		const recipients = airdropAddresses.map(({ address }) => address);
		const count = airdropAddresses.map(({ count }) => count);

		setState(prevState => ({ ...prevState, isSavingAirdrop: true }));

		try {
			const contractState = await contractController.airdrop(walletAddress, recipients, count);
			setContractState(contractState);
			onSuccess(`Nft's Airdroped successfully!`);
		} catch (e) {
			onError(e);
		}
	}

	const withdraw = async () => {
		setState(prevState => ({ ...prevState, isWithdrawing: true }));

		try {
			const contractState = await contractController.withdraw(walletAddress);
			setContractState(contractState);
			onSuccess(`Contract withdrawn successfully!`);
		} catch (e) {
			onError(e);
		}
	}

	const mint = async (count) => {
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
	const setPrice = (price) => setActionFormState(prevState => ({ ...prevState, price: { ...prevState.price, value: price } }));

	const setWhitelistAddresses = (whitelistAddresses) => setState(prevState => ({ ...prevState, whitelistAddresses }));
	const setAirdropAddresses = (airdropAddresses) => setState(prevState => ({ ...prevState, airdropAddresses }));
	const toggleWhitelistAddressDialog = (isWhitelistAddressDialogOpen) => setState(prevState => ({ ...prevState, isWhitelistAddressDialogOpen }));
	const toggleAirdropDialog = (isAirdropDialogOpen) => setState(prevState => ({ ...prevState, isAirdropDialogOpen }));

	useEffect(() => {
		setMaxPerMint(contractState?.maxPerMint || '1');
		setMaxPerWallet(contractState?.maxPerWallet || '1');
		setWhitelistAddresses(contract?.nftCollection?.whitelist || []);
	}, [contractState]);

	useEffect(() => {
		setPrice(contract?.nftCollection?.price || '1');
	}, []);

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
		toggleWhitelistAddressDialog,
		toggleAirdropDialog,
		actionForm
	};
};