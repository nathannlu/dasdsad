//import mergeImages from 'merge-images';
import mergeImages from 'merge-base64';
import { pickRandom, pickWeighted, includeWeightedLayer } from './helpers';
import { urltoFile, readFileAsBufferArray } from 'utils/imageData';

// Layers array expects objects with property 'images'
// returns an image
export const generateOneImage = async ({settings, layers, filename}) => {
	let toBeMerged = []
	let metadata = generateMetadata(settings, filename);
	let video = null;

	// pick a random image from every layer
	for(let i = 0; i < layers.length; i++) {
		if (includeWeightedLayer(layers[i])) {

			const pickedImage = await pickWeighted(layers[i].images);

			if (pickedImage.type == 'image/png') {
				toBeMerged.push(pickedImage.base64.split(',').pop())		// errors our sometimes, reading undefined of 'base64'
			}
			if (pickedImage.type == 'video/mp4') {
				video = pickedImage;
			}

			/*
			metadata.attributes.push({
				trait_type: layers[i].name,
				value: pickedImage.name
			})
			*/
		}
	}

	// merge images
	let b64 = await mergeImages(toBeMerged)
	b64 = 'data:image/png;base64,' + b64.split(',').pop()
	console.log('png',b64)
	console.log('l',toBeMerged[0].base64)
	const png = await urltoFile(b64, `${filename}.png`, 'image/png');
//	console.log(png)

	// if has video, merge all images without the video
	// send video and compiled images to videoWorker and wait for response


	if (video !== null) {
		console.log('png', png)
		console.log('l', layers[1].images[0].file)

		return [png, video.file, metadata];
	} else {

		return [png, metadata];
	}
};

const mergeImageVideo = async (video, png, totalMemory = 33554432) => {
	const file1 = {
		name: 'input.mp4',
		data: new Uint8Array(await readFileAsBufferArray(video))
	}
	const file2 = {
		name: 'image.png',
		data: new Uint8Array(await readFileAsBufferArray(png))
	}


	/*
	videoWorker.postMessage({
		type: 'command',
		files: [file1, file2],
		arguments: [
//				'-y',
			'-i', 'input.mp4',
			'-i', 'image.png',
			'-filter_complex',"overlay=25:25:enable='between(t,0,20)'",
			'-pix_fmt','yuv420p','-c:a','copy',
			'output.mp4'
		],
		totalMemory: 1073741824
	})
	*/
	
}

// @TODO change file type
const generateMetadata = (settings, filename) => {
	let metadata = {
		name: `#${filename}`,
		description: settings.description,
		attributes: [],
		properties: {
			category: 'image',
			files: [
				{
					uri: `${filename}.png`,
					type: 'image/png',
				}
			],
			creators: []
		},
		compiler: 'https://nftdatagen.com'
	}

	const json = JSON.stringify(metadata, null, 2)			// stringify with whitespace

	return json;
};










// Generates combinations based on collection size
export const createCollectionCombinations = async (layers, collectionSize) => {
	let collectionCombinations = [];

	for(let i = 0; i < collectionSize; i++) {
		const toBeMerged = await createCombination(layers);
		collectionCombinations.push(toBeMerged);
	}

	return collectionCombinations;
};

// Returns a combination (arr of b64) based on provided layer options; ready to be merged
const createCombination = async layers => {
	let toBeMerged = [];

	// Go through layers and pick a trait
	for(let i = 0; i < layers.length; i++) {

		// Handles layer rarity
		if (includeWeightedLayer(layers[i])) {

			// Pick image and push to array
			const pickedImage = await pickWeighted(layers[i].images);
			const b64 = pickedImage.base64.split(',').pop()
			toBeMerged.push(b64)
		}
	}
	
	return toBeMerged;
};

// Loops through collectionCombinations and merges the b64
export const mergeCollectionCombinations = async (collectionCombinations) => {
	let output = [];
	
	for( let i = 0; i < collectionCombinations; i++) {
		await mergeCombination(collectionCombinations[i]);	
	}

	return output;
};

const mergeCombination = async (toBeMerged) => {

	// @TODO add check for file type; if video delegate to videoworker 

	b64 = await mergeImages(toBeMerged)
	const png = await urltoFile(b64, `${filename}.png`);

	return png;
};


