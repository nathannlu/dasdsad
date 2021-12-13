import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { ThemeProvider } from 'ds/hooks/useTheme';
import { ToastManager } from 'ds/hooks/useToast';

import 'assets/styles/index.css';

import ReactGA from 'react-ga';
ReactGA.initialize('G-X392J39GCK');
ReactGA.pageview(window.location.pathname + window.location.search);


ReactDOM.render(
	<ThemeProvider>
		<ToastManager>
			<App />
		</ToastManager>
	</ThemeProvider>,
  document.getElementById('root')
);
