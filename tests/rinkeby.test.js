import React from 'react';
import '@testing-library/jest-dom';
import 'cross-fetch/polyfill';

import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";

import Layout from '../src/components/layout/Layout';

import { AuthorizedApolloProvider } from 'libs/apollo';
import { Web3Provider } from 'libs/web3';
import { AuthProvider } from 'libs/auth';
import { ToastManager } from 'ds/hooks/useToast';
import { CollectionProvider } from 'services/generator/provider';
import { ContractProvider } from 'services/blockchain/provider';

import NewV2 from 'services/blockchain/pages/NewV2';

import { createTheme } from '@mui/material';
import { ThemeProvider } from '@material-ui/core/styles';

jest.mock('react-router-dom', () => ({
    useLocation: jest.fn().mockReturnValue({
        pathname: '/another-route',
        search: '',
        hash: '',
        state: null,
        key: '5nvxpbdafa',
    })
}));

// jest.mock('@emotion/styled');
// jest.mock('@mui/styled-engine');
// jest.mock('@mui/system');
// jest.mock('@mui/material');

function MockThemeProvider({ children }) {
    const theme = createTheme({});
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

describe("metamask wallet connection", () => {
    test("it should connect wallet successfully", async () => {
        await act(async () => {
            render(
                <AuthProvider>
                    <AuthorizedApolloProvider>
                        <MockThemeProvider>
                            <ToastManager>
                                <Web3Provider>
                                    <CollectionProvider>
                                        <ContractProvider>
                                            <Layout>
                                                <NewV2 />
                                            </Layout>
                                        </ContractProvider>
                                    </CollectionProvider>
                                </Web3Provider>
                            </ToastManager>
                        </MockThemeProvider>
                    </AuthorizedApolloProvider>
                </AuthProvider>
            );
        });
    });
});