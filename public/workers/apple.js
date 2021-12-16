// jimport  generateImages  from '../scripts/generate.js'
//const { generateImages } = require('../scripts/generate.js')


self.onmessage = async (event) => {
	if (event && event.data && event.data.msg === 'generate') {
		self.postMessage("Generating...");
		const generatedImages = await generateImages(event.data.layers, event.data.count);
		self.postMessage(generatedImages);
		self.postMessage("Done!");
	}
};


// Layers array expects objects with property 'images'
const generateOneImage = async (layers) => {
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

const generateImages = async (layers, count) => {
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

