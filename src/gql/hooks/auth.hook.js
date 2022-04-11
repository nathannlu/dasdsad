import { useAuth } from '../../libs/auth';

import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { FORGOT_PASSWORD, RESET_PASSWORD, VALIDATE_TOKEN } from '../auth.gql';

// Sends password reset email
export const useForgotPassword = ({ email, onCompleted, onError }) => {
    const [sendPasswordResetEmail, { ...queryResult }] = useLazyQuery(
        FORGOT_PASSWORD,
        {
            fetchPolicy: 'network-only',
            variables: { email },
            onCompleted,
            onError,
        }
    );

    return [sendPasswordResetEmail, { ...queryResult }];
};

// Reset password logic query
export const useResetPassword = ({ token, password, onCompleted, onError }) => {
    const [resetPassword, { ...mutationResult }] = useMutation(RESET_PASSWORD, {
        variables: { token, password },
        onCompleted,
        onError,
    });

    return [resetPassword, { ...mutationResult }];
};

// Used to validate token in reset password link
export const useValidateToken = ({ token, onCompleted, onError }) => {
    const { ...queryResult } = useQuery(VALIDATE_TOKEN, {
        variables: { token },
        onCompleted,
        onError,
    });

    return { ...queryResult };
};
