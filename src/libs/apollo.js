import React, { useEffect, useState, useRef } from 'react';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';
import { useAuth } from 'libs/auth';
import {
    ApolloClient,
    ApolloProvider,
    createHttpLink,
    InMemoryCache,
} from '@apollo/client';
import config from '../config';

export const AuthorizedApolloProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();

    const httpLink = createHttpLink({
        uri: config?.serverUrl + '/graphql',
    });

    const uploadLink = createUploadLink({
        uri: config?.serverUrl + '/graphql',
    });

    const getAuthLink = () =>
        setContext((_, { headers }) => {
            // we'll directly grab the token from localstorage as the compiler doesn't waits until the token is set in state
            const token = window.localStorage.getItem('token');
            if (token) {
                return {
                    headers: {
                        ...headers,
                        authorization: 'Bearer ' + token,
                    },
                };
            } else {
                return headers;
            }
        });

    const apolloClient = new ApolloClient({
        link: getAuthLink().concat(uploadLink),
        cache: new InMemoryCache(),
    });

    const apolloClientRef = useRef(apolloClient);

    // update the headers
    useEffect(() => {
        apolloClientRef.current = new ApolloClient({
            link: getAuthLink().concat(uploadLink),
            cache: new InMemoryCache(),
        });
    }, [isAuthenticated]);

    return (
        <ApolloProvider client={apolloClientRef.current}>
            {children}
        </ApolloProvider>
    );
};
