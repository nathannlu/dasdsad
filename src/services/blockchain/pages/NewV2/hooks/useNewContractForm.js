import React from 'react';
import { useState } from 'react';
import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';
import { useHistory } from 'react-router-dom';
import { useCreateContract, useUpdateContractDetails } from 'services/blockchain/gql/hooks/contract.hook';
import { useContract } from 'services/blockchain/provider';

import { ContractController, getBlockchainType, getBlockchainCurrency } from '@ambition-blockchain/controllers';

import posthog from 'posthog-js';

const CONTRACT_VERSION = 'erc721a';


/**
 * Resonsible for handling contract information state
 * before object has been created in MongoDB
 */
export const useNewContractForm = () => {
	const history = useHistory();
	const { addToast } = useToast();
	const { setContract, contract, setContracts, contracts } = useContract();

	/**
	 * General configuration
	 */
	const [state, setState] = useState({
		formValidationErrors: {
			name: null,
			symbol: null,
			maxSupply: null,
			price: null
		},
		activeFocusKey: 'NAME', // default,
		activeBlockchain: 'ethereum', // default,
		isTestnetEnabled: true, // default
		isDeploying: false,
		isSaving: false,
		deployingMessage: 'Creating Contract! Please be patient it will take couple of seconds...',
		contractState: {
			id: null,
			name: null,
			symbol: null,
			address: null,
			blockchain: null,
			type: CONTRACT_VERSION,
			nftCollection: {
				baseUri: null,
				unRevealedBaseUri: null,
				price: 1,
				size: null,
				currency: null
			},
		}
	});

	/**
	 * Form handling information regard
	 */
	const { form: newContractForm } = useForm({
		name: {
			default: '',
			placeholder: 'Ambition',
			label: 'Name of your collection'
		},
		symbol: {
			default: '',
			placeholder: 'AMB',
			label: 'Symbol of your collection',
		},
		maxSupply: {
			default: '',
			placeholder: '1000',
			label: 'Collection size',
		},
		price: {
			default: '1',
			placeholder: '0.5',
			label: 'Price per mint',
		},
	});

	/**
	 * GraphQL- Create contract hook
	 */
	const [createContract] = useCreateContract({
		onCompleted: (data) => {
			addToast({
				severity: 'success',
				message: 'Smart contract successfully created',
			});

			setContracts([...contracts, data?.createContract]);

			setContract(data?.createContract);
			setContractState(data?.createContract);
			posthog.capture('User created contract');
		}
	});

	const handleRedirectToSuccessPage = (id) => {
		history.push(`/smart-contracts/v2/${id}/deploy/success`);
	};

	const handleRedirectToDetailsPage = (id) => {
		history.push(`/smart-contracts/v2/${id}`);
	}

	const onError = (err) => {
		addToast({ severity: 'error', message: err?.message });
		setIsDeploying(false);
		setIsSaving(false);
	};

	/**
	 * Handle error states if user leaves
	 * input fields blank
	 */
	const setFormValidationErrors = () => {
		const { name, symbol, maxSupply, price } = newContractForm;
		setState(prevState => ({
			...prevState,
			formValidationErrors: {
				name: name.value ? null : true,
				symbol: symbol.value ? null : true,
				maxSupply: maxSupply.value && Number(maxSupply.value) > 0 ? null : true,
				price: price.value ? null : true,
			}
		}));

		// clear validation error after 3 seconds
		setTimeout(() => setState(prevState => ({
			...prevState,
			formValidationErrors: {
				name: null,
				symbol: null,
				maxSupply: null,
				price: null
			}
		})), 3000);
		return;
	}

	/**
	 * Creates contract in backend
	 */
	const saveContract = async (contractAddress) => {
		const blockchain = getBlockchainType(state.activeBlockchain, state.isTestnetEnabled);
		const { name, symbol, maxSupply, price } = newContractForm;

		// validate form
		if (!name.value || !symbol.value || !maxSupply.value || Number(maxSupply.value) <= 0) {
			setFormValidationErrors();
			return;
		}

		setIsSaving(true);

		try {
			const contractInput = {
				name: name.value,
				symbol: symbol.value,
				address: contractAddress || '',
				blockchain,
				type: CONTRACT_VERSION,
				nftCollection: {
					price: parseFloat(price.value),
					size: parseInt(maxSupply.value),
					currency: getBlockchainCurrency(blockchain)
				},
			};
			console.log(contractInput)
			const response = await createContract({ variables: { contract: contractInput } });

			// @TODO do we still need?
			if (contractAddress) {
				handleRedirectToSuccessPage(response?.data?.createContract?.id);
			} else {
				handleRedirectToDetailsPage(response?.data?.createContract?.id);
			}

		} catch (err) {
			onError(new Error("Error Saving contract details. Please contact an administrator."));
		} finally {
			setIsSaving(false);
		}
	};


	const setActiveBlockchain = (activeBlockchain) => setState(prevState => ({ ...prevState, activeBlockchain }));

	const setIsTestnetEnabled = (isTestnetEnabled) => setState(prevState => ({ ...prevState, isTestnetEnabled }));

	const setIsDeploying = (isDeploying) => setState(prevState => ({ ...prevState, isDeploying }));

	const setIsSaving = (isSaving) => setState(prevState => ({ ...prevState, isSaving }));

	const setContractState = (contractState) => setState(prevState => ({ ...prevState, contractState: { ...prevState.contractState, ...contractState } }));

	return {
		...state,
		newContractForm,
		saveContract,
		onError,
		setActiveBlockchain,
		setIsTestnetEnabled,
		setContractState,
	};
}
