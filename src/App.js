import React, { useEffect, useMemo } from 'react';
import posthog from 'posthog-js';
import { BrowserRouter as Router, Prompt, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Helmet } from 'react-helmet';

import Routes from 'components/routes';
import { Avatar, Box, Typography } from 'ds/components';
import { useToast } from 'ds/hooks/useToast';
import { useAnalytics } from 'libs/analytics';
import { useGetCurrentUser } from 'gql/hooks/users.hook';

import useMediaQuery from '@mui/material/useMediaQuery';
import { Comment as CommentIcon, Twitter as TwitterIcon } from '@mui/icons-material';

function App() {
	const { addToast } = useToast();
	const { initGA, initPosthog, initLogRocket } = useAnalytics();
	const history = createBrowserHistory();

	useGetCurrentUser();
	initGA()
	initPosthog()
	initLogRocket()

	const smallerThanTablet = useMediaQuery(theme => theme.breakpoints.down('md'));
	useEffect(() => {
		if(smallerThanTablet) {
			// addToast({
			// 	severity: 'info',
			// 	message: 'This app was designed for desktop-use. For a better experience, please use our desktop version'
			// })
		}
	}, [smallerThanTablet])

	return (
        <Box sx={{minHeight: '100vh'}}>
            <Helmet>
                <title>Ambition</title>
                <link rel="canonical" href="https://app.ambition.so" />
            </Helmet>

            <Router 
                getUserConfirmation={(message, callback) => {
                    const allowTransition = window.confirm(message);
                    console.log(message)
                    callback(allowTransition);	
                }}
                history={history}
            >
                <Routes />
            </Router>

            {!smallerThanTablet && (
                <a href="https://discord.gg/ZMputCvjVe" target="_blank" style={{display: 'inline-block', position: 'fixed', right: 20, bottom: 50}}>
                    <Avatar sx={{ background: '#738ADB', width: 64, height: 64, cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,.2)'}}>
                        <CommentIcon />
                    </Avatar>
                </a>
            )}
        </Box>
	);
}

export default App;
