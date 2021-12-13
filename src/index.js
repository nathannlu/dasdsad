import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { ThemeProvider } from 'ds/hooks/useTheme';
import { ToastManager } from 'ds/hooks/useToast';

import 'assets/styles/index.css';

ReactDOM.render(
	<ThemeProvider>
		<ToastManager>
			<App />
		</ToastManager>
	</ThemeProvider>,
  document.getElementById('root')
);
