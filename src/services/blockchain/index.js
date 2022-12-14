import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import { useGetContracts } from 'services/blockchain/gql/hooks/contract.hook';
import { ContractProvider } from './provider';
import Routes from './routes';

const BlockchainService = () => {
    const history = useHistory();
    useGetContracts({});
    
    return (
        <React.Fragment>
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
        </React.Fragment>
    );
};

const Main = () => (
    <ContractProvider>
        <BlockchainService />
    </ContractProvider>
);

export default Main;
