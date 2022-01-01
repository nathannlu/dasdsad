import { useState } from 'react';
import { useToast } from 'ds/hooks/useToast';
import { useMetadata } from 'core/metadata';
import { useLayerManager } from 'core/manager';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import posthog from 'posthog-js';

import Worker from "components/pages/Generator/workers/generator.worker.js";
const worker = new Worker();


export const useGenerator = () => {
	const { settingsForm } = useMetadata();
	const { query: { layers }} = useLayerManager();
	const { name, description, collectionSize } = settingsForm;
	const { addToast } = useToast()

	const [done, setDone] = useState(false);
	const [progress, setProgress] = useState(0);
	const [zipProgress, setZipProgress] = useState(null);
	const [generatedZip, setGeneratedZip] = useState('');


	// This will need to talk to web worker
	const generateImages = async () => {
		setDone(false);
		setProgress(null);
		setZipProgress(null);

		// Runs check
		if(validateForm()) {
			worker.postMessage({
				message:'generate',
				settings: {
					name: name.value,
					description: description.value
				},
				layers: [...layers],
				count: collectionSize.value
			})

			addToast({
				severity: 'info',
				message: 'Generating collection. This will take a some time...'
			})
		}
	};

	const save = () => {
		FileSaver.saveAs(generatedZip, 'sample.zip')
		posthog.capture('User downloaded collection');
	}

	const validateForm = () => {
		if (collectionSize.value.length < 1) {
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


	const listenToWorker = () => {
		worker.onmessage = (message) => {
			if (message.data.message == 'output') {
				setGeneratedZip(message.data.content);

				addToast({
					severity: 'success',
					message: 'Finished generation!'
				})
				setDone(true);
			}
			
			if (message.data.message == 'progress') {
				setProgress(++message.data.progress)
			}
			if (message.data.message == 'zip_progress') {
				setZipProgress(message.data.zipProgress)
			}
		}
	}
	


	return {
		listenToWorker,
		save,
		validateForm,
		generateImages,
		done,
		progress,
		zipProgress
	}
}
