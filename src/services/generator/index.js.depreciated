import React from 'react';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CollectionProvider } from './provider';
import { useGetCollections } from 'services/generator/gql/hooks/collection.hook';
import Routes from './routes';

const GeneratorService = () => {
	const history = useHistory();
	useGetCollections()

	return (
		<>
		<Helmet>
			<title>
				Collections - Ambition
			</title>
			<link rel="canonical" href="https://app.ambition.so" />
			<meta name="description" content="Generate thousands of digital arts online - The simplest way." />
		</Helmet>

		<Router history={history}>
			<Routes />
		</Router>
		</>
	);
};

const Main = () => {
	return (
		<CollectionProvider>
			<GeneratorService />
		</CollectionProvider>
	)
};


export default Main;
