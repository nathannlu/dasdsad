import React, { useState, useContext }  from 'react';
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

const TOKEN_KEY = "token";



export const AuthProvider = ({ children }) => {
//	const { setWebsite } = useWebsite();

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState();
	const [token, setToken] = useState(window.localStorage.getItem(TOKEN_KEY))
	const [loading, setLoading] = useState(true);

	const updateToken = (t) => {
		setToken(t)	
		//setAuthToken(t)
		t
			? window.localStorage.setItem(TOKEN_KEY, t)
			: window.localStorage.removeItem(TOKEN_KEY)
	}

	const onLoginSuccess = ({ user, token }) => {
		updateToken(token);	
		setUser(user);

		setIsAuthenticated(true);
	}

	// @TODO
	// This function currently runs three times
	// also user keeps getting set if there is no check
	const onReauthenticationSuccess = ({uid, address, email, name, stripeCustomerId}) => {

		if(!user) {
			setUser({
				uid,
				address,
				email,
				name,
				stripeCustomerId
			});
		}
			
		setIsAuthenticated(true);
		setLoading(false);
	}

	const onReauthenticationError = () => {
		setToken(null);
		setLoading(false);
	}

	const logout = () => {
		updateToken(null);
		setUser(null);
		//setWebsite({});
		setIsAuthenticated(false);
	}

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				user,
				token,
				onLoginSuccess,
				logout,
				loading,
				onReauthenticationSuccess,
				onReauthenticationError,
			}}
		>
			{ children }
		</AuthContext.Provider>
	)
}
