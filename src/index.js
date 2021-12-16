import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { CollectionProvider } from 'libs/collection';
import { ThemeProvider } from 'ds/hooks/useTheme';
import { ToastManager } from 'ds/hooks/useToast';

import './assets/styles/index.css';

ReactDOM.render(
	<CollectionProvider>
		<ThemeProvider>
			<ToastManager>
				<App />
			</ToastManager>
		</ThemeProvider>
	</CollectionProvider>,
  document.getElementById('root')
);
