import { useState } from 'react';
import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';
import { useHistory } from 'react-router-dom';
import { useCreateContract } from 'services/blockchain/gql/hooks/contract.hook';
import { ContractController, getBlockchainType, blockchainCurrencyMap } from 'controllers/contract/ContractController';
import { WalletController } from 'controllers/wallet/WalletController';
import posthog from 'posthog-js';

const CONTRACT_VERSION = 'erc721a';

export const useDeployContractForm = () => {

	const [state, setState] = useState({
		activeFocusKey: 'NAME', // default,
		activeBlockchain: 'ethereum', // default,
		isTestnetEnabled: false
	});

	const walletController = new WalletController();
	const { addToast } = useToast();
	const history = useHistory();

	// @TODO show loading on FE
	const [createContract, { loading }] = useCreateContract({
		onCompleted: (data) => {
			addToast({
				severity: 'success',
				message: 'Smart contract successfully created',
			});
			posthog.capture('User created contract');
			handleRedirect(data?.createContract?.id);
		},
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
	};

	/**
	 * Deploy contract to blockchain
	 */

	const deployContract = async () => {
		// get the blockchain type on the basis of isTestnetEnabled 
		const blockchain = getBlockchainType(state.activeBlockchain, state.isTestnetEnabled);

		const contractController = new ContractController(null, blockchain, CONTRACT_VERSION);
		const { name, symbol, maxSupply } = deployContractForm;

		// @TODO get the from wallet address from the wallet controller
		const from = '0xfd6c3bD6dB6D7cbB77Ee64d1E406B2ACB63A5166';

		try {
			// switch network to testnet
			await walletController.compareNetwork(blockchain, async () => {
				// deploy contract
				const deployedContract = await contractController.deployContract(
					from,
					name.value,
					symbol.value,
					maxSupply.value
				);

				// Update backend
				if (deployedContract) {
					onCreateContract(deployedContract.options.address);
				}
			});
		} catch (e) {
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
					// price: parseFloat(priceInEth.value), // no need it is going to be always 1 SOL or 1 ETH
					size: parseInt(maxSupply.value),
					currency: blockchainCurrencyMap[blockchain]
				},
			};
			await createContract({ variables: { contract: ContractInput } });
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

	return {
		activeFocusKey: state.activeFocusKey,
		activeBlockchain: state.activeBlockchain,
		isTestnetEnabled: state.isTestnetEnabled,
		deployContractForm,
		deployContract,
		onDeploy,
		onError,
		setActiveFocusKey,
		setActiveBlockchain,
		setIsTestnetEnabled
	};
};
