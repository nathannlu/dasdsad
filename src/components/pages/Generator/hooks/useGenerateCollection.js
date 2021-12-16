import FileSaver from 'file-saver';
import JSZip from 'jszip';

import Worker from "../workers/generator.worker.js";
const worker = new Worker();

import { useCollection } from 'libs/collection';
import { useState } from 'react';
import { useToast } from 'ds/hooks/useToast';
import { generateOneImage } from '../scripts/generate';


export const useGenerateCollection = () => {
	const { layers, settingsForm } = useCollection();
	const { name, description, collectionSize } = settingsForm;

	const { addToast } = useToast()
	const [progress, setProgress] = useState();
	const [generatedZip, setGeneratedZip] = useState('');
	const [done, setDone] = useState(false);

	// This will need to talk to web worker
	const generateImages = async () => {
		setDone(false);
		setProgress(null);

		// Runs check
		if (collectionSize.value > 10000) {
			addToast({
				severity: 'error',
				message: 'This value must be 10000 or under'
			})
			return;
		}
		if (collectionSize.value.length < 1) {
			addToast({
				severity: 'error',
				message: 'This value cannot be left empty'
			})
			return;
		}
		addToast({
			severity: 'info',
			message: 'Generating collection. This will take a some time...'
		})

		// Worker
		worker.postMessage({
			message:'generate',
			settings: {
				name: name.value,
				description: description.value
			},
			layers: [...layers],
			count: collectionSize.value
		})	

	};

	const initWorker = () => {
		worker.onmessage = (message) => {
			if (message.data.message == 'output') {
				setGeneratedZip(message.data.content);
				//console.log(message.data.content);

				FileSaver.saveAs(message.data.content, 'sample.zip')
				setDone(true);
			}
			if (message.data.message == 'progress') {
				setProgress(message.data.progress)
			}
		}
	}
	

	return {
		generateImages,
		generatedZip,
		setGeneratedZip,
		initWorker,
		worker,
		done,
		progress
	}
}
