import React, { useState, useEffect } from 'react';
import { Link, Fade, Box, FormLabel, TextField, Divider, Stack, Button, Typography, Card, LoadingButton, Slider } from 'ds/components';
import { Chip, CircularProgress } from '@mui/material'
import { useGenerator } from 'services/generator/controllers/generator';
import { useMetadata } from 'services/generator/controllers/metadata';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

import posthog from 'posthog-js';
//import Login from 'components/pages/Auth/LoginModal';


const Generating = () => {
	const { settingsForm: { size } } = useMetadata();
	const { save, done, progress, zipProgress, listenToWorker, generateImages } = useGenerator();
	const [displayAuth, setDisplayAuth] = useState(false)
	useEffect(listenToWorker,[])

	return (
		<Stack gap={10}>
			<Box>
				<Chip sx={{opacity: .8, mb: 1}} label={"Generating your collection..."} />
				<Typography variant="h2">
					Growing the next mutant apes
				</Typography>
				<Typography variant="body">
					Generating your collection. This will take some time.
				</Typography>
			</Box>

			<Stack alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
				<CircularProgress variant="determinate" value={Math.round((progress / size.value) * 100)} size={100} />
				<Box
					sx={{
						top: 0,
						left: 0,
						bottom: 0,
						right: 0,
						position: 'absolute',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Typography variant="h6" component="div" color="text.secondary">
						{`${Math.round((progress / size.value) * 100)}%`}
					</Typography>
				</Box>
				{zipProgress !== null && (
					<>
						Zipping... {Math.round(zipProgress)}%
					</>
				)}
			</Stack>


			<Stack gap={2}>
				<Button disabled={!done} onClick={save} variant="contained">
					Download
				</Button>

				<Typography gutterBottom variant="body">
					Shill your collection in our <a target="_blank" style={{color: 'blue'}} href="https://discord.gg/ZMputCvjVe">Discord</a> and check out our <a style={{color: 'blue'}} href="https://twitter.com/ambition_so" target="_blank">Twitter</a>
				</Typography>
			</Stack>

			{/*done && (
			<Link to="/upload" style={{textDecoration: 'none', color: 'inherit'}}>
				<Stack gap={2} p={2} sx={{background: '#eee', borderRadius: 3, cursor: 'pointer'}}>
					<Box>
						<Stack alignItems="center" direction="row" gap={1}>
							<AutoGraphIcon sx={{color: '#006aff'}} />
							<Typography variant="body" sx={{color: '#006aff', fontWeight:'bold'}}>
								Growth opportunity
							</Typography>
							<Chip color="success" label="New" size="small"/>
							<Chip color="primary" label="No code" size="small"/>
						</Stack>
						<Typography variant="h6">
							Deploy to a blockchain
						</Typography>
						<Typography variant="body">
							Deploy your collection to the blockchain now!
						</Typography>
					</Box>
					<Box>
						<Button variant="contained">
							Deploy
						</Button>
					</Box>
				</Stack>
			</Link>
			)
			<Login in={displayAuth} setDisplayAuth={setDisplayAuth} />
*/}



		</Stack>
	)
};

export default Generating;
