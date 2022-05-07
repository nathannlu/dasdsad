import { useState } from 'react';
import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';
import { useHistory } from 'react-router-dom';
import { useCreateContract } from 'services/blockchain/gql/hooks/contract.hook';
import { useContract } from 'services/blockchain/provider';

// import { ContractController, getBlockchainType, getBlockchainCurrency } from 'controllers/contract/ContractController';
// import { WalletController } from 'controllers/wallet/WalletController';

import { ContractController, WalletController, getBlockchainType, getBlockchainCurrency } from '@yaman-apple-frog/controllers';

import posthog from 'posthog-js';

const CONTRACT_VERSION = 'erc721a';

export const useDeployContractForm = () => {
	const { setContract } = useContract();
	const [state, setState] = useState({
		formValidationErrors: {
			name: null,
			symbol: null,
			maxSupply: null
		},
		activeFocusKey: 'NAME', // default,
		activeBlockchain: 'ethereum', // default,
		isTestnetEnabled: false,
		isLoading: false
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
			posthog.capture('User created contract');
			handleRedirect(data?.createContract?.id);
		}
	});

	const { form: deployContractForm } = useForm({
		name: {
			default: '',
			placeholder: 'Bored Ape Yacht Club',
		},
		symbol: {
			default: '',
			placeholder: 'BAYC',
		},
		maxSupply: {
			default: '',
			placeholder: '3,333',
		},
	});

	const onDeploy = () => {
		addToast({
			severity: 'info',
			message:
				'Deploying contract to Ethereum. This might take a couple of seconds...',
		});
	};

	const handleRedirect = (id) => {
		history.push(`/smart-contracts/v2/${id}/deploy/success`);
	};

	const onError = (err) => {
		addToast({
			severity: 'error',
			message: err.message,
		});
		setLoading(false);
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

		onDeploy();
		setLoading(true);
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
				const deployedContract = await contractController.deployContract(
					from,
					name.value,
					symbol.value,
					maxSupply.value,
					e => onError(e)
				);

				// Update backend
				if (deployedContract) {
					setState(prevState => ({ ...prevState, contractAddress: deployedContract.options.address }));
					onCreateContract(deployedContract.options.address);
				}
			});
		} catch (e) {
			console.log(e, '3');
			onError(e);
		}
	}

	/**
	 * Creates contract in backend
	 */
	const onCreateContract = async (contractAddress) => {
		const blockchain = getBlockchainType(state.activeBlockchain, state.isTestnetEnabled);
		const { name, symbol, maxSupply } = deployContractForm;

		try {
			const ContractInput = {
				name: name.value,
				symbol: symbol.value,
				address: contractAddress,
				blockchain,
				type: CONTRACT_VERSION,
				nftCollection: {
					// price: parseFloat(priceInEth.value), // @TODO savein DB too it is going to be always 1 SOL or 1 ETH
					size: parseInt(maxSupply.value),
					currency: getBlockchainCurrency(blockchain)
				},
			};
			await createContract({ variables: { contract: ContractInput } });
			setLoading(false);
		} catch (err) {
			onError(new Error("Transaction succeeded but failed to update backend. Please contact an administrator."));
		}
	};

	/**
	 * set the focus key: 'NAME' | 'SYMBOL' | 'MAX_SUPPLY'
	 * on the basis of respective activeFocusKey we show description on the right-hand side of the form  
	 */
	const setActiveFocusKey = (activeFocusKey) => setState(prevState => ({ ...prevState, activeFocusKey }));

	const setActiveBlockchain = (activeBlockchain) => setState(prevState => ({ ...prevState, activeBlockchain }));

	const setIsTestnetEnabled = (isTestnetEnabled) => setState(prevState => ({ ...prevState, isTestnetEnabled }));

	const setLoading = (isLoading) => setState(prevState => ({ ...prevState, isLoading }));

	return {
		...state,
		deployContractForm,
		deployContract,
		onDeploy,
		onError,
		setActiveFocusKey,
		setActiveBlockchain,
		setIsTestnetEnabled
	};
};
