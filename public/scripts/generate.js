import mergeImages from 'merge-images';

const sampleLayer = {
	name: '',
	rarity: .5,
	images: [
		{preview: '', rarity: .33},
		{preview: '', rarity: .33},
		{preview: '', rarity: .33} ,
	]
};

const sampleLayers = [sampleLayer, sampleLayer, sampleLayer]

const metaData = {};



// Layers array expects objects with property 'images'
export const generateOneImage = async (layers) => {
	let toBeMerged = []	

	// pick a random image from every layer
	layers.forEach(layer => {
//		console.log(layer)
		let pickedImage =  layer.images[pickRandom(layer.images)]
//		console.log(pickedImage)
		toBeMerged.push(pickedImage.preview)
	})


	// merge all layers together
//	console.log('tbd', toBeMerged)
	const b64 = await mergeImages(toBeMerged);
//	console.log(b64)
	const png = dataURLtoFile(b64, '1.png')
	return png;
};

export const generateImages = async (layers, count) => {
	let images = []

	for(let i = 0; i < count; i++) {
		const generatedImage = await generateOneImage(layers)	
		images.push(generatedImage)
	}

	return images;
};

/*
export const generateImages = async (layers, collectionSize) => {
	const asd = new Promise((resolve, reject) => {
		let listOfImages = []
		let iterate = Array.apply(null, Array(5)).map(function () {})

		iterate.forEach(async (_, i) => {
			let newImage = await generateOneImage(layers)
			//console.log(newImage)

			listOfImages.push(newImage);
		})	

		resolve(listOfImages);
//		return listOfImages;
	})

	return asd;
};
*/

/*
const generateMetadataObject = (id, images) => {
	metaData[id] = {
		name: config.metaData.name + '#' + id,
		description: config.metaData.description,
		image: config.imageUrl + id,
		attributes: [],
	}

	images.forEach((image, i) => {
		let pathArray = images.split('/');

		metaData[id].attributes.push({
			trait_type: traits[i],
			value: ''// names[fileToMap]
		})


	})
};
*/

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
	
