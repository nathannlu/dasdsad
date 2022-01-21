import { useMutation, useQuery } from '@apollo/client';
import { CREATE_CONTRACT, GET_CONTRACTS, SET_BASE_URI } from '../contract.gql';
import { useDeploy } from 'libs/deploy';


export const useCreateContract = ({ onCompleted, onError }) => {
	const [createContract, { ...mutationResult }] = useMutation(CREATE_CONTRACT, {

		onCompleted,
		onError
	})

	return [ createContract, { ...mutationResult }]
};

export const useGetContracts = async () => {
	const { setContracts } = useDeploy();
  const { ...queryResult } = useQuery(GET_CONTRACTS, {
		onCompleted: async data => {
			setContracts(data.getContracts)
		},
	});

	return { ...queryResult }
}

export const useSetBaseUri = ({ onCompleted, onError }) => {
	const [setBaseUri, { ...mutationResult }] = useMutation(SET_BASE_URI, {
		onCompleted,
		onError
	})

	return [ setBaseUri, { ...mutationResult }]
};


