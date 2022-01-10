import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ReactGA from 'react-ga';
import posthog from 'posthog-js';
import { Helmet } from 'react-helmet';
import { Avatar } from '@mui/material';
import { Comment as CommentIcon, Twitter as TwitterIcon } from '@mui/icons-material';
import { Container, Box, Typography, Stack } from 'ds/components';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useToast } from 'ds/hooks/useToast';

import Generator from 'components/pages/Generator';
import Upload from 'components/pages/Upload';
import Main from 'components/pages/Main';


function App() {
	const smallerThanTablet = useMediaQuery(theme => theme.breakpoints.down('md'));
	const { addToast } = useToast();

	ReactGA.initialize('G-X392J39GCK');
	ReactGA.pageview(window.location.pathname + window.location.search);
	if (!window.location.href.includes('localhost')) {
		posthog.init("phc_Y320pMWnNVcSMIAIW1bbh35FXjgqjZULkZrl5OhaIAf", {api_host: 'https://app.posthog.com'});
	}

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
				<link rel="canonical" href="https://nftdatagen.com" />
				<meta name="description" content="Generate thousands of digital arts online - The simplest way." />
			</Helmet>



			<Router>
				<Route path="/generator" exact component={Generator} />
				<Route path="/upload" exact component={Upload} />
				<Route path="/" exact component={Main} />
			</Router>


			{!smallerThanTablet ? (
				<a href="https://discord.gg/ZMputCvjVe" target="_blank" style={{display: 'inline-block', position: 'absolute', right: 20, bottom: 20}}>
					<Avatar sx={{ background: '#738ADB', width: 64, height: 64, cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,.2)'}}>
						<CommentIcon />
					</Avatar>
				</a>
			) : null}
		</Box>
  );
}

export default App;
