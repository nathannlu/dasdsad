import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';

import { AuthorizedApolloProvider } from 'libs/apollo';
import { CollectionProvider } from 'libs/collection';
import { ThemeProvider } from 'ds/hooks/useTheme';
import { ToastManager } from 'ds/hooks/useToast';

import './assets/styles/index.css';

ReactDOM.render(
	<AuthorizedApolloProvider>
		<CollectionProvider>
			<ThemeProvider>
				<ToastManager>
					<App />
				</ToastManager>
			</ThemeProvider>
		</CollectionProvider>
	</AuthorizedApolloProvider>,
  document.getElementById('root')
);
