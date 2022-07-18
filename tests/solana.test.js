import React from 'react';
import '@testing-library/jest-dom';
import 'cross-fetch/polyfill';
import axios from 'axios';

import { createMemoryHistory } from 'history';
import { BrowserRouter } from 'react-router-dom';
import { Router, Route } from 'react-router-dom';

import { screen, render, fireEvent, waitFor, act } from "@testing-library/react";

import Layout from '../src/components/layout/Layout';

import config from '../src/config';
import { AuthorizedApolloProvider } from 'libs/apollo';
import { Web3Provider } from 'libs/web3';
import { AuthProvider } from 'libs/auth';
import { ToastManager } from 'ds/hooks/useToast';
import { CollectionProvider } from 'services/generator/provider';
import { ContractProvider, ContractContext } from 'services/blockchain/provider';
import { ThemeProvider } from 'ds/hooks/useTheme';

import New from 'services/blockchain/pages/New';

jest.mock('react-router-dom', () => {
    const original = jest.requireActual('react-router-dom');
    return {
        ...original,
        capture: jest.fn().mockReturnValue({
            pathname: '/another-route',
            search: '',
            hash: '',
            state: null,
            key: '5nvxpbdafa',
        })
    };
});

jest.mock('posthog-js', () => {
    const original = jest.requireActual('posthog-js');
    return {
        ...original,
        capture: jest.fn()
    };
});

const useMockContractProvider = (contract) => {
    const MockContractProvider = (props) => {
        return (
            <ContractContext.Provider
                value={{
                    contract,
                    setContract: () => jest.fn(),
                    setSelectInput: () => jest.fn()
                }}
            >
                {props.children}
            </ContractContext.Provider>
        );
    };
    return MockContractProvider;
};

describe("metamask wallet connection", () => {
    const mockWalletAddress = 'CDqp1JLoetSXjqUQyMYk8aMWBu6xvYppuv6XP9djCMA8';
    const contract = {
        address: 'D6a1f6qWpeYGQuqAPvw8gYxVBkoM8mjyFPWTFGSGRPuh',
        chainId: 'solanadevnet',
        itemsAvailable: 100,
        itemsRemaining: 90,
        goLiveDate: new Date(),
        price: 500000000,
        priceInSol: 0.5,
        name: 'mock-name',
        id: 'mock-id',
        blockchain: 'solanadevnet'
    };

    const MockContractProvider = useMockContractProvider(contract);

    beforeEach(() => {
        global.window.solana = {
            isPhantom: true,
            connect: async () => ({ publicKey: mockWalletAddress })
        };

        const storageMock = {
            getItem: () => 'phantom',
            setItem: jest.fn(),
            removeItem: jest.fn(),
            clear: jest.fn()
        };
        global.window.localStorage = storageMock;
        global.window.sessionStorage = storageMock;
        global.window.rewardful = () => jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
        global.window.solana = {};
        global.window.localStorage = {};
        global.window.sessionStorage = {};
        global.window.rewardful = () => jest.fn();
    });

    test("it should connect wallet successfully", async () => {
        await act(async () => {
            render(
                <AuthProvider>
                    <AuthorizedApolloProvider>
                        <ThemeProvider>
                            <ToastManager>
                                <Web3Provider>
                                    <CollectionProvider>
                                        <ContractProvider>
                                            <BrowserRouter>
                                                <Layout>
                                                    <New />
                                                </Layout>
                                            </BrowserRouter>
                                        </ContractProvider>
                                    </CollectionProvider>
                                </Web3Provider>
                            </ToastManager>
                        </ThemeProvider>
                    </AuthorizedApolloProvider>
                </AuthProvider>
            );
        });

        const connectButton = await screen.findByRole("button", { name: /Connect wallet/i });
        expect(connectButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(connectButton);
        });

        await waitFor(() => expect(screen.getByText(`${mockWalletAddress.substring(0, 4)}...${mockWalletAddress.slice(-3)} (Solana)`)).toBeInTheDocument());
    });

    test("it should deploy new contract successfully", async () => {
        const history = createMemoryHistory();
        history.push('/smart-contracts/new');

        await act(async () => {
            render(
                <AuthProvider>
                    <AuthorizedApolloProvider>
                        <ThemeProvider>
                            <ToastManager>
                                <Web3Provider>
                                    <CollectionProvider>
                                        <MockContractProvider>
                                            <Router history={history}>
                                                <Layout>
                                                    <Route path="/smart-contracts/new" exact={true} component={New} />
                                                </Layout>
                                            </Router>
                                        </MockContractProvider>
                                    </CollectionProvider>
                                </Web3Provider>
                            </ToastManager>
                        </ThemeProvider>
                    </AuthorizedApolloProvider>
                </AuthProvider>
            );
        });

        await waitFor(() => expect(screen.getByText(`${mockWalletAddress.substring(0, 4)}...${mockWalletAddress.slice(-3)} (Solana)`)).toBeInTheDocument());

        const contratNameInput = screen.getByTestId('solana-contract-name');
        const contratSymbolInput = screen.getByTestId('solana-contract-symbol');
        const contratMaxSupplyInput = screen.getByTestId('solana-contract-max-supply');
        const contratPriceInput = screen.getByTestId('solana-contract-price');
        const contratBlockchainButton = screen.getByTestId('solana-contract-blockchain-solanadevnet');

        await act(async () => {
            fireEvent.change(contratNameInput, { target: { value: 'contract-name' } });
            fireEvent.change(contratSymbolInput, { target: { value: 'SYM' } });
            fireEvent.change(contratMaxSupplyInput, { target: { value: '100' } });
            fireEvent.change(contratPriceInput, { target: { value: '0.001' } });
            fireEvent.click(contratBlockchainButton);
        });

        const createContractButton = await screen.findByRole("button", { name: /Create contract/i });
        expect(createContractButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(createContractButton);
        });
    });
});