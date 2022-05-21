import { useState } from 'react';
import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';
import { useHistory } from 'react-router-dom';
import { useCreateContract, useUpdateContractDetails } from 'services/blockchain/gql/hooks/contract.hook';
import { useContract } from 'services/blockchain/provider';

import { ContractController, getBlockchainType, getBlockchainCurrency } from '@ambition-blockchain/controllers';

import posthog from 'posthog-js';

const CONTRACT_VERSION = 'erc721a';

export const useDeployContractForm = () => {
	const history = useHistory();

	const { addToast } = useToast();
	const { setContract, contract, setContracts, contracts } = useContract();

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
		redirectToDetailsPage: false,
		redirectToSuccessPage: false,
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

	const { form: deployContractForm, setFormState: setDeployContractFormState } = useForm({
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

	const [createContract, { loading }] = useCreateContract({
		onCompleted: (data) => {
			addToast({
				severity: 'success',
				message: 'Smart contract successfully created',
			});

			setContracts([...contracts, data?.createContract]);

			setContract(data?.createContract);
			setContractState(data?.createContract);

			if (state.redirectToSuccessPage || state.redirectToDetailsPage) {
				handleRedirect(data?.createContract?.id);
			}

			posthog.capture('User created contract');
		}
	});

	const [updateContractDetails] = useUpdateContractDetails({
		onCompleted: (data) => {
			addToast({
				severity: 'success',
				message: 'Smart contract updated successfully!',
			});
			setContract({ ...contract, ...data?.updateContractDetails });
			setContractState(data?.updateContractDetails);

			if (state.redirectToSuccessPage || state.redirectToDetailsPage) {
				handleRedirect(data?.updateContractDetails?.id);
			}
			posthog.capture('User updated contract details');
		}
	});

	const handleRedirect = (id) => {
		if (state.redirectToSuccessPage) {
			history.push(`/smart-contracts/v2/${id}/deploy/success`);
			return;
		}
		history.push(`/smart-contracts/v2/${id}`);
	};

	const onError = (err) => {
		addToast({ severity: 'error', message: err?.message });
		setIsDeploying(false);
		setIsSaving(false);
	};

	const setFormValidationErrors = () => {
		const { name, symbol, maxSupply, price } = deployContractForm;
		setState(prevState => ({
			...prevState,
			formValidationErrors: {
				name: name.value ? null : true,
				symbol: symbol.value ? null : true,
				maxSupply: maxSupply.value && Number(maxSupply.value) > 0 ? null : true,
				price: price.value && Number(price.value) > 0 ? null : true,
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
	 * Deploy contract to blockchain
	 */
	const deployContract = async (walletController) => {
		console.log('walletController', walletController);
		
		const { name, symbol, maxSupply } = deployContractForm;

		// validate form
		if (!name.value || !symbol.value || !maxSupply.value || Number(maxSupply.value) <= 0) {
			setFormValidationErrors();
			return;
		}

		try {
			const walletAddress = walletController.state.address;
			if (!walletAddress) {
				throw new Error('Wallet not connected!');
			}

			// set redirect page on Success
			setState(prevState => ({ ...prevState, redirectToSuccessPage: true }));

			setIsDeploying(true);
			addToast({
				severity: 'info',
				message: 'Deploying contract to Ethereum. This might take a couple of seconds...',
			});

			// get the blockchain type on the basis of isTestnetEnabled 
			const blockchain = getBlockchainType(state.activeBlockchain, state.isTestnetEnabled);

			const contractController = new ContractController(null, blockchain, CONTRACT_VERSION);
			console.log(contractController, 'contractController');

			// switch network to testnet
			await walletController.compareNetwork(blockchain, async (error) => {
				if (error) {
					onError(error);
					return;
				}

				// deploy contract
				// No need to update price user can update the price later when they open public sales, This will save GAS
				const deployedContract = await contractController.deployContract(
					walletAddress,
					name.value,
					symbol.value,
					maxSupply.value,
					e => onError(e)
				);

				if (!deployedContract) {
					onError(new Error("Error! Something went wrong unable to deploy contract."));
					return;
				}

				const contractAddress = deployedContract.options.address;
				// Update backend
				if (state.contractState?.id) {
					updateContract(state.contractState?.id, contractAddress);
					return;
				}

				// Save contract details in backend
				saveContract(contractAddress);
			});
		} catch (e) {
			console.log(e, 'Error! deploying contract.');
			onError(e);
		}
	}

	/**
	 * Creates contract in backend
	 */
	const saveContract = async (contractAddress) => {
		const blockchain = getBlockchainType(state.activeBlockchain, state.isTestnetEnabled);
		const { name, symbol, maxSupply, price } = deployContractForm;

		// validate form
		if (!name.value || !symbol.value || !maxSupply.value || Number(maxSupply.value) <= 0 || Number(price.value) <= 0) {
			setFormValidationErrors();
			return;
		}

		setIsSaving(true);

		// set redirect page on Success
		setState(prevState => ({ ...prevState, redirectToDetailsPage: true }));

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
			await createContract({ variables: { contract: contractInput } });
			setIsSaving(false);
		} catch (err) {
			console.log(err);
			onError(new Error("Error Saving contract details. Please contact an administrator."));
		}
	};

	/**
	 * Update contract in backend
	 */
	const updateContract = async (contractId, contractAddress) => {
		if (!state.contractState.id) {
			onError(new Error("Error! Contract id missing."));
			return
		}

		const blockchain = getBlockchainType(state.activeBlockchain, state.isTestnetEnabled);
		const { name, symbol, maxSupply, price } = deployContractForm;

		// validate form
		if (!name.value || !symbol.value || !maxSupply.value || Number(maxSupply.value) <= 0 || Number(price.value) <= 0) {
			setFormValidationErrors();
			return;
		}

		setIsSaving(true);

		try {
			const contractInput = {
				name: name.value,
				symbol: symbol.value,
				blockchain,
				price: parseFloat(price.value),
				size: parseInt(maxSupply.value),
				currency: getBlockchainCurrency(blockchain),
				address: contractAddress || ''
			};
			await updateContractDetails({ variables: { ...contractInput, id: contractId } });
			setIsSaving(false);
		} catch (err) {
			console.log(err);
			onError(new Error("Error Saving contract details. Please contact an administrator."));
		}
	};

	const setActiveBlockchain = (activeBlockchain) => setState(prevState => ({ ...prevState, activeBlockchain }));

	const setIsTestnetEnabled = (isTestnetEnabled) => setState(prevState => ({ ...prevState, isTestnetEnabled }));

	const setIsDeploying = (isDeploying) => setState(prevState => ({ ...prevState, isDeploying }));
	const setIsSaving = (isSaving) => setState(prevState => ({ ...prevState, isSaving }));

	const setContractState = (contractState) => setState(prevState => ({ ...prevState, contractState: { ...prevState.contractState, ...contractState } }));

	return {
		...state,
		deployContractForm,
		deployContract,
		saveContract,
		updateContract,
		onError,
		setActiveBlockchain,
		setIsTestnetEnabled,
		setContractState,
		setDeployContractFormState
	};
};
