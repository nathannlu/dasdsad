import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';
import { useDeploy } from 'libs/deploy'

export const useDeployContractForm = () => {
	/*
	const { form: deployContractForm } = useForm({
		priceInEth: {
			default: '',
			placeholder: '0.05'
		},
		royaltyPercentage: {
			default: '',
			placeholder: 5
		},
		maxSupply: {
			default: '',
			placeholder: '3333'	
		}
	});
	*/
	const { addToast } = useToast();
	const { deployContractForm } = useDeploy();

	const onDeploy = () => {
		addToast({
			severity: 'info',
			message: 'Deploying contract to blockchain. This might take a couple of seconds...'
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
	
	const verifyStep1 = () => {
		if(deployContractForm.priceInEth.value.length < 1 || deployContractForm.maxSupply.value.length < 1) {
			addToast({
				severity: 'error',
				message: 'All fields must be filled in'
			})
			return false 
		} else {
			return true
		}
	}

	const verifyStep2 = (files) => {
		if(files.length !== parseInt(deployContractForm.maxSupply.value)) {
			addToast({
				severity: 'warning',
				message: 'Are you sure you added the correct amount of files?'
			})
			return false;
		} else {
			addToast({
				severity: 'success',
				message: 'Files imported successfully'
			})
			return true;
		}
	}

	const verifyStep3 = (files) => {
		if(files.length !== parseInt(deployContractForm.maxSupply.value) + 1) {
			addToast({
				severity: 'warning',
				message: 'Are you sure you added the correct amount of files?'
			})
			return false;
		} else {
			addToast({
				severity: 'success',
				message: 'Files imported successfully'
			})
			return true;
		}
	}
	
	return {
		deployContractForm,
		onDeploy,
		onCompleted,
		onError,
		verifyStep1, verifyStep2, verifyStep3
	}
}
