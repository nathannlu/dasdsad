import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';

import theme from '../theme';

export const ThemeProvider = ({ children }) => (<MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>)
