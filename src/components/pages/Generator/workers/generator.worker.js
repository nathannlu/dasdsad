import JSZip from 'jszip';
import { generateOneImage } from '../scripts/generate';


self.onmessage = async (event) => {
	const { message, count, layers, settings } = event.data;

	if (event && event.data && message === 'generate') {
		const zip = new JSZip();
		let collectionMetadata = {
			name: settings.name,
			description: '',
			collection: []
		};

		// Loop over count and compile
		for(let i = 0; i < count; i++) {
			let filename = i + 1;
			const generatedImage = await generateOneImage({settings, layers, filename})

			// Add data to metadata
			collectionMetadata.collection.push(JSON.parse(generatedImage[1]));

			// Zip files
			zip.file(`assets/${filename}.png`, generatedImage[0]);
			zip.file(`metadata/${filename}.json`, generatedImage[1]);

			// Update client on progress
			self.postMessage({message: 'progress', progress: i});
		}

		// After done looping over, build final metadata
		zip.file(`metadata/metadata.json`, JSON.stringify(collectionMetadata, null, 2));

		// Compile whole zip and forward to client
		zip.generateAsync({type: 'blob'}, (x) => {
			self.postMessage({message: 'zip_progress', zipProgress: x.percent});
		})
		.then(content => {
			self.postMessage({message: 'output', content});
		})
	}
};

