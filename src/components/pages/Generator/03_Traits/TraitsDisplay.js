import React, { useState } from 'react';
import { Typography, Stack, Box, Grid, IconButton } from 'ds/components';
import { useCollection } from 'libs/collection';
import { useTraitsManager } from '../hooks/useTraitsManager';

import { CancelOutlined as CancelOutlinedIcon } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';

import ChangeTraitNameModal from './ChangeTraitNameModal';


const TraitsDisplay = ({index}) => {
	const { layers, setLayers, selected, selectedImage, setSelectedImage } = useCollection();
	const { deleteImage } = useTraitsManager();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editTrait, setEditTrait] = useState(null);

	return (
		<Stack gap={2} direction="row">
			{layers[index]?.images?.map((image, i) => (
				<Grid xs={2} item key={i} sx={{position: 'relative'}}>
					<Box sx={{border: '1px solid rgba(0,0,0,.5)', borderRadius: '6px', padding: '4px'}}>
						<img
							src={image.preview} 
							onClick={() => setSelectedImage(i)}
							style={{borderRadius: '4px'}}
						/>

						<Stack justifyContent="space-between" alignItems="center" direction="row">
							<Stack direction="column">
								<Typography variant="small" sx={{fontSize: '12px', fontWeight: 'bold'}}>
									Trait name
								</Typography>

								<Typography variant="small">
									{image.name}
								</Typography>
							</Stack>

							<IconButton
								sx={{
									padding: '3px',
									height: '30px',
									width: '30px',
								}}
								onClick={() => {
									setEditTrait(i)
									setIsModalOpen(true);
								}}
							>
								<EditIcon />
							</IconButton>
						</Stack>
					</Box>
					<IconButton
						sx={{
							position: 'absolute',
							top: 0,
							right: 0,
							transform: 'translate(35%, -35%)',
							background: '#fff',
							padding: '1px',
							'&:hover': {
								background: '#fff',
							}
						}}
						onClick={() => deleteImage(i)}
					>
						<CancelOutlinedIcon />
					</IconButton>
				</Grid>
			))}
		

			<ChangeTraitNameModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} editTrait={editTrait} />
		</Stack>
	)
};

export default TraitsDisplay;
