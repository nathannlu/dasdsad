import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'ds/hooks/useForm';
import { useAuth } from 'libs/auth';
import { useToast } from 'ds/hooks/useToast';

export const useSignupForm = () => {
    const { isAuthenticated } = useAuth();
    const { addToast } = useToast();
    const history = useHistory();
    const searchParams = new URLSearchParams(location.search);
    const redirect = searchParams.get('redirect');
    const { form: signupForm } = useForm({
        email: {
            default: '',
            placeholder: 'vitalik@ethereum.org',
            rules: [],
        },
        name: {
            default: '',
            placeholder: 'Vitalik Buterin',
        },
        password: {
            default: '',
            placeholder: '',
            rules: [],
        },
    });

    const handleRedirect = () => {
        history.push('/dashboard');
    };

    const onCompleted = () => {
        addToast({
            severity: 'success',
            message: 'Success! Login with your new account',
        });

        history.push(redirect ? `/login?redirect=${redirect}` : '/login');
    };

    const handleSignupError = (err) => {
        addToast({
            severity: 'error',
            message: err.message,
        });
    };

    // Check if user is logged in
    useEffect(() => {
        if (isAuthenticated) {
            handleRedirect();
        }
    }, [isAuthenticated]);

    return {
        signupForm,
        handleRedirect,
        handleSignupError,
        onCompleted,
        redirect,
    };
};
