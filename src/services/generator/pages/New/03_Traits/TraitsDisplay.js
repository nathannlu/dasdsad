import React, { useState } from 'react';
import { Typography, Stack, Box, Grid, IconButton } from 'ds/components';
import { Edit as EditIcon, CancelOutlined as CancelOutlinedIcon } from '@mui/icons-material';
import { useLayerManager } from 'services/generator/controllers/manager';
import { useTrait } from 'services/generator/controllers/traits';

import ChangeTraitNameModal from './ChangeTraitNameModal';


const TraitsDisplay = ({index, editing}) => {
	const { query: {layers, selected}} = useLayerManager();
	const { deleteTrait } = useTrait();

	// @TODO tidy up
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editTrait, setEditTrait] = useState(null);


	return (
		<Stack gap={2} direction="row" sx={{flexWrap: 'wrap'}}>
			{layers[index]?.images?.map((image, i) => (
				<Grid xs={2} item key={i} sx={{position: 'relative'}}>
					<Box sx={{border: '1px solid rgba(0,0,0,.5)', borderRadius: '6px', padding: '4px'}}>
						{image.type == 'image/png' ? (
							<img
								src={image.preview} 
								onClick={() => setSelectedImage(i)}
								style={{borderRadius: '4px', width: '100%'}}
							/>
						): null}
						{image.type == 'video/mp4' ? (
							<video width="100%" loop autoPlay muted>
								<source src={image.preview} type="video/mp4" />
									Sorry, your browser doesn't support embedded videos.
							</video>
						): null}


						<Stack justifyContent="space-between" alignItems="center" direction="row">
							<Stack direction="column">
								<Typography variant="small" sx={{fontSize: '12px', fontWeight: 'bold'}}>
									Trait name
								</Typography>

								<Typography variant="small">
									{image.name}
								</Typography>
							</Stack>

							{editing ? (
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
							):null}
						</Stack>
					</Box>
					{editing ? (
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
						onClick={() => deleteTrait(i)}
					>
						<CancelOutlinedIcon />
					</IconButton>
					):null}
				</Grid>
			))}
		

			<ChangeTraitNameModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} editTrait={editTrait} />
		</Stack>
	)
};

export default TraitsDisplay;
