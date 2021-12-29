import React, { useState } from 'react';
import { Typography, Stack, Box, Grid, IconButton } from 'ds/components';
import { useCollection } from 'libs/collection';
import { useTraitsManager } from '../hooks/useTraitsManager';

import { CancelOutlined as CancelOutlinedIcon } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';


const TraitsDisplay = ({index}) => {
	const { layers, setLayers, selected, selectedImage, setSelectedImage } = useCollection();
	const { deleteImage } = useTraitsManager();

	return (
		<Stack direction="row">
			{layers[index]?.images?.map((image, i) => (
				<Grid xs={2} item key={i} sx={{position: 'relative'}}>
					<Box sx={{border: selectedImage == i && '2px solid darkgrey', borderRadius: '6px', padding: '4px'}}>
						<img
							src={image.preview} 
							onClick={() => setSelectedImage(i)}
							style={{borderRadius: '4px'}}
						/>
						<Stack>
							<Typography variant="small" sx={{fontSize: '12px', fontWeight: 'bold'}}>
								Trait name
							</Typography>

							<Stack direction="row">
								<Typography variant="small">
									{image.name}
								</Typography>
								<IconButton>
									<EditIcon />
								</IconButton>
							</Stack>
						</Stack>
					</Box>
					<IconButton
						sx={{
							position: 'absolute',
							top: 0,
							right: 0,
							transform: 'translate(35%, -35%)',
							background: '#eee',
							padding: '1px',
							'&:hover': {
								background: '#eee',
							}
						}}
						onClick={() => deleteImage(i)}
					>
						<CancelOutlinedIcon />
					</IconButton>
				</Grid>
			))}
		</Stack>
	)
};

export default TraitsDisplay;
