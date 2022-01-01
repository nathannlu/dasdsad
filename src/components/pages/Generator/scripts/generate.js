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

			metadata.attributes.push({
				trait_type: layers[i].name,
				value: pickedImage.name,
			})
		}
	}

	// merge images
	let b64 = await mergeImages(toBeMerged)
	b64 = 'data:image/png;base64,' + b64.split(',').pop()
	const png = await urltoFile(b64, `${filename}.png`, 'image/png');
	const json = JSON.stringify(metadata, null, 2)			// stringify with whitespace

	// if has video, merge all images without the video
	// send video and compiled images to videoWorker and wait for response
	if (video !== null) {
		return [png, video.file, json];
	} else {
		return [png, json];
	}
};


// @TODO change file type
const generateMetadata = (settings, filename) => {
	let metadata = {
		name: `#${filename}`,
		description: settings.description,
		attributes: [],
		properites: {
			category: 'png',
			files: [
				{
					uri: `${filename}.png`,
					type: 'image/png'
				}
			],
			creators: [],
		},
		compiler: 'https://nftdatagen.com'
	}


	return metadata;
};

