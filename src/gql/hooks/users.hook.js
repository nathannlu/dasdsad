import React from 'react';
import { useAuth } from 'libs/auth';
import { useWebsite } from 'libs/website';
import { useLayerManager } from 'core/manager';
import { useMetadata } from 'core/metadata'
import { useTraits } from 'core/traits';

import { useQuery, useMutation } from '@apollo/client';
import { Redirect, useHistory } from 'react-router-dom';
import { GET_NONCE, VERIFY_SIGNATURE, REAUTHENTICATE } from '../users.gql'

import { toDataURL } from 'utils/imageData';


export const useGetNonceByAddress = ({ address, onCompleted, onError }) => {
	const [getNonceByAddress, { ...mutationResult }] = useMutation(GET_NONCE, {
		variables: { address },
		onCompleted,
		onError
	})

	return [ getNonceByAddress, { ...mutationResult }]
};


export const useVerifySignature = ({ onCompleted, onError }) => {
	const { onLoginSuccess } = useAuth()
	let history = useHistory();

	const [verifySignature, { ...mutationResult }] = useMutation(VERIFY_SIGNATURE, {
		onCompleted: data => {
//			console.log(data)

			onLoginSuccess(data.verifySignature)
			history.push('/dashboard');


			if(onCompleted) {
				onCompleted(data)
			}
		},
		onError
	})

	return [ verifySignature, { ...mutationResult }]
};



export const useGetCurrentUser = async () => {
	const { onReauthenticationSuccess, onReauthenticationError } = useAuth();
	const { setWebsite } = useWebsite();
	const { actions: { setLayers }} = useLayerManager();

	const { updateSettingsForm  } = useMetadata();


  const { ...queryResult } = useQuery(REAUTHENTICATE, {
		onCompleted: async data => {


			const user = data.getCurrentUser
			const { websites, collections } = user;
			const hasWebsite = websites?.length > 0;
			const hasCollection = collections?.length > 0;

			onReauthenticationSuccess(user);




			// Check if website exists
			if (hasWebsite) {
				setWebsite(user.websites[0])
			}

			// Update layer maanger, traits manager
			if (hasCollection) {
				let layers = [...collections[0].layers]
				let clonedLayers = JSON.parse(JSON.stringify(layers))


				for (let i = 0; i < clonedLayers.length; i++) {
					const layer = clonedLayers[i];
					
					for (let j = 0; j < layer.images.length; j++) {
						let image = clonedLayers[i].images[j];

						image.preview = image.url	
						image.base64 = await toDataURL(image.url)
						image.type = "image/png"
					};
				};


				// Save collection to metadata too
				updateSettingsForm(prevState => {
					let newState = {...prevState}
					newState.collectionSize.value = collections[0].collectionSize;
					newState.description.value = collections[0].description;
					newState.name.value = collections[0].name;

					return {...newState}
				});

				console.log(clonedLayers)
				setLayers(clonedLayers)
			}

		},
//		onError: onReauthenticationError
	});

	return { ...queryResult }
}
