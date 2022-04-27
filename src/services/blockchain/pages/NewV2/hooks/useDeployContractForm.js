import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';
import { useHistory } from 'react-router-dom';
import { useCreateContract } from 'services/blockchain/gql/hooks/contract.hook';
import { ContractController } from 'controllers/contract/ContractController';
import { WalletController } from 'controllers/WalletController';
import posthog from 'posthog-js';

export const useDeployContractForm = () => {
	const blockchain = 'rinkeby';
	const contractController = new ContractController(null, blockchain, 'erc721a');
	const walletController = new WalletController();
	const { addToast } = useToast();
	const history = useHistory();
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
	const deployOnRinkeby = async () => {
		const { name, symbol, maxSupply } = deployContractForm;
		const from = '0xfd6c3bD6dB6D7cbB77Ee64d1E406B2ACB63A5166';

		try {
			// switch network to testnet
			await walletController.compareNetwork("rinkeby", async () => {
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
			})

		} catch (e) {
			onError(e);
		}
	};

	/**
	 * Creates contract in backend
	 */
	const onCreateContract = async (contractAddress) => {
		const { name, symbol, maxSupply } = deployContractForm;

		try {
			const currencyMap = {
				ethereum: 'eth',
				rinkeby: 'eth',
				polygon: 'matic',
				mumbai: 'matic',
				solana: 'sol',
				solanadevnet: 'sol',
			};

			const ContractInput = {
				name: name.value,
				symbol: symbol.value,
				address: contractAddress,
				blockchain,
				type: 'erc721a',
				nftCollection: {
					//                    price: parseFloat(priceInEth.value),
					size: parseInt(maxSupply.value),
					currency: currencyMap[blockchain],
				},
			};
			await createContract({ variables: { contract: ContractInput } });
		} catch (err) {
			onError(new Error("Transaction succeeded but failed to update backend. Please contact an administrator."));
		}
	};

	return {
		deployContractForm,
		onDeploy,
		onError,
		deployOnRinkeby,
	};
};
