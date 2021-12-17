import React from 'react';
import { Typography, Stack, Box, Grid, Fade, TextField, FormLabel, IconButton, Divider, Slider } from 'ds/components';
import { Chip } from '@mui/material';
import { useCollection } from 'libs/collection';
import { useLayerManager } from './hooks/useLayerManager';
import { useTraitsManager } from './hooks/useTraitsManager';

const Settings = () => {
	const {
		layers,
		selected,
		selectedImage,
		listOfWeights,
		setListOfWeights,
		settingsForm
	} = useCollection();
	const { onChange } = useLayerManager();
	const { onChange: onImageRarityChange } = useTraitsManager();


	return (
		<Stack gap={2}>
			<Stack gap={2} sx={{p: 2, background: 'white', borderRadius: 2}}>
				<Box>
					<Chip sx={{opacity: .8, mb: 1}} label={"Step 3"} />
					<Typography variant="h5">
						Settings
					</Typography>
					<Typography variant="body">
						Edit fields below to configure your metadata
					</Typography>
				</Box>

				<Box>
					<FormLabel>Name</FormLabel>
					<TextField {...settingsForm.name} fullWidth />
				</Box>

				<Box>
					<FormLabel>Description</FormLabel>
					<TextField  {...settingsForm.description} fullWidth/>
				</Box>

				<Box>
					<FormLabel>Collection Size</FormLabel>
					<TextField  {...settingsForm.collectionSize} fullWidth />
				</Box>
			</Stack>

			{selected !== null && (
				<>
					<Box>
						<Stack sx={{p: 2, background: 'white', borderRadius: 2}}>
							<Typography variant="h6">
								Edit Layer Name
							</Typography>
							<TextField
								placeholder="e.g. background"
								name="name" 
								value={layers[selected]?.name}
								onChange={onChange} 
							/>
						</Stack>
						<Divider />
						<Stack sx={{p: 2, background: 'white', borderRadius: 2}}>
							<Typography variant="body">
								Edit layer rarity
							</Typography>

							<Stack direction="row">
								<Slider
									name="weight"
									value={layers[selected].weight}
									onChange={onChange}
								/>
								<Chip label={Math.round(layers[selected].weight)} />
							</Stack>
						</Stack>
					</Box>
						
					<Box>
						{layers[selected].images.length > 0 && (
							<Stack gap={2} sx={{p: 2, background: 'white', borderRadius: 2}}>
								{selectedImage !== null && (
									<>
									<Box>
										<Stack direction="row">
											<Typography variant="h6">
												Edit trait name for
											</Typography>
											<Grid xs={1} item>
												<img src={layers[selected].images[selectedImage].preview} />
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
									</>
								)}
								<Box>
									<Typography variant="body">
										Edit image rarity
									</Typography>
									{layers[selected].images.map((image, i) => (
										<Stack key={i} direction="row">
											{/*

											<Box>
												{(image.weight/listOfWeights.reduce((acc, a) => acc + a, 0) * 100).toFixed(2)}%
											</Box>
											<button onClick={() => {
												let asd =layers[selected].images.reduce((acc, a) => acc + a.weight, 0)
												console.log(asd)
											}}>
												test
											</button>
											*/}
											<Grid xs={1} item>
												<img src={image.preview} />
											</Grid>
											<Slider
												name="weight"
												defaultValue={50}
												onChange={e => {
													/*
													setListOfWeights(prevState => {
														prevState[i] = e.target.value
														return [...prevState]
													})
													*/
													onImageRarityChange(e,i)
												}}
											/>
										</Stack>
									))}
								</Box>
							</Stack>
						)}
					</Box>
				</>
				)}
		</Stack>
	)
};

export default Settings;
