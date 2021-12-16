import React from 'react';
import Generator from 'components/pages/Generator';
import { Container, Box, Typography, Stack } from 'ds/components';
import { Chip } from '@mui/material';
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
			<Container sx={{py: 3}}>
				<Chip label="Early beta" />
				<Typography variant="h5">
					No Code NFT Collection Generator
				</Typography>
				<Stack>
					<Typography variant="body">
						Generate your 10,000 NFT Collection from an intuitive UI. We support images, gifs and videos generative art!
					</Typography>
					<Typography variant="body">
						If you have any questions, or just want to chat with the developers, join our
						&nbsp;<a style={{color: 'blue'}} href="https://discord.gg/ZMputCvjVe">discord</a> or follow us on <a href="https://twitter.com/nftdatagen" style={{color: 'blue'}}>Twitter</a>
					</Typography>
				</Stack>
			
			</Container>

			<Generator />
		</>
  );
}

export default App;
