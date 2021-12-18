import React from 'react';
import Generator from 'components/pages/Generator';
import { Container, Box, Typography, Stack } from 'ds/components';
import { Toolbar, Chip, Avatar } from '@mui/material';
import { Comment as CommentIcon } from '@mui/icons-material';
import ReactGA from 'react-ga';
import { Helmet } from 'react-helmet';

import { Twitter as TwitterIcon  } from '@mui/icons-material';

function App() {
	ReactGA.initialize('G-X392J39GCK');
	ReactGA.pageview(window.location.pathname + window.location.search);

  return (
		<Box sx={{minHeight: '100vh',bgcolor: 'grey.200', position: 'relative'}}>
			<Helmet>
				<title>Create your NFT collection with no-code - NFT Art Generator</title>
				<link rel="canonical" href="https://nftdatagen.com" />
				<meta name="description" content="Generate thousands of digital arts online - The simplest way." />
			</Helmet>

			<Toolbar sx={{background: 'rgba(0, 0, 0, 0.9)'}}>
			<div className="container mx-auto">
				<Typography variant="body" sx={{color: 'white'}}>
					Datagen
				</Typography>
			</div>
			</Toolbar>
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
