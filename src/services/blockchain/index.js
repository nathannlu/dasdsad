import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { createBrowserHistory } from 'history';
import { DeployProvider } from './provider';
import Routes from './routes';

const BlockchainService = () => {
	const history = createBrowserHistory();

	return (
		<>
		<Helmet>
			<title>
				Blockchain - Ambition
			</title>
			<link rel="canonical" href="https://app.ambition.so" />
			<meta name="description" content="Generate thousands of digital arts online - The simplest way." />
		</Helmet>

		<DeployProvider>
			<Router history={history}>
				<Routes />
			</Router>
		</DeployProvider>
		</>
	);
};


export default BlockchainService;
