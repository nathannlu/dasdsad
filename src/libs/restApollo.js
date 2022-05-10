import React, { useContext } from 'react';
import { useAuth } from 'libs/auth';

const TOKEN_KEY = 'token';

export const RestApolloContext = React.createContext({});
export const useRestApollo = () => useContext(RestApolloContext);

export const RestApolloProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();

    const getHeaders = () => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const token = window.localStorage.getItem(TOKEN_KEY);
        if (isAuthenticated && token) {
            headers.append('authorization', `Bearer ${token}`);
        }
        return headers;
    }

    const url = process.env.CONFIG === 'dev' || process.env.NODE_ENV === 'development' && 'http://localhost:5000/graphql' || 'https://api.ambition.so/main/graphql';

    const fetch = async (query, variables) => {
        console.log(url, 'url');

        try {
            const response = await fetch(url, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ query, variables }) });
            const responseBody = await response.json();
            return responseBody;
        } catch (e) {
            console.error(e, 'ERROR fetching results from apollo query!');
        }
        return null;
    }

    return (
        <RestApolloContext.Provider value={{ fetch }}>{children}</RestApolloContext.Provider>
    );
};
