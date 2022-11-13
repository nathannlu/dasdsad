import React, { useState, useContext } from 'react';
import { useAnalytics } from 'libs/analytics';
//import { useWebsite } from 'libs/website';
//import { setAuthToken } from './api';

/*
export interface AuthContextType {
	isAuthenticated: boolean;
	user: any;
	token: string | null;
	onLoginSuccess(payload: {user: any; token: any}): void;
	logout(): void;
	loading: boolean;
	onReauthenticationSuccess(payload: {user: any; token: any}): void;
};
*/

export const AuthContext = React.createContext({});
export const useAuth = () => useContext(AuthContext);

const TOKEN_KEY = 'token';

export const AuthProvider = ({ children }) => {
    //	const { setWebsite } = useWebsite();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
	const { trackUserLoggedIn } = useAnalytics();

    const setAuthTokenInLocalStorage = (authToken) => {
        //setAuthToken(authToken)
        authToken
            ? window.localStorage.setItem(TOKEN_KEY, authToken)
            : window.localStorage.removeItem(TOKEN_KEY);
    };

    const onLoginSuccess = ({ user, token }) => {
        setAuthTokenInLocalStorage(token);
				trackUserLoggedIn('email')
        setUser(user);
    };

    const onReauthenticationSuccess = ({
        id,
        address,
        email,
        name,
        stripeCustomerId,
    }) => {
        if (!user) {
            setUser({
                id,
                address,
                email,
                name,
                stripeCustomerId,
            });
        }
        setLoading(false);
    };

    const onReauthenticationError = () => {
        setUser(null);
        setLoading(false);
    };

    const logout = () => {
        setAuthTokenInLocalStorage(null);
        setUser(null);
        window.localStorage.removeItem('ambition-wallet');
        //setWebsite({});
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated:
                    !!user && !!window.localStorage.getItem(TOKEN_KEY),
                user,
                onLoginSuccess,
                logout,
                loading,
                onReauthenticationSuccess,
                onReauthenticationError,
            }}>
            {children}
        </AuthContext.Provider>
    );
};
