import React, { useState, useRef } from 'react';
import { useToast } from 'ds/hooks/useToast';
import { GeneratorContext } from './GeneratorContext';
import { useMetadata } from 'services/generator/controllers/metadata';
import { useLayerManager } from 'services/generator/controllers/manager';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import posthog from 'posthog-js';

export const GeneratorProvider = ({children}) => {
	const [renderModalState, setRenderModalState] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const canvasRef = useRef();

	// Generator Information
	const { settingsForm } = useMetadata();
	const { query: { layers }} = useLayerManager();
	const { name, description, size, metadata } = settingsForm;
	const { addToast } = useToast();

	const generateImages = async () => {
		if(!validateForm()) return;
		setRenderModalState(true);

	};

	const validateForm = () => {
		if (size.value.length < 1) {
			addToast({
				severity: 'error',
				message: 'Collection Size value cannot be left empty'
			})
			return false;
		}
		for(let i = 0; i < layers.length; i++) {
			if(layers[i].images.length == 0) {
				addToast({
					severity: 'error',
					message: `Layer '${layers[i].name}' cannot have 0 traits. Please add a trait or remove the layer`
				});
				return false;
			}
		}
		return true;
	}
	

	const value = {
		canvasRef,
		renderModalState,
		isGenerating,

		validateForm,
		generateImages,
		setRenderModalState,
		setIsGenerating,
	}
		
	return (
		<GeneratorContext.Provider value={value}>
			{children}
		</GeneratorContext.Provider>
	)
}
