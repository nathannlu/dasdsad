import React, { useState, useEffect } from 'react';
import { Stack, Box, Button, Grid, Card, Typography, TextField, IconButton, Divider, Slider } from 'ds/components';
import { Chip } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useGenerateCollection } from './hooks/useGenerateCollection';
import { useLayerManager } from './hooks/useLayerManager';
import { useTraitsManager } from './hooks/useTraitsManager';
import { useCollection } from 'libs/collection';
import { dataURItoBlob } from 'utils/imageData';


const Layers = () => {
	const { layers, setLayers, selected, setSelected, listOfWeights, setListOfWeights } = useCollection();
	const {
		newLayerForm,
		onSubmit,
		deleteLayer,
	} = useLayerManager();
	const {
		generateImages,
		generatedZip,
		initWorker,
		done,
		progress
	} = useGenerateCollection()

	useEffect(initWorker, [])



	return (
		<Stack gap={2}>
			<Stack gap={2} sx={{p: 2, background: 'white', borderRadius: 2}}>
				<Typography variant="h4">
					Layers
				</Typography>
				<Typography variant="body">
					Add a layer here to get started.
				</Typography>

				<Stack gap={2}>
					{layers.map((item, i) => (
						<Card 
							key={i}
							sx={{p: 2, cursor: 'pointer'}} 
							style={selected == i ? {border: '1px solid blue'} : {}}
						>
							<Stack direction="row" alignItems="center">
								<Box sx={{flex: 1}} onClick={() => setSelected(i)}>
									{item.name}
								</Box>
								<IconButton onClick={() => deleteLayer(i)}>
									<DeleteIcon />
								</IconButton>
							</Stack>
						</Card>
					))}

					<Card sx={{p: 2}}>
						<form onSubmit={onSubmit}>
							<Stack direction="row" alignItems="center">
								<TextField {...newLayerForm.name} fullWidth />
								<IconButton type="submit">
									<AddIcon />
								</IconButton>
							</Stack>
						</form>
					</Card>
				</Stack>

				<Divider />

				<Stack direction="column" gap={2}>
					<Button variant="outlined" onClick={() => generateImages()}>
						Generate Collection
					</Button>
				</Stack>
			</Stack>

			{generatedZip && (
				<a href={"data:application/zip;base64,"+generatedZip} >
					<Button variant="contained">
						Download collection
					</Button>
				</a>
			)}
		</Stack>
	)
};

export default Layers;
