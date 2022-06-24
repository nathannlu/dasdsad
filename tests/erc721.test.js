import React from 'react';
import '@testing-library/jest-dom';
import 'cross-fetch/polyfill';
import { BrowserRouter } from 'react-router-dom';

import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";

import Layout from '../src/components/layout/Layout';

import { AuthorizedApolloProvider } from 'libs/apollo';
import { Web3Provider } from 'libs/web3';
import { AuthProvider } from 'libs/auth';
import { ToastManager } from 'ds/hooks/useToast';
import { CollectionProvider } from 'services/generator/provider';
import { ContractProvider } from 'services/blockchain/provider';
import { ThemeProvider } from 'ds/hooks/useTheme';

import NewV2 from 'services/blockchain/pages/NewV2';

jest.mock('react-router-dom', () => {
    const original = jest.requireActual('react-router-dom');
    return {
        ...original,
        useLocation: jest.fn().mockReturnValue({
            pathname: '/another-route',
            search: '',
            hash: '',
            state: null,
            key: '5nvxpbdafa',
        })
    };
});

describe("metamask wallet connection", () => {
    beforeEach(() => {
        const mockWalletAddress = '0xf61B443A155b07D2b2cAeA2d99715dC84E839EEf';
        const contract = {
            address: '0x551E8866512183C35176752741CFd3Ce9e3a6C0E',
            chainId: '4',
            balance: "29481000000000000",
            balanceInEth: "0.029481",
            baseTokenUri: "ipfs://QmaSxCmqh7WVX7Saae5tjZCw7VzR9PMfmP5DNisJy3i1Wp/",
            cost: "1000000000000000",
            costInEth: "0.001",
            maxPerMint: "5",
            open: true,
            owner: mockWalletAddress,
            presaleOpen: false,
            supply: "32",
            totalSupply: "4200",
        };
        const contractMock = {
            methods: {
                baseTokenURI: () => ({ call: () => contract.baseTokenUri }),
                open: () => ({ call: () => contract.open }),
                maxPerMint: () => ({ call: () => contract.maxPerMint }),
                cost: () => ({ call: () => contract.cost }),
                supply: () => ({ call: () => contract.supply }),
                totalSupply: () => ({ call: () => contract.totalSupply }),
                owner: () => ({ call: () => contract.owner }),
                presaleOpen: () => ({ call: () => contract.presaleOpen }),
                mint: () => ({ send: () => ({ on: () => ({ once: () => jest.fn() }) }) })
            }
        };

        const ethProviderMock = {
            enable: () => jest.fn(),
            on: () => jest.fn(),
            eth: {
                getAccounts: async () => [mockWalletAddress],
                Contract: () => contractMock,
                getBalance: () => jest.fn(),
            },
            utils: {
                fromWei: () => contract.costInEth
            }
        };

        // Manually inject the mocked provider in the window as MetaMask does
        global.window.ethereum = ethProviderMock;
        global.window.web3 = ethProviderMock;
        global.window.rewardful = () => jest.fn();

        const storageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
            clear: jest.fn()
        };
        global.localStorage = storageMock;
        global.sessionStorage = storageMock;
    });

    afterEach(() => {
        jest.clearAllMocks();
        global.window.ethereum = {};
        global.window.web3 = {};
        global.window.rewardful = () => jest.fn();
        global.localStorage = {};
        global.sessionStorage = {};
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
                                                    <NewV2 skipLoadWalletProviderOnLoad={true} />
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

        expect(connectButton).toBeInTheDocument(mockWalletAddress.substring(0, 4));
        expect(connectButton).toBeInTheDocument(mockWalletAddress.slice(-3));
    });
});