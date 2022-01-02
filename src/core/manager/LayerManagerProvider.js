import React, { useState } from 'react';
import { LayerManagerContext } from './LayerManagerContext';
import posthog from 'posthog-js';

const initialLayersState = [
	{
		name: 'Background',
		weight: 100,
		images: [],
	}
];

export const LayerManagerProvider = ({children}) => {
	const [layers, setLayers] = useState(initialLayersState);
	const [selected, setSelected] = useState(0);

	const addLayer = (newLayer) => {
		setLayers(prevState => {
			prevState.push(newLayer)
			return [...prevState];
		})

		posthog.capture('User added layer to their collection');
	}

	const deleteLayer = (index) => {
		setLayers(prevState => {
			prevState.splice(index, 1);
			return [...prevState]
		});
	}

	const updateLayers = (index, updatedLayer) => {
		setLayers(prevState => {
			prevState[index] = {...prevState[index], ...updatedLayer};

			return [...prevState]
		});
	}

	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
		setSelected(endIndex)
		return result;
	};

	// Layer drag & drop handler
	const onDragEnd = result => {
		if (!result.destination) {
			return;
		}
		const items = reorder([...layers], result.source.index, result.destination.index);
		setLayers(items)
	}

	const value = {
		query: { layers, selected },
		actions: { addLayer, deleteLayer, updateLayers, setLayers, setSelected, reorder, onDragEnd }
	}
		
	return (
		<LayerManagerContext.Provider value={value}>
			{children}
		</LayerManagerContext.Provider>
	)
}
