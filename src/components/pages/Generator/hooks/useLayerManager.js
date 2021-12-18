import { useCollection } from 'libs/collection';
import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';
import { useArray } from 'ds/hooks/useArray';


export const useLayerManager = () => {
	const { addToast } = useToast();
	const {
		layers,
		setLayers,
		addToArray,
		selected,
		setSelected
	} = useCollection();
	const { form: newLayerForm } = useForm({
		name: {
			default: '',
			placeholder: "e.g. background",
			rules: []
		}
	})

	// removes layer
	const deleteLayer = i => {
		setSelected(null);
		setLayers(prevState => {
			prevState.splice(i, 1);	
			return [...prevState]
		});
	}

	// updates layer name
	const onChange = e => {
		const { name, value } = e.target;

		setLayers(prevState => {
			prevState[selected][name] = value
			return [...prevState]
		})
	}

	// Creates new layer - adds to layers array
	const onSubmit = e => {
		e.preventDefault();


		if(newLayerForm.name.value.length > 0) {
			let obj = {
				name: newLayerForm.name.value,
				weight: 100,
				images: []
			}

			addToArray(obj)

		} else {
			addToast({
				severity: 'error',
				message: 'Cannot create layer with empty name. Try "background"'
			})
		}
	}

	// a little function to help us with reordering the result
	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);

		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
		setSelected(endIndex)

		return result;
	};


	// Layer drag & drop handler
	const onDragEnd = result => {
		if (!result.destination) {
			return;
		}

		const items = reorder([...layers], result.source.index, result.destination.index);
		setLayers(items)

	}



	return {
		newLayerForm,
		deleteLayer,
		onChange,
		onSubmit,
		reorder,
		onDragEnd
	}
}

export default useLayerManager;


/*
let layerObj = {
	onClick: id => selected(id)
	deleteLayer: () => {...}
};
*/
