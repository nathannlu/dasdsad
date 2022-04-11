import React from 'react';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { WebsiteProvider } from './provider';
import { useGetWebsites } from 'services/website/gql/hooks/website.hook';
import Routes from './routes';

const WebsiteService = () => {
    const history = useHistory();
    useGetWebsites();

    return (
        <>
            <Helmet>
                <title>Websites - Ambition</title>
                <link rel="canonical" href="https://app.ambition.so" />
                <meta
                    name="description"
                    content="Generate thousands of digital arts online - The simplest way."
                />
            </Helmet>

            <Router history={history}>
                <Routes />
            </Router>
        </>
    );
};

const Main = () => {
    return (
        <WebsiteProvider>
            <WebsiteService />
        </WebsiteProvider>
    );
};

export default Main;
