import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';

export const useForgotPasswordForm = () => {
    const { addToast } = useToast();
    const { form: forgotPasswordForm } = useForm({
        email: {
            default: '',
            rules: [],
        },
    });

    const onCompleted = () => {
        addToast({
            severity: 'success',
            message: 'Please check your email to reset your password',
        });
    };

    const onError = (err) => {
        addToast({
            severity: 'error',
            message: err.message,
        });
    };

    return {
        forgotPasswordForm,
        onCompleted,
        onError,
    };
};
