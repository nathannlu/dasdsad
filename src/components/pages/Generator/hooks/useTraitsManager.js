import { useCollection } from 'libs/collection';
import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';
import { useArray } from 'ds/hooks/useArray';


export const useTraitsManager = () => {
	const { addToast } = useToast();
	const {
		layers,
		setLayers,
		selected,
		setSelected
	} = useCollection();


	// adds image to layer
	const addToLayers = (acceptedFiles) => {
		let file = acceptedFiles.map(file => Object.assign(file, {
			preview: URL.createObjectURL(file),
			rarity: .5
		}))

		setLayers(prevState => {
			prevState[selected].images.push(...file)
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
	}


	return {
		addToLayers,
		deleteImage,
	}
}

export default useTraitsManager;



