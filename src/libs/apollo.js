import React from 'react';
import { setContext } from "apollo-link-context"
import { useAuth } from 'libs/auth';
import {
    ApolloClient,
    ApolloProvider,
    createHttpLink,
    InMemoryCache,
} from "@apollo/client";
import config from 'config'

export const AuthorizedApolloProvider = ({ children }) => {
	const { token } = useAuth();

	const httpLink = createHttpLink({
		uri: config.serverUrl + '/graphql',
	});


	const authLink = setContext((_, { headers }) => {
		if (token) {
			return {
				headers: {
					...headers,
					authorization: "Bearer " + token,
				},
			};
		} else {
			return headers;
		}
	});
	
	const apolloClient = new ApolloClient({
		link: authLink.concat(httpLink),
		cache: new InMemoryCache()
	});

	return (
		<ApolloProvider client={apolloClient}>
			{ children }
		</ApolloProvider>
	)
};

