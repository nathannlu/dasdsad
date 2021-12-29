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
		let newFiles = []

		console.log(acceptedFiles)

		for (let i = 0; i < acceptedFiles.length; i++) {
			const newFile = {
				preview: URL.createObjectURL(acceptedFiles[i]),
				name: acceptedFiles[i].name.substring(0, acceptedFiles[i].name.indexOf('.')),
				rarity: .5,
				weight: 30,
				base64: await toBase64(acceptedFiles[i]),
				file: acceptedFiles[i]
			}
			
			newFiles.push(newFile);
		}

		setLayers(prevState => {
			prevState[selected].images.push(...newFiles)

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

