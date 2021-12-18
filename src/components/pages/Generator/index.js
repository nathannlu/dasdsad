import React, { useEffect } from 'react';
import { Stack, Typography, Box, Grid, Fade, TextField, FormLabel } from 'ds/components';
import LinearProgress from '@mui/material/LinearProgress';
import Layers from './Layers';
import Images from './Images';
import Rarity from './Rarity';
import Settings from './Settings';
import { useGenerateCollection } from './hooks/useGenerateCollection';

const Generator = () => {
	const { done, progress } = useGenerateCollection();	

//	useEffect(() => console.log(progress), [progress]);

	return (
		<>
		<Fade in>
			<Stack gap={5} sx={{
				display: 'flex',
				p: 2
			}}>
				<Settings />
				<Grid container>
					<Grid xs={3} item>
						<Layers />
					</Grid>
					<Grid xs={6} item>
						<Images />
					</Grid>
					<Grid xs={3} item>
						<Rarity />
					</Grid>
				</Grid>
			</Stack>
		</Fade>
		</>
	)
};

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}


export default Generator;

