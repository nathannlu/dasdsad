import React from 'react';
import ReactGA from 'react-ga';
import posthog from 'posthog-js';
import { Helmet } from 'react-helmet';
import { Avatar } from '@mui/material';
import { Comment as CommentIcon, Twitter as TwitterIcon } from '@mui/icons-material';
import { Container, Box, Typography, Stack } from 'ds/components';

import Generator from 'components/pages/Generator';



function App() {
	ReactGA.initialize('G-X392J39GCK');
	ReactGA.pageview(window.location.pathname + window.location.search);
	posthog.init("phc_Y320pMWnNVcSMIAIW1bbh35FXjgqjZULkZrl5OhaIAf", {api_host: 'https://app.posthog.com'});


  return (
		<Box sx={{minHeight: '100vh',bgcolor: '#191A24', position: 'relative'}}>
			<Helmet>
				<title>Create your NFT collection with no-code - NFT Art Generator</title>
				<link rel="canonical" href="https://nftdatagen.com" />
				<meta name="description" content="Generate thousands of digital arts online - The simplest way." />
			</Helmet>

			<Generator />

			<a href="https://discord.gg/ZMputCvjVe" target="_blank" style={{display: 'inline-block', position: 'absolute', right: 20, bottom: 20}}>
				<Avatar sx={{ background: '#738ADB', width: 64, height: 64, cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,.2)'}}>
					<CommentIcon />
				</Avatar>
			</a>
		</Box>
  );
}

export default App;
