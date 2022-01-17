import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'ds/hooks/useForm';
import { useAuth } from 'libs/auth'; 
import { useToast } from 'ds/hooks/useToast'; 

export const useLoginForm = () => {
	const { isAuthenticated } = useAuth();
	const { addToast } = useToast();
	const history = useHistory();

	const { form: loginForm } = useForm({
		email: {
			default: '',
			rules: []
		},
		password: {
			default: '',
			rules: []
		}
	})

	const handleLoginError = (err) => {
		addToast({
			severity: 'error',
			message: err.message
		});
	}

	const handleRedirect = () => {
		history.push('/dashboard');
	}

	// Handle existing JWT token
	useEffect(() => {
		if(isAuthenticated) {
			handleRedirect();
		}
	}, [isAuthenticated])

	return {
		loginForm,
		handleRedirect,
		handleLoginError
	}
}
