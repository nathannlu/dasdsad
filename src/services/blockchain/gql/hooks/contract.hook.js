import { useMutation, useQuery } from '@apollo/client';
import { CREATE_CONTRACT, GET_CONTRACTS, SET_BASE_URI, UPDATE_CONTRACT } from '../contract.gql';
import { useContract } from 'services/blockchain/provider';


export const useCreateContract = ({ onCompleted, onError }) => {
	const { contracts, setContracts } = useContract();
	const [createContract, { ...mutationResult }] = useMutation(CREATE_CONTRACT, {
		onCompleted: data => {
			setContracts([...contracts, data?.createContract])
			
			onCompleted &&onCompleted(data);
		},
		onError
	})

	return [ createContract, { ...mutationResult }]
};

export const useGetContracts = async ({ onCompleted, onError }) => {
	const { setContracts } = useContract();
  const { ...queryResult } = useQuery(GET_CONTRACTS, {
		onCompleted: async data => {

			if (setContracts !== undefined) {
				setContracts(data.getContracts)
			}

			onCompleted && onCompleted(data)
		},
	});

	return { ...queryResult }
}

export const useSetBaseUri = ({ onCompleted, onError }) => {
	const [setBaseUri, { ...mutationResult }] = useMutation(SET_BASE_URI, {
		onCompleted: async data => {

			onCompleted && onCompleted(data)
		},
		onError
	})

	return [ setBaseUri, { ...mutationResult }]
};


export const useUpdateContract = ({ onCompleted, onError }) => {
	const [updateContract, { ...mutationResult }] = useMutation(UPDATE_CONTRACT, {
		onCompleted: async data => {

			onCompleted && onCompleted(data)
		},
		onError
	})

	return [ updateContract, { ...mutationResult }]
};


