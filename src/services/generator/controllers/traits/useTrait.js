import { useState } from 'react';
import { useLayerManager } from 'services/generator/controllers/manager';
import { toBase64 } from 'utils/imageData';
import { useToast } from 'ds/hooks/useToast';
import posthog from 'posthog-js';

export const useTrait = () => {
	const {
		query: { layers, selected },
		actions: { setLayers }
	} = useLayerManager()
	const [selectedImage, setSelectedImage] = useState(0);
	const { addToast } = useToast();

	const loadImage = (imageObjUrl) => {
		return new Promise((resolve, reject) => {
			try {
				const img = new Image();
				img.onload = () => {
					resolve(img);
				}
				img.src = imageObjUrl;
			}
			catch(err) {
				reject(err);
			}
		})
	}

	const createTrait = (file) => {
		return new Promise(async (resolve, reject) => {
			try {
				const img = await loadImage(URL.createObjectURL(file));
				//const base64 = await toBase64(file);
				const newFile = {
					image: img,
					preview: img.currentSrc,
					name: file.name.substring(0, file.name.indexOf('.')),
					//base64,
					type: file.type,
					file: file,
					rarity: {
						max: -1,
						value: -1,
						percentage: -1
					}
				}
				if (img) {
					resolve(newFile);
				}
			}
			catch (err) {
				reject(err);
			}
		})
	}

	const addTrait = async (acceptedFiles) => {
		let newFiles = []

		for (let i = 0; i < acceptedFiles.length; i++) {
			const trait = await createTrait(acceptedFiles[i]);
			if(trait.type == 'image/png' || trait.type == 'video/mp4') {
				newFiles.push(trait);
			} else {
				addToast({
					severity: 'error',
					message: 'We only support .png and .mp4 files'
				});
			}
			if(trait.type == 'video/mp4') {
				addToast({
					severity: 'success',
					message: 'Added video! Just a heads up having a video will take longer to generate your collection.'
				});
			}
		}

		setLayers(prevState => {
			prevState[selected].images.push(...newFiles)
			return [...prevState]
		})

		posthog.capture('User added trait(s) to their collection');
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

		posthog.capture('User updated trait rarity');
	}

	return {
		addTrait,
		deleteTrait,
		updateTrait,
		updateTraitRarity,
		selectedImage,
		setSelectedImage,
		loadImage,
	}
}
