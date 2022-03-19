import React from 'react';
import { useAuth } from 'libs/auth';
import { useWebsite } from 'services/website/provider';

import { useQuery, useMutation } from '@apollo/client';
import { Redirect, useHistory } from 'react-router-dom';
import { GET_NONCE, VERIFY_SIGNATURE, REGISTER, LOGIN, REAUTHENTICATE, VERIFY_SIGNATURE_PHANTOM } from '../users.gql'
import { useWeb3 } from '../../libs/web3';



// Sends password reset email
export const useForgotPassword = ({ email, onCompleted, onError }) => {
	const [sendPasswordResetEmail, { ...queryResult }] = useLazyQuery(FORGOT_PASSWORD, {
		fetchPolicy: 'network-only',
		variables: { email },
		onCompleted,
		onError
	});

	return [sendPasswordResetEmail, { ...queryResult }]
};

// Reset password logic query
export const useResetPassword = ({ token, password, onCompleted, onError }) => {
	const [resetPassword, { ...mutationResult }] = useMutation(RESET_PASSWORD, {
		variables: { token, password },
		onCompleted,
		onError
	})

	return [resetPassword, { ...mutationResult }]
};

// Used to validate token in reset password link
export const useValidateToken = ({ token, onCompleted, onError }) => {
	const { ...queryResult } = useQuery(VALIDATE_TOKEN, {
		variables: { token },
		onCompleted,
		onError
	});

	return { ...queryResult }
};


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
//	let history = useHistory();

	const [verifySignature, { ...mutationResult }] = useMutation(VERIFY_SIGNATURE, {
		onCompleted: data => {
//			console.log(data)

			onLoginSuccess(data.verifySignature)
//			history.push('/dashboard');


			if(onCompleted) {
				onCompleted(data)
			}
		},
		onError
	})

	return [ verifySignature, { ...mutationResult }]
};

export const useVerifySignaturePhantom = ({ onCompleted, onError }) => {
	const { onLoginSuccess } = useAuth()

	const [verifySignaturePhantom, { ...mutationResult }] = useMutation(VERIFY_SIGNATURE_PHANTOM, {
		onCompleted: data => {
			onLoginSuccess(data.verifySignaturePhantom)
			if(onCompleted) {
				onCompleted(data)
			}
		},
		onError
	})

	return [ verifySignaturePhantom, { ...mutationResult }]
};



export const useGetCurrentUser = async () => {
	const { onReauthenticationSuccess, onReauthenticationError } = useAuth();
//	const { setWebsite } = useWebsite();
//k	const { actions: { setLayers }} = useLayerManager();
//	const { updateSettingsForm  } = useMetadata();


  const { ...queryResult } = useQuery(REAUTHENTICATE, {
		onCompleted: async data => {


			const user = data.getCurrentUser
			const { websites, collections } = user;
			const hasWebsite = websites?.length > 0;
			const hasCollection = collections?.length > 0;

			onReauthenticationSuccess(user);

			/*
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
			*/

		},
		onError: onReauthenticationError
	});

	return { ...queryResult }
}


// Email login
export const useRegister = ({ name, email, password, onCompleted, onError }) => {
	const [register, { ...mutationResult }] = useMutation(REGISTER, {
		variables: { name, email, password },
		onCompleted,
		onError
	})

	return [ register, { ...mutationResult }];
};

export const useLogin = ({ email, password, onError, onCompleted }) => {
	const { onLoginSuccess } = useAuth();
	const [login, { ...mutationResult }] = useMutation(LOGIN, {
		variables: { email, password},
		onCompleted: data => {
			if (data?.login) {
				if (onLoginSuccess) {
					onLoginSuccess(data.login);
				}

				// If function has parameter onCompleted, run the function
				if (onCompleted) {
					onCompleted(data?.login);
				}
			}
		},
		onError
	})

	return [login, { ...mutationResult }];
}


