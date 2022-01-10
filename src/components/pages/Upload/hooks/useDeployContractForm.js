import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';

export const useDeployContractForm = () => {
	const { form: deployContractForm } = useForm({
		baseURI: {
			default: '',
			placeholder: 'Enter deployed metadata IPFS url here'
		},
		priceInEth: {
			default: '',
			placeholder: '0.05'
		},
		maxSupply: {
			default: '',
			placeholder: '3333'	
		}
	});
	const { addToast } = useToast();

	const onDeploy = () => {
		addToast({
			severity: 'info',
			message: 'Deploying contract to Ethereum. This might take a couple of seconds...'
		})
	}

	const onCompleted = () => {
		addToast({
			severity: 'success',
			message: 'Smart contract successfully deployed'
		})
	}

	const onError = err => {
		addToast({
			severity: 'error',
			message: err.message
		})
	}
	
	return {
		deployContractForm,
		onDeploy,
		onCompleted,
		onError,
	}
}
