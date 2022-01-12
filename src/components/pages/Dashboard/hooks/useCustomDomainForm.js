import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';

export const useCustomDomainForm = () => {
	const { form: customDomainForm } = useForm({
		domainName: {
			default: '',
			placeholder: 'domain.com',
			rules: [],
		},
	});
	const { addToast } = useToast();

	const onCompleted = () => {
		addToast({
			severity: 'success',
			message: 'Success! Added custom domain'
		})
	}

	const onError = err => {
		addToast({
			severity: 'error',
			message: err.message
		})
	}
	
	return {
		customDomainForm,
		onCompleted,
		onError,
	}
}
