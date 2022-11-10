import { useEffect } from 'react';
import { useState } from 'react';
import { useWeb3 } from 'libs/web3';
import posthog from 'posthog-js';

import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';
import { useHistory } from 'react-router-dom';
import { useCreateContract } from 'services/blockchain/gql/hooks/contract.hook';
import { useContract } from 'services/blockchain/provider';

import { ContractController, getBlockchainCurrency } from '@ambition-blockchain/controllers';

const CONTRACT_VERSION = 'erc721a';

/**
 * Resonsible for handling contract information state
 * before object has been created in MongoDB
 */
export const useNewContractForm = () => {
	const history = useHistory();
	const { walletController } = useWeb3();
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
		activeBlockchain: null,
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
			}
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
				message: 'Smart contract created successfully.',
			});

			setContracts([...contracts, data?.createContract]);
			setContract(data?.createContract);
			setContractState(data?.createContract);
			posthog.capture(`User created contract on ${state.activeBlockchain}`);
		},
		onError
	});

	const onError = (err) => {
		addToast({ severity: 'error', message: err?.message });
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
				price: price.value && Number(price.value) >= 0 ? null : true,
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
	const saveContract = async () => {
		const { name, symbol, maxSupply, price } = newContractForm;

		// validate form
		if (!name.value || !symbol.value || !maxSupply.value || Number(maxSupply.value) <= 0 || Number(price.value) < 0) {
			setFormValidationErrors();
			return;
		}

		setIsSaving(true);
		addToast({
			severity: 'info',
			message: 'Creating contract to blockchain. This might take a couple of seconds...',
		});

		try {
			const contractInput = {
				name: name.value,
				symbol: symbol.value,
				blockchain: state.activeBlockchain,
				type: state.activeBlockchain === 'solanadevnet' ? 'whitelist' : CONTRACT_VERSION,
				nftCollection: {
					price: parseFloat(price.value),
					size: parseInt(maxSupply.value),
					currency: getBlockchainCurrency(state.activeBlockchain)
				}
			};
			const response = await createContract({ variables: { contract: contractInput } });

			

			if (response?.data?.createContract?.type === CONTRACT_VERSION) {
				// Log to posthog
				posthog.capture('User created contract in dashboard', {
					blockchain: 'ethereum',
				});

				history.push(`/smart-contracts/v2/${response?.data?.createContract?.id}`);
			} else {
				// Solana contract creation is logged in /New/index.js

				history.push(`/smart-contracts/${response?.data?.createContract?.id}`);
			}
		} catch (err) {
			console.log(err)
			onError(new Error("Error Saving contract details. Please contact an administrator."));
		} finally {
			setIsSaving(false);
		}
	};

	const setActiveBlockchain = (activeBlockchain) => setState(prevState => ({ ...prevState, activeBlockchain }));
	const setIsSaving = (isSaving) => setState(prevState => ({ ...prevState, isSaving }));
	const setContractState = (contractState) => setState(prevState => ({ ...prevState, contractState: { ...prevState.contractState, ...contractState } }));

	useEffect(() => {
		(async () => {
			if (state.activeBlockchain === 'solanadevnet') {
				await walletController?.loadWalletProvider('phantom');
				return;
			}
			await walletController?.loadWalletProvider('metamask');
		})();
	}, [state.activeBlockchain]);

	return {
		...state,
		newContractForm,
		saveContract,
		onError,
		setActiveBlockchain,
		setContractState,
	};
}
