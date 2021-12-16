import { useState } from 'react';
import { useCollection } from 'libs/collection';
import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';
import { useArray } from 'ds/hooks/useArray';
import { toBase64 } from 'utils/imageData';


export const useTraitsManager = () => {
	const { addToast } = useToast();
	const {
		layers,
		setLayers,
		selected,
		setSelected,
		setSelectedImage,
		setListOfWeights
	} = useCollection();


	// adds image to layer
	const addToLayers = async (acceptedFiles) => {
		const newFile = {
			preview: URL.createObjectURL(acceptedFiles[0]),
			rarity: .5,
			weight: 50,
			base64: await toBase64(acceptedFiles[0]),
			file: acceptedFiles[0]
		}

		setLayers(prevState => {
			prevState[selected].images.push(newFile)
			return [...prevState]
		})

		setListOfWeights(prevState => {
			prevState.push(50)
			return [...prevState]
		})
	}

	
	// deletes image from layer
	// remove trait
	const deleteImage = (i) => {
		setSelectedImage(null);
		setLayers(prevState => {
			prevState[selected].images.splice(i, 1)
			return [...prevState]
		})
		setListOfWeights(prevState => {
			prevState.splice(i, 1)
			return [...prevState]
		})
	}

	// updates image weight
	const onChange = (e, i) => {
		const { name, value } = e.target;

		setLayers(prevState => {
			prevState[selected].images[i][name] = value
			return [...prevState]
		})
	}

	const calculateWeight = () => {
		if (layers && layers[selected]?.images) {
			let totalWeight = 0;
			let i = 0, len = layers[selected].images.length;
			while(i < len) {
				totalWeight += layers[selected].images[i].weight
				i++
			}

			
			// caclulate rarity
			layers[selected]?.images.forEach((image, i) => {
				setLayers(prevState => {
					const calculatedWeight = image.weight / totalWeight;
					console.log(calculatedWeight)

					prevState[selected].images[i].rarity = calculatedWeight
					return [...prevState]
				})
			})
		}
	}


	return {
		addToLayers,
		deleteImage,
		onChange
	}
}

export default useTraitsManager;

