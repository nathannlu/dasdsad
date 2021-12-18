import React, { useState, useContext } from 'react';
import { useArray } from 'ds/hooks/useArray';
import { useForm } from 'ds/hooks/useForm';

export const CollectionContext = React.createContext({});
export const useCollection = () => useContext(CollectionContext);


export const CollectionProvider = ({ children }) => {
	const {
		list: layers,
		setList: setLayers,
		addToArray,
		selected,
		setSelected
	} = useArray();

	const [ selectedImage, setSelectedImage ] = useState(null);
	const [ progress, setProgress ] = useState(null);
	const [ isModalOpen, setIsModalOpen] = useState(false);
	const [generatedZip, setGeneratedZip] = useState('');

	const { form: settingsForm } = useForm({
		name: {
			default: '',
			placeholder: 'Name of your collection',
			rules: []
		},
		description: {
			default: '',
			placeholder: 'Give a brief description of your NFT',
			rules: []
		},
		collectionSize: {
			default: '',
			placeholder: '100',
			rules: []
		},
	})

	const [listOfWeights, setListOfWeights] = useState([]);

	// Init
	let newLayer = { 
		name: "Background",
		weight: 100,
		images: []
	}
	useState(() => {
		setLayers([newLayer])
		setSelected(0);
	}, []);

	
	return (
		<CollectionContext.Provider
			value={{
				layers,
				setLayers,
				settingsForm,
				addToArray,
				selected,
				setSelected,
				selectedImage,
				setSelectedImage,
				listOfWeights,
				setListOfWeights,
				progress,
				setProgress,
				isModalOpen,
				setIsModalOpen,
				generatedZip,
				setGeneratedZip
			}}
		>
			{children}
		</CollectionContext.Provider>
	)
};
