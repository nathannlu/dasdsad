import { useState } from 'react';
import { useValidateToken } from 'gql/hooks/auth.hook';
import { useToast } from 'ds/hooks/useToast';
import qs from 'qs';

export const useAuthorizeResetPassword = (props) => {
    const { token } = qs.parse(props.location.search.substring(1));
    const [isTokenVerified, setIsTokenVerified] = useState(false);

    const { addToast } = useToast();
    const { loading } = useValidateToken({
        token,
        onCompleted: (data) => {
            setIsTokenVerified(data.validatePasswordResetLink);
        },
        onError: (err) => {
            setIsTokenVerified(false);
            addToast({
                severity: 'error',
                message: err.message,
            });
        },
    });

    return {
        token,
        loading,
        isTokenVerified,
    };
};
