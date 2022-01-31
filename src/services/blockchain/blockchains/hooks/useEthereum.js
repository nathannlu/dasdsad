import Web3 from 'web3/dist/web3.min';
import { useCreateContract } from 'services/blockchain/gql/hooks/contract.hook';
import { useWeb3 } from 'libs/web3';
import { useContract } from 'services/blockchain/provider';
import { useDeployContractForm } from 'services/blockchain/pages/New/hooks/useDeployContractForm';
import { useToast } from 'ds/hooks/useToast';
import NFTCollectible from 'services/blockchain/blockchains/ethereum/abis/NFTCollectible.json';

export const useEthereum = () => {
	const { deployContractForm } = useDeployContractForm();
	const { account } = useWeb3()
	const { setLoading, setError, setStart } = useContract();
	const { addToast } = useToast();
	const [createContract] = useCreateContract({
		onCompleted: () => {
			addToast({
				severity: 'success',
				message: `Contract deployed.`
			})	
			setStart(false);
			setLoading(false)
			setError(false);
		},
		onError: err => {
			addToast({
				severity: 'error',
				message: `Contract successfully deployed, however was not saved in our server. Please contact an administrator. Error: ${err.message}`
			})	
			setError(true);
		}
	});

	const handleDeploymentError = (err) => {
		addToast({
			severity: 'error',
			message: err.message
		});
		setLoading(false)
		setError(true);
	}

	// @TODO update baseUri & blockchain
	const handleDeploymentSuccess = async (newContractAddress) => {
		const ContractInput = {
			address: newContractAddress,
			blockchain: "ethereum",
			nftCollection: {
				price: parseFloat(deployContractForm.priceInEth.value),
				currency: 'eth',
				size: parseInt(deployContractForm.maxSupply.value),
				royalty: parseInt(deployContractForm.royaltyPercentage.value),
				baseUri: deployContractForm.ipfsLink.value
			}
		}

		// @TODO handle if saving contract fails
		await createContract({ variables: { contract: ContractInput} });
	}

	const deployEthereumContract = async () => {
		try {
			const web3 = window.web3;
			const contract = new web3.eth.Contract(NFTCollectible.abi);
			const priceInWei = web3.utils.toWei(deployContractForm.priceInEth.value);
			const options = {
				data: NFTCollectible.bytecode,
				arguments: [deployContractForm.ipfsLink.value, priceInWei, deployContractForm.maxSupply.value]
			}
			const senderInfo = {
				from: account,
			}

			contract
			.deploy(options)
			.send(senderInfo, (err, txnhash) => {
				if(err) {
					handleDeploymentError(err)
				} else {
					addToast({
						severity: 'info',
						message: "Deploying contract... should take a couple of seconds"
					});
				}
			})
			.on('error', err => handleDeploymentError(err))
			.then(async newContractInstance => handleDeploymentSuccess(newContractInstance.options.address));
		} catch (e) {
			handleDeploymentError(e)
		}
	};
	
	return {
		deployEthereumContract
	}
}
