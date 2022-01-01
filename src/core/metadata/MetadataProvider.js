import React, { useState } from 'react';
import { MetadataContext } from './MetadataContext';
import { useForm } from 'ds/hooks/useForm';


export const MetadataProvider = ({children}) => {
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
			default: 10000,
			placeholder: '10000',
			rules: []
		},
	})

	const value = { settingsForm }

	return (
		<MetadataContext.Provider value={value}>
			{children}
		</MetadataContext.Provider>
	)
}

