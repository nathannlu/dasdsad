
import JSZip from 'jszip';
import { useCollection } from 'libs/collection';
import { useState } from 'react';
import { useToast } from 'ds/hooks/useToast';

import { generateOneImage } from '../scripts/generate';


export const useGenerateCollection = () => {
	const { layers, collectionSize } = useCollection();
	const { addToast } = useToast()
	const [generatedZip, setGeneratedZip] = useState('');
	const [done, setDone] = useState(false);

	// This will need to talk to web worker
	const generateImages = async () => {
		setDone(false);
		if (collectionSize.value > 100) {
			addToast({
				severity: 'error',
				message: 'This value must be 100 or under'
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
			message: 'Generating collection. This will take a minute...'
		})

		const zip = new JSZip();

		for(let i = 0; i < collectionSize.value; i++) {
			const image = await generateOneImage(layers)	
			zip.file(`images/${i}.png`, image);
			console.log(i);
		}

		zip.generateAsync({type: 'base64'}).then(content => {
			setGeneratedZip(content)
			setDone(true);
			addToast({
				severity: 'success',
				message: 'Finished compiling!'
			})
		})

		setDone(true);
	};


	return {
		generateImages,
		generatedZip,
		done
	}
}
