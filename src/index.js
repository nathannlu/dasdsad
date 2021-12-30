import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';

import { AuthorizedApolloProvider } from 'libs/apollo';
import { ThemeProvider } from 'ds/hooks/useTheme';
import { ToastManager } from 'ds/hooks/useToast';

import { MetadataProvider } from 'core/metadata';
import { LayerManagerProvider} from 'core/manager';

import './assets/styles/index.css';

ReactDOM.render(
	<AuthorizedApolloProvider>
		<MetadataProvider>
			<LayerManagerProvider>
				<ThemeProvider>
					<ToastManager>
						<App />
					</ToastManager>
				</ThemeProvider>
			</LayerManagerProvider>
		</MetadataProvider>
	</AuthorizedApolloProvider>,
  document.getElementById('root')
);
