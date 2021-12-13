import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast'; 

export const useSettingsForm = () => {
	const { addToast } = useToast();

	const { form: settingsForm } = useForm({
		name: {
			default: '',
			rules: []
		},
		description: {
			default: '',
			rules: []
		},
		collectionSize: {
			default: '',
			rules: []
		},
		layers: {
			default: ['a', 'b','c'],
			rules: []
		}
	})

	return {
		settingsForm,
	}
}
