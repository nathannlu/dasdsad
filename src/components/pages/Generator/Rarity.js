import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Stack, Box, Grid, Fade, TextField, FormLabel, IconButton, Divider, Slider } from 'ds/components';
import { Chip } from '@mui/material';
import { useCollection } from 'libs/collection';
import { useLayerManager } from './hooks/useLayerManager';
import { useTraitsManager } from './hooks/useTraitsManager';
import { useGenerateCollection } from './hooks/useGenerateCollection';

const Settings = ({ setIsCheckoutModalOpen}) => {
	const {
		layers,
		selected,
		selectedImage,
		listOfWeights,
		setListOfWeights,
	} = useCollection();
	const { onChange } = useLayerManager();
	const { onChange: onImageRarityChange } = useTraitsManager();

	const {
		generateImages,
		generatedZip,
		initWorker,
		done,
		progress,
		validateForm,
	} = useGenerateCollection()
	useEffect(initWorker, [])



	return (
		<Stack gap={2}>
			{selected !== null && (
				<>
					<Box>
						<Stack gap={2} sx={{p: 2, background: 'white', borderRadius: 2}}>
							<Box>
								<Chip sx={{opacity: .8, mb: 1}} label={"Step 3"} />
								<Typography variant="h5">
									Configure layers & traits
								</Typography>
								<Typography variant="body">
									Go through individual traits and set rarity
								</Typography>
							</Box>

							<Box>
								<FormLabel>
									Edit Layer Name
								</FormLabel>
								<TextField
									placeholder="e.g. background"
									name="name" 
									value={layers[selected]?.name}
									onChange={onChange} 
									fullWidth
								/>
							</Box>
						</Stack>
						<Divider />
						<Stack sx={{p: 2, background: 'white', borderRadius: 2}}>
							<Typography variant="h6">
								Edit layer rarity
							</Typography>
							<Typography variant="body">
								There is a {layers[selected].weight}% chance {layers[selected].name} will appear.
							</Typography>

							<Stack gap={2} direction="row">
								<Slider
									name="weight"
									value={layers[selected].weight}
									onChange={onChange}
								/>
								<Chip label={`${Math.round(layers[selected].weight)}%`} />
							</Stack>
						</Stack>
					</Box>
						
					<Box>
						{selectedImage !== null && (
							<Stack gap={2} sx={{p: 2, background: 'white', borderRadius: 2}}>
								<Box>
									<Stack gap={1} direction="row">
										<Typography variant="h6">
											Edit trait name for
										</Typography>
										<Grid xs={1} item>
											<img style={{borderRadius: '4px'}} src={layers[selected].images[selectedImage].preview} />
										</Grid>
									</Stack>
									<TextField 
										name="name"
										value={layers[selected]?.images[selectedImage]?.name}
										onChange={e => onImageRarityChange(e, selectedImage)}
										placeholder="e.g. sunglasses"
										fullWidth 
									/>
								</Box>
								<Divider />

								<Stack gap={1}>
									<Stack gap={1} direction="row">
										<Typography variant="body">
											Edit trait rarity
										</Typography>
										<Grid sx={{mr: 1}} xs={1} item>
											<img style={{borderRadius: '2px'}} src={layers[selected].images[selectedImage].preview} />
										</Grid>
									</Stack>

									<Stack alignItems="center" direction="row">
										<Chip label="Rare" />
										<Slider
											name="weight"
											defaultValue={30}
											min={10}
											max={50}
											step={10}
											marks
											value={layers[selected]?.images[selectedImage]?.weight}
											onChange={e => onImageRarityChange(e, selectedImage)}
										/>
										<Chip label="Common" />
									</Stack>
								</Stack>

							</Stack>
						)}
					</Box>
				</>
				)}
				<Box p={2} sx={{background: 'white'}}>
					{/*
					<Button fullWidth variant="outlined" onClick={() => generateImages()}>
						Generate Collection
					</Button>
					*/}

					<Button onClick={() => {
						if(validateForm()) {
							setIsCheckoutModalOpen(true)
						}
					}} fullWidth variant="outlined">
						Generate Collection
					</Button>
				</Box>

		</Stack>
	)
};

export default Settings;
