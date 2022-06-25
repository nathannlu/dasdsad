import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { AuthorizedApolloProvider } from 'libs/apollo';
import { Web3Provider } from 'libs/web3';
import { AuthProvider } from 'libs/auth';
import { ThemeProvider } from 'ds/hooks/useTheme';
import { ToastManager } from 'ds/hooks/useToast';
import { ModalManager } from 'ds/hooks/useModal';
import { CollectionProvider } from 'services/generator/provider';

import './assets/styles/index.css';

ReactDOM.render(
    <AuthProvider>
        <AuthorizedApolloProvider>
            <ThemeProvider>
                <ToastManager>
									<ModalManager>
                    <Web3Provider>
                        <CollectionProvider>
                            <App />
                        </CollectionProvider>
                    </Web3Provider>
										</ModalManager>
                </ToastManager>
            </ThemeProvider>
        </AuthorizedApolloProvider>
    </AuthProvider>,
    document.getElementById('root')
);
