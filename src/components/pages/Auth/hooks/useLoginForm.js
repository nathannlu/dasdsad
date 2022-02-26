import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'ds/hooks/useForm';
import { useAuth } from 'libs/auth'; 
import { useToast } from 'ds/hooks/useToast'; 

export const useLoginForm = () => {
	const { isAuthenticated } = useAuth();
	const { addToast } = useToast();
	const history = useHistory();
	const searchParams = new URLSearchParams(location.search);
	const redirect = searchParams.get("redirect");

	const { form: loginForm } = useForm({
		email: {
			default: '',
			placeholder: 'Email',
			rules: []
		},
		password: {
			default: '',
			placeholder: 'Password',
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
        if (!history) return;
		history.push(redirect ?? "/dashboard");
	}

	const handleLoginSuccess = async () => {
		handleRedirect();
	}

	// Handle existing JWT token
	useEffect(() => {
		if (location.pathname == '/login' && isAuthenticated) {
			handleRedirect();
		}
	}, [isAuthenticated])

	return {
		loginForm,
		handleRedirect,
		handleLoginError,
		handleLoginSuccess,
		redirect
	}
}
