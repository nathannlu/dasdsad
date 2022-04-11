import { useForm } from 'ds/hooks/useForm';
import { useHistory } from 'react-router-dom';
import { useToast } from 'ds/hooks/useToast';

export const useResetPasswordForm = () => {
    const { addToast } = useToast();
    const history = useHistory();
    const { form: resetPasswordForm } = useForm({
        newPassword: {
            default: '',
            rules: [],
        },
        confirmPassword: {
            default: '',
            rules: [],
        },
    });

    const validatePassword = () => {};

    const onCompleted = () => {
        addToast({
            severity: 'success',
            message: 'Success! Your password has been changed.',
        });

        history.push('/login');
    };

    const onError = (err) => {
        addToast({
            severity: 'error',
            message: err.message,
        });
    };

    return {
        resetPasswordForm,
        onCompleted,
        onError,
    };
};
