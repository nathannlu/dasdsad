import React from 'react';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ContractProvider } from './provider';
import { useGetContracts } from 'services/blockchain/gql/hooks/contract.hook';
import Routes from './routes';

const BlockchainService = () => {
    const history = useHistory();
    useGetContracts({});

    return (
        <>
            <Helmet>
                <title>Blockchain - Ambition</title>
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

const Main = () => (
    <ContractProvider>
        <BlockchainService />
    </ContractProvider>
);

export default Main;
