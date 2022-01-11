import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Helmet } from 'react-helmet';
import { Avatar, Box } from 'ds/components';
import { useToast } from 'ds/hooks/useToast';
import { useAnalytics } from 'libs/analytics';

import Routes from './routes';

import { useGetCurrentUser } from 'gql/hooks/users.hook';

import useMediaQuery from '@mui/material/useMediaQuery';
import { Comment as CommentIcon, Twitter as TwitterIcon } from '@mui/icons-material';


function App() {
	const { addToast } = useToast();
	const { initGA, initPosthog } = useAnalytics();
	const history =  createBrowserHistory();


	useGetCurrentUser();
	initGA()
	initPosthog()


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
				<link rel="canonical" href="https://nftdatagen.com" />
				<meta name="description" content="Generate thousands of digital arts online - The simplest way." />
			</Helmet>


			<Router history={history}>
				<Routes />
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
