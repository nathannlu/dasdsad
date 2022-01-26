import { useEffect } from 'react';
import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';
import { useLayerManager } from 'core/manager';
import { useTrait } from 'core/traits';

export const useNewTraitNameForm = ({editTrait, isModalOpen, setIsModalOpen}) => {
	const { addToast } = useToast();
	const { query: { layers, selected }} = useLayerManager();
	const { updateTrait } = useTrait();
	const {
		form: newTraitNameForm,
		setFormState: setNewTraitNameForm
	} = useForm({
		name: {
			default: '',
			placeholder: "e.g. Smile",
			rules: []
		}
	})

	const onSubmit = e => {
		e.preventDefault();
		updateTrait(editTrait, {name: newTraitNameForm.name.value})

		setIsModalOpen(false)
	}

	useEffect(() => {
		if(isModalOpen) {
			setNewTraitNameForm(prevState => {
				prevState.name.value = layers[selected]?.images[editTrait]?.name
				return {...prevState}
			})
		}
	}, [isModalOpen])

	return {
		newTraitNameForm,
		onSubmit,
	}
};
