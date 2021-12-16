import mergeImages from 'merge-images';

const sampleLayer = {
	name: '',
	rarity: .5,
	images: [
		{name: '', preview: '', rarity: .33},
		{preview: '', rarity: .33},
		{preview: '', rarity: .33} ,
	]
};

const sampleLayers = [sampleLayer, sampleLayer, sampleLayer]


// Layers array expects objects with property 'images'
export const generateOneImage = async (layers) => {
	let toBeMerged = []
	let metadata = { attributes: []}

	// pick a random image from every layer
	layers.forEach((layer, i) => {
		let pickedImage = pickWeighted(layer.images);
		toBeMerged.push(pickedImage.preview)

		metadata.attributes.push({trait_type: layer.name, value: pickedImage.name})	
	})

	// merge all layers together
	const b64 = await mergeImages(toBeMerged);
	const png = dataURLtoFile(b64, '1.png')

	return [png, metadata];
};

/*
const generateMetadata = () => {
	const newMetadata = {
		name: '',
		description: '',
		external_url: '',
		image: '',
		attributes: [
			{
				"trait_type": "Background",
				value: 'name',
			}
		]
	}

	return newMetadata
};
*/

export const generateImages = async (layers, count) => {
	let images = []

	for(let i = 0; i < count; i++) {
		const generatedImage = await generateOneImage(layers)	
		images.push(generatedImage)
	}

	return images;
};




// --
// HELPERS
// --
//GENERATES RANDOM NUMBER BETWEEN A MAX AND A MIN VALUE
function randomNumber(min, max) {
 return Math.round(Math.random() * (max - min) + min);
}
//PICKS A RANDOM INDEX INSIDE AN ARRAY RETURNS IT AND THEN REMOVES IT
function pickRandomAndRemove(array) {
  const toPick = randomNumber(0, array.length - 1);
  const pick = array[toPick];
  array.splice(toPick, 1);
  return pick;
}

//PICKS A RANDOM INDEX INSIDE AND ARRAY RETURNS IT
function pickRandom(array) {
  return randomNumber(0, array.length - 1);
}

// images = [{preview: '', rarity: .3}, {preview: '', rarity: .1}]
// [0, .3]
// [.3, .4]
// [.4, 1]
function pickWeighted(array) {
	let prev = 0;
	let asd = null;
	const random = Math.random() // returns e.g. .6

	for(let item of array) {
		if (random < item.rarity + prev) {
			return item;
		} else {
			prev += item.rarity;
		}	
	};
}

function dataURLtoFile(dataurl, filename) {
		var arr = dataurl.split(','),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]), 
				n = bstr.length, 
				u8arr = new Uint8Array(n);
				
		while(n--){
				u8arr[n] = bstr.charCodeAt(n);
		}
		
		return new File([u8arr], filename, {type:mime});
}
	
