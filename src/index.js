import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';

import { AuthorizedApolloProvider } from 'libs/apollo';
import { Web3Provider } from 'libs/web3';
import { AuthProvider } from 'libs/auth';
import { ThemeProvider } from 'ds/hooks/useTheme';
import { ToastManager } from 'ds/hooks/useToast';

import { MetadataProvider } from 'core/metadata';
import { LayerManagerProvider} from 'core/manager';




import './assets/styles/index.css';

ReactDOM.render(
	<AuthProvider>
		<AuthorizedApolloProvider>
			<ThemeProvider>
				<ToastManager>
						<Web3Provider>
							<MetadataProvider>
								<LayerManagerProvider>
									<App />
								</LayerManagerProvider>
							</MetadataProvider>
						</Web3Provider>
				</ToastManager>
			</ThemeProvider>
		</AuthorizedApolloProvider>
	</AuthProvider>,
  document.getElementById('root')
);
