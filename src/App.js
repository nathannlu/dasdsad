import React, { useEffect } from 'react';
import posthog from 'posthog-js';
import { BrowserRouter as Router, Prompt, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Helmet } from 'react-helmet';

import Routes from 'components/routes';
import { Avatar, Box } from 'ds/components';
import { useToast } from 'ds/hooks/useToast';
import { useAnalytics } from 'libs/analytics';
import { useGetCurrentUser } from 'gql/hooks/users.hook';

import useMediaQuery from '@mui/material/useMediaQuery';
import { LinearProgress, Chip } from '@mui/material';
import {
		Help as HelpIcon,
    Comment as CommentIcon,
    Twitter as TwitterIcon,
} from '@mui/icons-material';

import { useGenerator } from 'services/generator/controllers/generator';
import { useMetadata } from 'services/generator/controllers/metadata';

import AppLoader from 'components/common/appLoader';

function App() {
    const { addToast } = useToast();
    const { initGA, initPosthog, initLogRocket } = useAnalytics();
    const history = createBrowserHistory();

    //	const { start, progress } = useGenerator();
    //	const { settingsForm: {size}} = useMetadata();
    /*
	const initBeforeUnLoad = (showExitPrompt) => {
		window.onbeforeunload = (event) => {
			// Show prompt based on state
			if (showExitPrompt) {
				const e = event || window.event;
				e.preventDefault();
				if (e) {
					e.returnValue = ''
				}
				return '';
			}
		};
	};

	window.onload = function() {
			initBeforeUnLoad(start);
	};

	useEffect(() => {
		initBeforeUnLoad(start);
	}, [start]);
	*/

    //

    const smallerThanTablet = useMediaQuery((theme) =>
        theme.breakpoints.down('md')
    );
    useEffect(() => {
        if (smallerThanTablet) {
            // addToast({
            // 	severity: 'info',
            // 	message: 'This app was designed for desktop-use. For a better experience, please use our desktop version'
            // })
        }
    }, [smallerThanTablet]);

    const [
        getCurrentUser,
        {
            called: getCurrentUserQueryCalled,
            loading: isGetCurrentUserQueryLoading,
        },
    ] = useGetCurrentUser();

    /**
     * - we'll verify and check if the user bearer token exists on app load
     * - load the 3rd party plugin only once, when the app loads
     */
    useEffect(() => {
        if (!getCurrentUserQueryCalled) {
            getCurrentUser();
        }
        initGA();
        initPosthog();
        initLogRocket();
    }, []);

    // show loader until we check if user token already exists
    if (getCurrentUserQueryCalled && isGetCurrentUserQueryLoading) {
        return <AppLoader />;
    }

    return (
        <Box sx={{ minHeight: '100vh' }}>
            <Helmet>
                <title>Ambition</title>
                <link rel="canonical" href="https://app.ambition.so" />
            </Helmet>

            <Router
                getUserConfirmation={(message, callback) => {
                    const allowTransition = window.confirm(message);
                    console.log(message);
                    callback(allowTransition);
                }}
                history={history}>
                <Routes />
            </Router>

            {/*start && (
			
			<Box
				sx={{
					position: 'fixed',
					width: '100%',
					bottom: 0,
					background: 'white',
					boxShadow: '0 -4px 8px rgba(0,0,0,.1)',
					p:3
				}}
			>
				<Box mb={1}>
					<Typography variant="body">
						Collection is generating...
					</Typography>
				</Box>
				<LinearProgress 
					value={Math.round((progress / size?.value) * 100)}
					variant="determinate" 
				/>
			</Box>
		)*/}

            {!smallerThanTablet && (
                <a
                    href="https://discord.gg/ZMputCvjVe"
                    target="_blank"
                    style={{
                        display: 'inline-block',
                        position: 'fixed',
                        right: 35,
                        bottom: 50,
                    }}
                    rel="noreferrer"
										onClick={()=>{
											let url = window.location.href;

											// hash slash, remove slash
											if(url.substr(-1) == '/') url = url.slice(0, -1)

											// track current url in posthog
											posthog.capture('User requested help', {
												page: url.toLowerCase(),
//												version: '1'
											});
										}}>
									{/*
                    <Avatar
                        sx={{
                            background: '#738ADB',
                            width: 64,
                            height: 64,
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(0,0,0,.2)',
                        }}>
                        <CommentIcon />
                    </Avatar>
										*/}
									<Chip 
										icon={<HelpIcon />}
										label="Need help?"
										variant="outlined"
										size="large"
										color="primary"

										sx={{
//											boxShadow: '0 0 8px rgba(0,0,0,.1)',
											cursor: 'pointer',
										}}
									/>
                </a>
            )}
        </Box>
    );
}

export default App;
