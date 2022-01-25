import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { createBrowserHistory } from 'history';
import { WebsiteProvider } from './provider';
import { useGetWebsites } from 'services/website/gql/hooks/website.hook';
import Routes from './routes';

const WebsiteService = () => {
	const history = createBrowserHistory();
	useGetWebsites();

	return (
		<>
		<Helmet>
			<title>
				Websites - Ambition
			</title>
			<link rel="canonical" href="https://app.ambition.so" />
			<meta name="description" content="Generate thousands of digital arts online - The simplest way." />
		</Helmet>

		<WebsiteProvider>
			<Router history={history}>
				<Routes />
			</Router>
		</WebsiteProvider>
		</>
	);
};


export default WebsiteService;
