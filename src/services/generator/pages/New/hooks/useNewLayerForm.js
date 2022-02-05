import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';
import { useLayerManager } from 'services/generator/controllers/manager';

export const useNewLayerForm = () => {
	const { addToast } = useToast();
	const { form: newLayerForm, setFormState: setNewLayerForm } = useForm({
		name: {
			default: '',
			placeholder: "e.g. Background",
			rules: []
		}
	})
	const { actions, actions: { addLayer } } = useLayerManager();
	
	// Creates new layer - adds to layers array
	const onSubmit = e => {
		e.preventDefault();
		if(newLayerForm.name.value.length > 0) {
			let obj = {
				name: newLayerForm.name.value,
				weight: 100,
				images: []
			}
			addLayer(obj);
			setNewLayerForm(prevState => {
				prevState.name.value = ''
				return {...prevState}
			});
		} else {
			addToast({
				severity: 'error',
				message: 'Cannot create layer with empty name. Try "Hat"'
			})
		}
	}

	return {
		newLayerForm,
		onSubmit,
	}
};
