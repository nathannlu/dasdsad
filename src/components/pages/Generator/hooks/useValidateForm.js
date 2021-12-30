import { useToast } from 'ds/hooks/useToast';
import { useMetadata } from 'core/metadata';
import { useLayerManager } from 'core/manager';

export const useValidateForm = () => {
	const { addToast } = useToast()
	const { settingsForm } = useMetadata();
	const { query: { layers } } = useLayerManager();

	const validateCollectionSize = () => {
		if (settingsForm.collectionSize.value.length < 1) {
			addToast({
				severity: 'error',
				message: 'Collection Size value cannot be left empty'
			})
			return false;
		} else {
			return true
		}
	}

	const validateLayers = () => {
		if(layers.length < 1) {
			addToast({
				severity: 'error',
				message: 'Layers cannot be left empty. Try adding "Background"'
			})
			return false;
		} else {
			return true;
		}
	}

	const validateLayerTraits = () => {
		for(let i = 0; i < layers.length; i++) {
			if(layers[i].images.length == 0) {
				addToast({
					severity: 'error',
					message: `Layer '${layers[i].name}' cannot have 0 traits. Please add a trait or remove the layer`
				});
				return false;
			}
		}

		return true;
	}

	return {
		validateCollectionSize,
		validateLayers,
		validateLayerTraits
	}
};
