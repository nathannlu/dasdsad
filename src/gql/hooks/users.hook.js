import React from 'react';
import { useAuth } from 'libs/auth';
import { useWebsite } from 'libs/website';

import { useQuery, useMutation } from '@apollo/client';
import { Redirect } from 'react-router-dom';
import { GET_NONCE, VERIFY_SIGNATURE, REAUTHENTICATE } from '../users.gql'


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

	const [verifySignature, { ...mutationResult }] = useMutation(VERIFY_SIGNATURE, {
		onCompleted: data => {
//			console.log(data)

			onLoginSuccess(data.verifySignature)

//			onCompleted && onCompleted()
		},
		onError
	})

	return [ verifySignature, { ...mutationResult }]
};



export const useGetCurrentUser = () => {
	const { onReauthenticationSuccess, onReauthenticationError } = useAuth();
	const { setWebsite } = useWebsite();

  const { ...queryResult } = useQuery(REAUTHENTICATE, {
		onCompleted: data => {


			const user = data.getCurrentUser
			const { websites } = user;
			const hasWebsite = websites?.length > 0;
			onReauthenticationSuccess(user);


			// Check if website exists
			if (hasWebsite) {
				setWebsite(user.websites[0])
			} else {
//				history.push('/dashboard/welcome');
				return <Redirect to="/dashboard/welcome" />
			}
		},
//		onError: onReauthenticationError
	});

	return { ...queryResult }
}
