import { useToast } from 'ds/hooks/useToast';
import { useMetadata } from 'services/generator/controllers/metadata';
import { useLayerManager } from 'services/generator/controllers/manager';

export const useValidateForm = () => {
	const { addToast } = useToast()
	const { settingsForm: { size } } = useMetadata();
	const { query: { layers } } = useLayerManager();

	const validateCollectionSize = () => {
		try {
			if (size.value.length < 1) throw new Error('Collection Size value cannot be left empty');
			if (size.value < 10) throw new Error('Collection Size value cannot be less than 10');

			return true;
		}
		catch (err) {
			addToast({
				severity: 'error',
				message: err.message
			});
		}

		return false;
	}

	const validateLayers = () => {
		try {
			if (layers.length < 1) throw new Error('Layers cannot be left empty. Try adding "Background"');

			return true;
		}
		catch (err) {
			addToast({
				severity: 'error',
				message: err.message
			});
		}

		return false;
	}

	const validateLayerTraits = () => {
		try {
			let videoCount = 0;

			layers.forEach((layer) => {
				if (layer.images.length == 0) throw new Error(`Layer '${layer.name}' cannot have 0 traits. Please add a trait or remove the layer`);
				if (layer.images.includes(file => file.type =='video/mp4')) videoCount++;
			})

			if(videoCount > 1) throw new Error(`Video can exist in one layer only! You have videos in ${2} layers.`);

			let possibleCombination = 1;
			layers.forEach((layer) => {
				const imgSize = layer.images.length;
				possibleCombination *= imgSize;
			})

			if (possibleCombination < size.value) {
				throw new Error(`Possible combination is under the desired collection count (${possibleCombination}/${size.value})`);
			}

			return true;
		}
		catch (err) {
			addToast({
				severity: 'error',
				message: err.message
			});
		}

		return false;
	}

	return {
		validateCollectionSize,
		validateLayers,
		validateLayerTraits
	}
};
