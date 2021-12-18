import React, { useEffect } from 'react';
import { Stack, Typography, Box, Grid, Fade, TextField, FormLabel } from 'ds/components';
import LinearProgress from '@mui/material/LinearProgress';
import Layers from './Layers';
import Images from './Images';
import Rarity from './Rarity';
import Settings from './Settings';
import { useGenerateCollection } from './hooks/useGenerateCollection';
import { useCollection } from 'libs/collection';
import CheckoutModal from './CheckoutModal';

const Generator = () => {
	const { done, progress } = useGenerateCollection();	
	const { isModalOpen, setIsModalOpen } = useCollection();

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

				<CheckoutModal
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
					progress={progress}
				/>
			</Stack>
		</Fade>
		</>
	)
};




export default Generator;

