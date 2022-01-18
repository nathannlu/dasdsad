import { useMutation, useQuery } from '@apollo/client';
import { CREATE_CONTRACT } from '../contract.gql';


export const useCreateContract = ({ collectionPrice, collectionSize, royaltyPercentage, blockchain, onCompleted, onError }) => {
	const [createContract, { ...mutationResult }] = useMutation(CREATE_CONTRACT, {
		variables: { collectionPrice, collectionSize, royaltyPercentage, blockchain },
		onCompleted,
		onError
	})

	return [ createContract, { ...mutationResult }]
};



