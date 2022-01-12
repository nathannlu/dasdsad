import { useMutation, useQuery } from '@apollo/client';
import { CREATE_COLLECTION } from '../collection.gql';


export const useCreateCollection = ({ onCompleted, onError }) => {
	const [createCollection, { ...mutationResult }] = useMutation(CREATE_COLLECTION, {
		onCompleted,
		onError
	})

	return [ createCollection, { ...mutationResult }]
};
