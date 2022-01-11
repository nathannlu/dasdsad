import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
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

import Routes from './routes';


function App() {
	const { addToast } = useToast();
	const { initGA, initPosthog, initLogRocket } = useAnalytics();
	const history = createBrowserHistory();

	const { start, progress } = useGenerator();
	const { settingsForm: {collectionSize}} = useMetadata();


	useGetCurrentUser();
	initGA()
	initPosthog()
	initLogRocket()


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
				<link rel="canonical" href="https://app.nftdatagen.com" />
				<meta name="description" content="Generate thousands of digital arts online - The simplest way." />
			</Helmet>


			<Router history={history}>
				<Routes />
			</Router>

			{start ? (
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
						value={Math.round((progress / collectionSize.value) * 100)}
						variant="determinate" 
					/>
				</Box>
			):null}


			{!smallerThanTablet ? (
				<a href="https://discord.gg/ZMputCvjVe" target="_blank" style={{display: 'inline-block', position: 'fixed', right: 20, bottom: 50}}>
					<Avatar sx={{ background: '#738ADB', width: 64, height: 64, cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,.2)'}}>
						<CommentIcon />
					</Avatar>
				</a>
			) : null}
		</Box>
  );
}

export default App;
