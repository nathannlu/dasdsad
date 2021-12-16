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
	layers.forEach((layer, i) => {
		if (includeWeightedLayer(layer)) {
			const pickedImage = pickWeighted(layer.images);

			toBeMerged.push(pickedImage.base64.split(',').pop())
			metadata.attributes.push({
				trait_type: layer.name,
				value: pickedImage.name
			})	

		}
	})

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

