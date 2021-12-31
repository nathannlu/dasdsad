import JSZip from 'jszip';
import { generateOneImage } from '../scripts/generate';
import { readFileAsBufferArray } from 'utils/imageData';
importScripts('ffmpeg.js')


self.onmessage = async (event) => {
	const { message, command, count, layers, settings } = event.data;

	if(event && event.data && message === 'generate') {
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

			// Has video that needs to be merged
			if(generatedImage.length == 3) {
				const png = generatedImage[0];
				const video = generatedImage[1]

				console.log(video, png)

				const data = await mergeImageVideo(video, png)

				const mp4 = new File([data[0].data], filename, {type:'video/mp4'});
				collectionMetadata.collection.push(JSON.parse(generatedImage[2]));

				zip.file(`assets/${filename}.mp4`, mp4);
				zip.file(`metadata/${filename}.json`, generatedImage[2]);
			} else {

				const png = generatedImage[0];
				collectionMetadata.collection.push(JSON.parse(generatedImage[1]));

				zip.file(`assets/${filename}.png`, png);
				zip.file(`metadata/${filename}.json`, generatedImage[1]);
			}

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


function print(text) {
	console.log({ type: "stdout", data: text });
}
const mergeImageVideo = async (video, png) => {
	const file1 = {
		name: 'input.mp4',
		data: new Uint8Array(await readFileAsBufferArray(video))
	}
	const file2 = {
		name: 'image.png',
		data: new Uint8Array(await readFileAsBufferArray(png))
	}
	const message = {
		files: [file1, file2],
		arguments: [
			'-i', 'input.mp4',
			'-i', 'image.png',
			'-filter_complex',"overlay=25:25:enable='between(t,0,20)'",
			'-pix_fmt','yuv420p','-c:a','copy',
			'output.mp4'
		],
		totalMemory: 1073741824
	}
	const Module = {
		print: print,
		printErr: print,
		files: message.files || [],
		arguments: message.arguments || [],
		TOTAL_MEMORY: message.totalMemory || 33554432
	};
	const result = await ffmpeg_run(Module);
	return result;
}
