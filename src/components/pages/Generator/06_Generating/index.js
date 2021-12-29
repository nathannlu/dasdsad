import React, { useState, useEffect } from 'react';
import { Fade, Box, FormLabel, TextField, Divider, Stack, Button, Typography, Card, LoadingButton, Slider } from 'ds/components';
import { Chip, CircularProgress } from '@mui/material'
import { useCollection } from 'libs/collection';



const Generating = () => {
	return (
		<Stack gap={10}>
			<Box>
				<Chip sx={{opacity: .8, mb: 1}} label={"Generating your collection..."} />
				<Typography variant="h2">
					Growing the next mutant apes
				</Typography>
				<Typography variant="body">
					Create an account to download your collection when it is done generating
				</Typography>
			</Box>

			<Stack alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
				<CircularProgress variant="determinate" value={60} size={100} />
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
						{`${Math.round(60)}%`}
					</Typography>
				</Box>
			</Stack>


			{/*
			<Stack gap={2}>
				<Typography variant="h5">
					Create your Account now
				</Typography>
				<Box>
					<FormLabel>
						Email
					</FormLabel>
					<TextField value="test@test.com" fullWidth />
				</Box>
				<Box>
					<FormLabel>
						Password
					</FormLabel>
					<TextField password fullWidth />
				</Box>
				<Button fullWidth variant="contained">
					Create an account now!
				</Button>
			</Stack>
			*/}

			<Stack gap={2}>
				<Button fullWidth variant="contained">
					Download collection
				</Button>
			</Stack>
		</Stack>
	)
};

export default Generating;
