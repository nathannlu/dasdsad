import { useState } from 'react';
import { useLayerManager } from 'core/manager';
import { toBase64 } from 'utils/imageData';

export const useTrait = () => {
	const {
		query: { layers, selected },
		actions: { setLayers }
	} = useLayerManager()
	const [selectedImage, setSelectedImage] = useState(0);


	const addTrait = async (acceptedFiles) => {
		let newFiles = []

		for (let i = 0; i < acceptedFiles.length; i++) {
			const newFile = {
				preview: URL.createObjectURL(acceptedFiles[i]),
				name: acceptedFiles[i].name.substring(0, acceptedFiles[i].name.indexOf('.')),
				rarity: .5,
				weight: 30,
				base64: await toBase64(acceptedFiles[i]),
				type: acceptedFiles[i].type,
				file: acceptedFiles[i]
			}
			newFiles.push(newFile);
			console.log(newFile)
		}

		setLayers(prevState => {
			prevState[selected].images.push(...newFiles)
			return [...prevState]
		})
	}

	const deleteTrait = (index) => {
		setLayers(prevState => {
			prevState[selected].images.splice(index, 1)
			return [...prevState]
		})
	}

	const updateTrait = (index, updatedTrait) => {
		setLayers(prevState => {
			prevState[selected].images[index] = { ...prevState[selected].images[index], ...updatedTrait}
			return [...prevState]
		})
	}

	// updates image weight
	const updateTraitRarity = (index, weight) => {
		setLayers(prevState => {
			prevState[selected].images[index].weight = weight
			return [...prevState]
		})
	}

	return {
		addTrait,
		deleteTrait,
		updateTrait,
		updateTraitRarity,
		selectedImage,
		setSelectedImage
	}
}
