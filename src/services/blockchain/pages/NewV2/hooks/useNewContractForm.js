import React, { useEffect } from 'react';
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
		isDeploying: false,
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
				message: 'Smart contract successfully created',
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
		setIsDeploying(false);
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
	const saveContract = async (contractAddress) => {
		const { name, symbol, maxSupply, price } = newContractForm;

		setIsDeploying(true);

		try {
			const contractInput = {
				name: name.value,
				symbol: symbol.value,
				address: contractAddress || '',
				blockchain: state.activeBlockchain,
				type: state.activeBlockchain === 'solanadevnet' ? 'whitelist' : CONTRACT_VERSION,
				nftCollection: {
					price: parseFloat(price.value),
					size: parseInt(maxSupply.value),
					currency: getBlockchainCurrency(state.activeBlockchain)
				}
			};
			console.log(contractInput)
			const response = await createContract({ variables: { contract: contractInput } });
			if (response?.data?.createContract?.type === CONTRACT_VERSION) {
				history.push(`/smart-contracts/v2/${response?.data?.createContract?.id}`);
			} else {
				history.push(`/smart-contracts/${response?.data?.createContract?.id}`);
			}
		} catch (err) {
			onError(new Error("Error Saving contract details. Please contact an administrator."));
		} finally {
			setIsDeploying(false);
		}
	};

	/**
	 * Deploy contract to blockchain
	 */
	const deployContract = async () => {
		try {
			const { name, symbol, maxSupply, price } = newContractForm;

			// validate form
			if (!name.value || !symbol.value || !maxSupply.value || Number(maxSupply.value) <= 0 || Number(price.value) < 0) {
				setFormValidationErrors();
				return;
			}

			if (state.activeBlockchain === 'solanadevnet') {
				if (!walletController.state.wallet || walletController.state.wallet !== 'phantom') {
					throw new Error('You must login with a phantom wallet to deploy a solana contract');
				}

				// Save contract details in backend
				await saveContract();
				return;
			}

			const walletAddress = walletController.state.address;
			if (!walletAddress) {
				throw new Error('Wallet not connected!');
			}

			setIsDeploying(true);
			addToast({
				severity: 'info',
				message: 'Deploying contract to blockchain. This might take a couple of seconds...',
			});

			// get the blockchain type on the basis of isTestnetEnabled 
			const contractController = new ContractController(null, state.activeBlockchain, CONTRACT_VERSION);

			// switch network to testnet
			await walletController.compareNetwork(state.activeBlockchain, async (error) => {
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

				// wait for some time allow contract to be saved
				await new Promise(resolve => setTimeout(resolve, 10 * 1000));

				const contractAddress = deployedContract.options.address;

				// Save contract details in backend
				await saveContract(contractAddress);

				posthog.capture('User successfully deployed contract to blockchain', {
					blockchain: state.activeBlockchain,
					version: '2'
				});
			});
		} catch (e) {
			console.log(e, 'Error! deploying contract.');
			onError(e);
		}
	}

	const setActiveBlockchain = (activeBlockchain) => setState(prevState => ({ ...prevState, activeBlockchain }));
	const setIsDeploying = (isDeploying) => setState(prevState => ({ ...prevState, isDeploying }));
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
		deployContract,
		onError,
		setActiveBlockchain,
		setContractState,
	};
}
