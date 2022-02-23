import React, { useState } from 'react';
import { MetadataContext } from './MetadataContext';
import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';

export const MetadataProvider = ({children}) => {
	const [metadataType, setMetadataType] = useState('eth');
	const [creators, setCreators] = useState([]);
	const { addToast } = useToast()

	const { form: settingsForm, setFormState: updateSettingsForm } = useForm({
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
		size: {
			default: 100,
			placeholder: '10000',
			rules: []
		},
		coupon: {
			default: '',
			placeholder: 'Promo code here',
			rules: []
		},
		symbol: {
			default: '',
			placeholder: 'Symbol for your NFT',
			rules: []
		},
		externalUrl: {
			default: '',
			placeholder: 'Link to your website',
			rules: []
		},
		creatorAddress: {
			default: '',
			placeholder: 'Address of creator',
			rules: []
		},
		creatorShare: {
			default: 100,
			placeholder: '100',
			rules: []
		},
		sellerFeeBasisPoints: {
			default: 1000,
			placeholder: '1000 = 10%',
			rules: []
		},
	})

	const addCreator = () => {
		try {
			const address = settingsForm?.creatorAddress?.value;
			const share = settingsForm?.creatorShare?.value;

			if (!address) throw new Error('Creator Address must be filled');
			if (!share || share <= 0) throw new Error('Creator Share must be greater than 0');

			const newCreator = {
				address,
				share
			}
			setCreators([...creators, newCreator]);
		}
		catch (err) {
			addToast({
				severity: 'error',
				message: err.message
			})
		}
	}

	const removeCreator = (index) => {
		if (!creators.length) return;
		let newCreators = [...creators];
		newCreators.splice(index, 1);
		setCreators(newCreators);
	}

	const value = { settingsForm, metadataType, creators, updateSettingsForm, setMetadataType, addCreator, removeCreator }

	return (
		<MetadataContext.Provider value={value}>
			{children}
		</MetadataContext.Provider>
	)
}