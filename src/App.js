import React from 'react';
import Generator from 'components/pages/Generator';
import { Container, Box, Typography, Stack } from 'ds/components';
import { Toolbar, Chip } from '@mui/material';
import ReactGA from 'react-ga';
import { Helmet } from 'react-helmet';

import { Twitter as TwitterIcon  } from '@mui/icons-material';

function App() {
	ReactGA.initialize('G-X392J39GCK');
	ReactGA.pageview(window.location.pathname + window.location.search);

  return (
		<>
			<Helmet>
				<title>Create your NFT collection with no-code - NFT Art Generator</title>
				<link rel="canonical" href="https://nftdatagen.com" />
				<meta name="description" content="Generate thousands of digital arts online - The simplest way." />
			</Helmet>

			<Toolbar sx={{background: 'rgba(0, 0, 0, 0.9)'}}>
			<div className="container mx-auto">
				<Typography variant="body" sx={{color: 'white'}}>
					Web3
				</Typography>
			</div>
			</Toolbar>

			<Generator />
		</>
  );
}

export default App;
