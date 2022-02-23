import React, { useState } from 'react';
import { useToast } from 'ds/hooks/useToast';
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
	const { addToast } = useToast();

	const addLayer = (newLayer) => {
		try {
			const indexOfNewLayer = layers.findIndex((layer) => layer.name === newLayer.name);
			if (indexOfNewLayer !== -1) throw new Error('You cannot add layer with the same name');

			setLayers(prevState => {
				prevState.push(newLayer)
				return [...prevState];
			})

			posthog.capture('User added layer to their collection');
		}
		catch (err) {
			addToast({
				severity: 'error',
				message: err.message
			})
		}
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
		if (result.some(layer => layer.name == 'Background')) {
			if(result.findIndex(layer => layer.name == 'Background') !== 0) {
				addToast({
					severity: 'warning',
					message: 'Your Background layer is no longer the last layer. Any images covered by the Background layer will not appear in your generated collection.'
				});
			}
		};
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
