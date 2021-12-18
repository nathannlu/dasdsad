// --
// HELPERS
// --
//GENERATES RANDOM NUMBER BETWEEN A MAX AND A MIN VALUE
export function randomNumber(min, max) {
 return Math.round(Math.random() * (max - min) + min);
}
//PICKS A RANDOM INDEX INSIDE AN ARRAY RETURNS IT AND THEN REMOVES IT
export function pickRandomAndRemove(array) {
  const toPick = randomNumber(0, array.length - 1);
  const pick = array[toPick];
  array.splice(toPick, 1);
  return pick;
}

//PICKS A RANDOM INDEX INSIDE AND ARRAY RETURNS IT
export function pickRandom(array) {
  return randomNumber(0, array.length - 1);
}



// images = [{preview: '', weight: 30}, {preview: '', weight: 10}]
// takes in layer images
export async function pickWeighted(array) {
	const totalWeights = await array.reduce((acc, a) => acc + a.weight, 0)
	const random = randomNumber(1, totalWeights)

	//console.log("total w",totalWeights)
	//console.log("r", random)

	let prev = 0;
	for(let item of array) {
		//console.log('pick w', item)

		if (random <= item.weight + prev) {
			//console.log('bucket', prev, item.weight + prev)
			return item;
		} else {
			prev += item.weight;
		}	
	};
}

export const includeWeightedLayer  = (layer) => {
	const random = randomNumber(1, 100)
	if (random <= layer.weight) {
		return true;
	}
	return false;
};
