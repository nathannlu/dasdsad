import React, { useEffect } from 'react';
import { BrowserRouter as Router, Prompt, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Helmet } from 'react-helmet';
import { Avatar, Box, Typography } from 'ds/components';
import { useToast } from 'ds/hooks/useToast';
import { useAnalytics } from 'libs/analytics';
import { useGenerator }  from 'core/generator';
import { useMetadata} from 'core/metadata';
import { useGetCurrentUser } from 'gql/hooks/users.hook';
import useMediaQuery from '@mui/material/useMediaQuery';
import { LinearProgress } from '@mui/material';
import { Comment as CommentIcon, Twitter as TwitterIcon } from '@mui/icons-material';
import posthog from 'posthog-js';

import Routes from 'components/routes';

import { useGetCollections } from 'gql/hooks/collection.hook';
import { useGetContracts } from 'gql/hooks/contract.hook';
import { useGetWebsites } from 'gql/hooks/website.hook';


import Blockchain from 'services/blockchain';



function App() {
	const { addToast } = useToast();
	const { initGA, initPosthog, initLogRocket } = useAnalytics();
	const history = createBrowserHistory();

	const { start, progress } = useGenerator();
	const { settingsForm: {size}} = useMetadata();

	useGetCollections()
	useGetContracts()
	useGetWebsites()

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

	useGetCurrentUser();
	initGA()
	initPosthog()
	initLogRocket()

	useEffect(() => {
		if (posthog.isFeatureEnabled('deploy_smart_contract_test')) {
			// run your activation code here
			posthog.capture(
				'Viewing deploy_smart_contract_test version', {
					$set: {
						appVersion: 'deploy_smart_contract_test'
					}
			});
		}
	});

	const smallerThanTablet = useMediaQuery(theme => theme.breakpoints.down('md'));
	useEffect(() => {
		if(smallerThanTablet) {
			addToast({
				severity: 'info',
				message: 'This app was designed for desktop-use. For a better experience, please use our desktop version'
			})
		}
	}, [smallerThanTablet])

    return (
		<Box sx={{minHeight: '100vh'}}>
			<Helmet>
				<title>Create your NFT collection with no-code - NFT Art Generator</title>
				<link rel="canonical" href="https://app.ambition.so/" />
				<meta name="description" content="Generate thousands of digital arts online - The simplest way." />
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
				{/*
				<Route path="/smart-contracts" component={Blockchain} />
				*/}

			</Router>

			{start && (
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
						value={Math.round((progress / size.value) * 100)}
						variant="determinate" 
					/>
				</Box>
			)}

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
