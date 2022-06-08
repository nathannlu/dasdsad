import React, { useState } from 'react';
import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';

export const useSolanaCreators = (address) => {
	const [creators, setCreators] = useState([{address: address, share: 100}]);
	const { addToast } = useToast();

	const { form: settingsForm, setFormState: updateSettingsForm } = useForm({
		creatorAddress: {
			default: '',
			placeholder: 'Address of creator',
			rules: [],
		},
		creatorShare: {
			default: 100,
			placeholder: '100',
			rules: [],
		},
	});

	const addCreator = () => {
		try {
			const address = settingsForm?.creatorAddress?.value;
			const share = parseInt(settingsForm?.creatorShare?.value);

			if (!address) throw new Error('Creator Address must be filled');
			if (!share || share <= 0)
				throw new Error('Creator Share must be greater than 0');

			const newCreator = {
				address,
				share,
			};
			setCreators([...creators, newCreator]);
		} catch (err) {
			addToast({
				severity: 'error',
				message: err.message,
			});
		}
	};

	const removeCreator = (index) => {
		if (!creators.length) return;
		let newCreators = [...creators];
		newCreators.splice(index, 1);
		setCreators(newCreators);
	};

	return {
		settingsForm,
		creators,
		addCreator,
		removeCreator,
	};
};
