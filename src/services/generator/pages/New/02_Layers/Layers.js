import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
    Stack,
    Box,
    Button,
    Card,
    Typography,
    TextField,
    IconButton,
} from 'ds/components';
import { Chip } from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Layers as LayersIcon,
} from '@mui/icons-material';
import { useLayerManager } from 'services/generator/controllers/manager';
import { useNewLayerForm } from '../hooks/useNewLayerForm';

const layerStyle = {
    border: '1px solid rgba(255, 255, 255, 1)',
    borderRadius: 2,
    py: 1,
    px: 2,
    cursor: 'pointer',
    background: 'rgb(25,26,36)',
    backdropFilter: 'blur(3px)',
    color: 'white',
};

const Layers = () => {
    const {
        actions,
        query: { layers },
        actions: { deleteLayer, reorder, onDragEnd },
    } = useLayerManager();
    const { newLayerForm, onSubmit } = useNewLayerForm();

    return (
        <Stack gap={2}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <Stack
                            {...provided.droppableProp}
                            ref={provided.innerRef}
                            gap={2}>
                            {layers
                                .map((item, i) => (
                                    <Draggable
                                        key={item.name}
                                        draggableId={item.name}
                                        index={i}>
                                        {(provided, snapshot) => (
                                            <Card
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                                sx={{
                                                    ...layerStyle /*boxShadow: selected == i ? '0 0 10px rgba(0,0,0,.25)' : '0 0 10px rgba(0,0,0,.1)'*/,
                                                }}
                                                style={{
                                                    ...provided.draggableProps
                                                        .style,
                                                }}>
                                                <Stack
                                                    direction="row"
                                                    sx={{ opacity: 0.8 }}
                                                    alignItems="center">
                                                    <LayersIcon />
                                                    <Box
                                                        sx={{ flex: 1 }}
                                                        ml=".5em">
                                                        {item.name}
                                                    </Box>
                                                    <IconButton
                                                        onClick={() =>
                                                            deleteLayer(i)
                                                        }
                                                        style={{
                                                            color: 'white',
                                                        }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Stack>
                                            </Card>
                                        )}
                                    </Draggable>
                                ))
                                .reverse()}
                            {provided.placeholder}
                        </Stack>
                    )}
                </Droppable>
            </DragDropContext>

            <form onSubmit={onSubmit}>
                <Stack
                    sx={{ opacity: 0.8 }}
                    direction="row"
                    alignItems="center">
                    <TextField
                        size="small"
                        variant="standard"
                        {...newLayerForm.name}
                        fullWidth
                    />
                    <IconButton type="submit">
                        <AddIcon />
                    </IconButton>
                </Stack>
            </form>
        </Stack>
    );
};

export default Layers;
