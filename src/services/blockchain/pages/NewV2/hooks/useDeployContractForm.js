import { useState } from 'react';
import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';
import { useHistory } from 'react-router-dom';
import { useCreateContract, useUpdateContractDetails } from 'services/blockchain/gql/hooks/contract.hook';
import { useContract } from 'services/blockchain/provider';

import { ContractController, WalletController, getBlockchainType, getBlockchainCurrency } from '@ambition-blockchain/controllers';

import posthog from 'posthog-js';

const CONTRACT_VERSION = 'erc721a';

export const useDeployContractForm = () => {
	const { setContract, contract } = useContract();
	const [state, setState] = useState({
		formValidationErrors: {
			name: null,
			symbol: null,
			maxSupply: null
		},
		activeFocusKey: 'NAME', // default,
		activeBlockchain: 'ethereum', // default,
		isTestnetEnabled: true, // default
		isDeploying: false,
		isSaving: false,
		redirectOnSuccess: false,
		contractState: {
			id: null,
			name: null,
			symbol: null,
			address: null,
			blockchain: null,
			type: CONTRACT_VERSION,
			isNftRevealEnabled: true, // default
			nftCollection: {
				baseUri: null,
				unRevealedBaseUri: null,
				price: 1,
				size: null,
				currency: null
			},
		}
	});

	const walletController = new WalletController();
	const { addToast } = useToast();
	const history = useHistory();

	const [createContract, { loading }] = useCreateContract({
		onCompleted: (data) => {
			addToast({
				severity: 'success',
				message: 'Smart contract successfully created',
			});
			setContract(data?.createContract);
			setContractState(data?.createContract);

			if (state.redirectOnSuccess) {
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
			posthog.capture('User updated contract details');
		}
	});

	const { form: deployContractForm } = useForm({
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

	const handleRedirect = (id) => {
		history.push(`/smart-contracts/v2/${id}/deploy/success`);
	};

	const onError = (err) => {
		addToast({ severity: 'error', message: err?.message });
		setIsDeploying(false);
		setIsSaving(false);
	};

	const setFormValidationErrors = () => {
		const { name, symbol, maxSupply } = deployContractForm;
		setState(prevState => ({
			...prevState,
			formValidationErrors: {
				name: name.value ? null : true,
				symbol: symbol.value ? null : true,
				maxSupply: maxSupply.value && Number(maxSupply.value) > 0 ? null : true
			}
		}));

		// clear validation error after 3 seconds
		setTimeout(() => setState(prevState => ({
			...prevState,
			formValidationErrors: {
				name: null,
				symbol: null,
				maxSupply: null
			}
		})), 3000);
		return;
	}

	/**
	 * Deploy contract to blockchain
	 */
	const deployContract = async () => {
		const { name, symbol, maxSupply } = deployContractForm;

		// validate form
		if (!name.value || !symbol.value || !maxSupply.value || Number(maxSupply.value) <= 0) {
			setFormValidationErrors();
			return;
		}

		setState(prevState => ({ ...prevState, redirectOnSuccess: true }));
		setIsDeploying(true);
		addToast({
			severity: 'info',
			message: 'Deploying contract to Ethereum. This might take a couple of seconds...',
		});

		// get the blockchain type on the basis of isTestnetEnabled 
		const blockchain = getBlockchainType(state.activeBlockchain, state.isTestnetEnabled);

		const contractController = new ContractController(null, blockchain, CONTRACT_VERSION);

		console.log(contractController, 'contractController');

		// @TODO get the from wallet address from the wallet controller
		// const from = '0xfd6c3bD6dB6D7cbB77Ee64d1E406B2ACB63A5166';
		const from = '0x1ADb0A678F41d4eD91169D4b8A5B3C149b92Fc46';

		try {
			// switch network to testnet
			await walletController.compareNetwork(blockchain, async () => {
				// deploy contract
				// No need to update price user can update the price later when they open public sales, This will save GAS
				const deployedContract = await contractController.deployContract(
					from,
					name.value,
					symbol.value,
					maxSupply.value,
					e => onError(e)
				);

				if (!deployedContract) {
					onError(new Error("Error! Something went wrong unable to deploy contract."));
					return;
				}

				// Update backend
				saveContract(deployedContract.options.address);
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
		setIsSaving(true);

		const blockchain = getBlockchainType(state.activeBlockchain, state.isTestnetEnabled);
		const { name, symbol, maxSupply, price } = deployContractForm;

		// validate form
		if (!name.value || !symbol.value || !maxSupply.value || Number(maxSupply.value) <= 0) {
			setFormValidationErrors();
			return;
		}

		try {
			const contractInput = {
				name: name.value,
				symbol: symbol.value,
				address: contractAddress || null,
				blockchain,
				type: CONTRACT_VERSION,
				nftCollection: {
					price: parseInt(price.value || 1),
					size: parseInt(maxSupply.value),
					currency: getBlockchainCurrency(blockchain),
					// unRevealedBaseUri:,
					// baseUri
				},
			};
			await createContract({ variables: { contract: contractInput } });
			setIsSaving(false);
		} catch (err) {
			onError(new Error("Transaction succeeded but failed to update backend. Please contact an administrator."));
		}
	};

	/**
	 * Update contract in backend
	 */
	const updateContract = async () => {
		if (!state.contractState.id) {
			onError(new Error("Error! Contract id missing."));
			return
		}

		setIsSaving(true);

		const blockchain = getBlockchainType(state.activeBlockchain, state.isTestnetEnabled);
		const { name, symbol, maxSupply, price } = deployContractForm;
		try {
			const contractInput = {
				name: name.value,
				symbol: symbol.value,
				blockchain,
				nftCollection: {
					price: parseInt(price.value || 1),
					size: parseInt(maxSupply.value),
					currency: getBlockchainCurrency(blockchain)
				},
			};
			await updateContractDetails({ variables: { ...contractInput } });
			setIsSaving(false);
		} catch (err) {
			onError(new Error("Transaction succeeded but failed to update backend. Please contact an administrator."));
		}
	};

	const setActiveBlockchain = (activeBlockchain) => setState(prevState => ({ ...prevState, activeBlockchain }));

	const setIsTestnetEnabled = (isTestnetEnabled) => setState(prevState => ({ ...prevState, isTestnetEnabled }));

	const setIsNftRevealEnabled = (isNftRevealEnabled) => setState(prevState => ({ ...prevState, contractState: { ...prevState.contractState, isNftRevealEnabled } }));

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
		setIsNftRevealEnabled
	};
};
