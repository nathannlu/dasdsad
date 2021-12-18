import mergeImages from 'merge-base64';
import { pickRandom, pickWeighted, includeWeightedLayer } from './helpers';
import { urltoFile } from 'utils/imageData';

// Layers array expects objects with property 'images'
// returns an image
export const generateOneImage = async ({settings, layers, filename}) => {
	let b64;
	let toBeMerged = []
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

	// pick a random image from every layer
	for(let i = 0; i < layers.length; i++) {
		if (includeWeightedLayer(layers[i])) {

			const pickedImage = await pickWeighted(layers[i].images);

			console.log(pickedImage)

			toBeMerged.push(pickedImage.base64.split(',').pop())		// errors our sometimes, reading undefined of 'base64'
			metadata.attributes.push({
				trait_type: layers[i].name,
				value: pickedImage.name
			})	
		}

	}

	// merge all layers together
//	if (toBeMerged.length > 1) {
		b64 = await mergeImages(toBeMerged);
//	} else {
//		b64 = ''
//	}

	const png = await urltoFile(b64, `${filename}.png`);
	const json = JSON.stringify(metadata, null, 2)			// stringify with whitespace
	return [png, json];
};

