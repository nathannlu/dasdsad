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
				<ThemeProvider>
					<ToastManager>

		<MetadataProvider>
			<LayerManagerProvider>
						<App />
			</LayerManagerProvider>
		</MetadataProvider>
					</ToastManager>
				</ThemeProvider>
	</AuthorizedApolloProvider>,
  document.getElementById('root')
);
