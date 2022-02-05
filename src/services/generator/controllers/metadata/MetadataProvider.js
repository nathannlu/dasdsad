import React, { useState } from 'react';
import { MetadataContext } from './MetadataContext';
import { useForm } from 'ds/hooks/useForm';


export const MetadataProvider = ({children}) => {
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
	})

	const value = { settingsForm, updateSettingsForm }

	return (
		<MetadataContext.Provider value={value}>
			{children}
		</MetadataContext.Provider>
	)
}

