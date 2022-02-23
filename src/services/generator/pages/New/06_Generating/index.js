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
	// const { save, done, progress, zipProgress, listenToWorker, generateImages } = useGenerator();
	// const [displayAuth, setDisplayAuth] = useState(false)
	//useEffect(listenToWorker,[])

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
				{/* <CircularProgress variant="determinate" value={Math.round((progress / size.value) * 100)} size={100} />
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
				)} */}
			</Stack>

			<Stack gap={2}>
				<Link to="/login?redirect=generator/download">
					<Button variant="contained" sx={{
						bgColor: 'rgb(220, 220, 220)',
						color: 'black'
					}}>
						Log in to download
					</Button>
				</Link>
				<Typography gutterBottom variant="body">
					Shill your collection in our <a target="_blank" style={{color: 'blue'}} href="https://discord.gg/ZMputCvjVe">Discord</a> and check out our <a style={{color: 'blue'}} href="https://twitter.com/ambition_so" target="_blank">Twitter</a>
				</Typography>
			</Stack>
		</Stack>
	)
};

export default Generating;
