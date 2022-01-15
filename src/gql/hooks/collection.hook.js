import { useMutation, useQuery } from '@apollo/client';
import { CREATE_COLLECTION, SINGLE_UPLOAD } from '../collection.gql';


export const useCreateCollection = ({ onCompleted, onError }) => {
	const [createCollection, { ...mutationResult }] = useMutation(CREATE_COLLECTION, {
		onCompleted,
		onError
	})

	return [ createCollection, { ...mutationResult }]
};


export const useSingleUpload = ({ onCompleted, onError }) => {
	const [singleUpload, { ...mutationResult }] = useMutation(SINGLE_UPLOAD, {
		onCompleted,
		onError: err => {
			console.log(err)
		}
	})

	return [ singleUpload, { ...mutationResult }]
};
