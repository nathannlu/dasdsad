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

import NewV2 from 'services/blockchain/pages/NewV2';
import Success from 'services/blockchain/pages/NewV2/Success';

// import fs from 'fs';
// import path from 'path';

const MAX_SAFE_INTEGER = 900719925474099;

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
            <ContractContext.Provider value={{ contract, setContract: () => jest.fn() }}>{props.children}</ContractContext.Provider>
        );
    };

    return MockContractProvider;
};

describe("metamask wallet connection", () => {
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
        name: 'mock-name',
        id: 'mock-id',
        blockchain: 'rinkeby'
    };

    const MockContractProvider = useMockContractProvider(contract);

    beforeEach(() => {
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

        await waitFor(() => expect(screen.getByText(`${mockWalletAddress.substring(0, 4)}...${mockWalletAddress.slice(-3)}`)).toBeInTheDocument());
    });

    test("it should deploy new contract successfully", async () => {
        const history = createMemoryHistory();
        history.push('/smart-contracts/v2/new');

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
                                                    <Route path="/smart-contracts/v2/new" exact={true} component={NewV2} />
                                                    <Route path="/smart-contracts/v2/:id/deploy/success" exact={true} component={Success} />
                                                </Layout>
                                            </Router>
                                        </MockContractProvider>
                                    </CollectionProvider>
                                </Web3Provider>
                            </ToastManager>
                        </ThemeProvider>
                    </AuthorizedApolloProvider>
                </AuthProvider >
            );
        });

        await waitFor(() => expect(screen.getByText(`${mockWalletAddress.substring(0, 4)}...${mockWalletAddress.slice(-3)}`)).toBeInTheDocument());

        const contratNameInput = screen.getByTestId('contract-name');
        const contratSymbolInput = screen.getByTestId('contract-symbol');
        const contratMaxSupplyInput = screen.getByTestId('contract-max-supply');
        const contratPriceInput = screen.getByTestId('contract-price');

        await act(async () => {
            fireEvent.change(contratNameInput, { target: { value: 'contract-name' } });
            fireEvent.change(contratSymbolInput, { target: { value: 'SYM' } });
            fireEvent.change(contratMaxSupplyInput, { target: { value: '100' } });
            fireEvent.change(contratPriceInput, { target: { value: '0.001' } });
        });

        const deployContractButton = await screen.findByRole("button", { name: /Deploy Contract/i });
        expect(deployContractButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(deployContractButton);
        });

        await waitFor(() => expect(screen.getByText(/Congrats! Explore what you can do with your contract or deploy on mainnet directly from your dashboard./)).toBeInTheDocument());
    });

    test("it should upload 10K nfts successfully to ipfs", async () => {

        try {
            const filesCount = 1;
            const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`; // Pinata API url

            // const fileBuffer = fs.readFileSync(path.join(__dirname, './1.png'));
            // const file = new File(fileBuffer, 'mockfile-1.png');

            // let files = [];
            // for (let i = 1; i <= filesCount; i++) {
            //     const file = new File([new ArrayBuffer(i)], `mockfile-${i}.png`, { type: "image/png", lastModified: new Date().getTime() });
            //     files = [...files, file];
            // }

            let data = new FormData();
            for (let i = 1; i <= filesCount; i++) {
                // const file = new File(fileBuffer, `${i}.png`);
                const file = new File([new ArrayBuffer(1)], `mockfile-${i}.png`, { type: "image/png", lastModified: new Date().getTime() });
                data.append('file', file, `/assets/${file.name}`);
            }

            // Name Pinata folder
            const metadata = JSON.stringify({ name: 'assets' });
            data.append('pinataMetadata', metadata);

            // Send API req
            const res = await axios.post(
                url,
                data,
                {
                    maxBodyLength: 'Infinity',
                    headers: {
                        'Content-Type': `multipart/form-data; boundary=${data._boundary};`,
                        pinata_api_key: config.pinata.key,
                        pinata_secret_api_key: config.pinata.secret,
                    }
                });

            console.log(res.data, 'res.data');

            expect(res.data.IpfsHash).toBeDefined();

        } catch (e) {
            console.log(e);
        }

    }, MAX_SAFE_INTEGER);
});