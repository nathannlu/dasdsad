import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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



	// a little function to help us with reordering the result
	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);

		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
		setSelected(endIndex)

		return result;
	};


	const onDragEnd = result => {
		if (!result.destination) {
			return;
		}

		const items = reorder([...layers], result.source.index, result.destination.index);
		setLayers(items)

	}


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
					<DragDropContext onDragEnd={onDragEnd}>
						<Droppable droppableId="droppable">
							{(provided, snapshot) => (
							<div
								{...provided.droppableProp}
								ref={provided.innerRef}
							>
							{layers.map((item, i) => (
								<Draggable
									key={item.name}
									draggableId={item.name}
									index={i}
								>
									{(provided, snapshot) => (
									<Card 
										{...provided.draggableProps}
										{...provided.dragHandleProps}
										ref={provided.innerRef}
										sx={selected == i ? {border: '1px solid blue', p:2, cursor: 'pointer'} : {p: 2, cursor: 'pointer'}} 
										style={{...provided.draggableProps.style}}
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
									)}
								</Draggable>
							))}
								{provided.placeholder}
							</div>

								
							)}
						</Droppable>
					</DragDropContext>

					<Card sx={{p: 2, borderRadius: 2, boxShadow: '0 0 10px rgba(0,0,0,.25)'}}>
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
