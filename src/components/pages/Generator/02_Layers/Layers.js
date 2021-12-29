import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Stack, Box, Button, Grid, Card, Typography, TextField, IconButton, Divider, Slider, FormLabel } from 'ds/components';
import { Chip } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useLayerManager } from '../hooks/useLayerManager';
import { useCollection } from 'libs/collection';

import LayersIcon from '@mui/icons-material/Layers';

const layerStyle = {
	border:  '1px solid rgba(255, 255, 255, 1)',
	borderRadius: 2,
	py:1,
	px:2,
	cursor: 'pointer',
	background: 'rgba(0,0,0,.53)',
	backdropFilter: 'blur(3px)',
	color: 'white'
}

const Layers = () => {
	const { layers, setLayers, selected, setSelected, listOfWeights, setListOfWeights } = useCollection();
	const {
		newLayerForm,
		onSubmit,
		deleteLayer,
		reorder,
		onDragEnd,
	} = useLayerManager();
	
	return (
		<Stack gap={2}>
			<Box>
				<Chip sx={{opacity: .8, mb: 1}} label={"Step 2/4"} />
				<Typography variant="h2">
					Create layers
				</Typography>
				<Typography variant="body">
					Add a layer here to get started.
				</Typography>
			</Box>

			<Stack gap={2}>
				<DragDropContext onDragEnd={onDragEnd}>
					<Droppable droppableId="droppable">
						{(provided, snapshot) => (
						<Stack
							{...provided.droppableProp}
							ref={provided.innerRef}
							gap={2}
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
									sx={{...layerStyle, /*boxShadow: selected == i ? '0 0 10px rgba(0,0,0,.25)' : '0 0 10px rgba(0,0,0,.1)'*/}}
									style={{...provided.draggableProps.style}}
								>
									<Stack direction="row" sx={{opacity: .8}} alignItems="center">
										<LayersIcon />
										<Box sx={{flex: 1}}>
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

						</Stack>
						)}
					</Droppable>
				</DragDropContext>

					<form onSubmit={onSubmit}>
						<Stack sx={{opacity: .8}} direction="row" alignItems="center">
							<TextField size="small" variant="standard" {...newLayerForm.name} fullWidth />
							<IconButton type="submit">
								<AddIcon />
							</IconButton>
						</Stack>
					</form>
			</Stack>
		</Stack>
	)
};

export default Layers;
