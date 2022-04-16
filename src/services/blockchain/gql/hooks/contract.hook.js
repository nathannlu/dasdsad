import { useMutation, useQuery } from '@apollo/client';
import {
    CREATE_CONTRACT,
    GET_CONTRACTS,
    SET_BASE_URI,
    UPDATE_CONTRACT,
    SET_WHITELIST,
    GET_CONTRACT,
    DELETE_CONTRACT,
} from '../contract.gql';
import { useContract } from 'services/blockchain/provider';

export const useCreateContract = ({ onCompleted, onError }) => {
    const { contracts, setContracts } = useContract();
    const [createContract, { ...mutationResult }] = useMutation(
        CREATE_CONTRACT,
        {
            onCompleted: (data) => {
                setContracts([...contracts, data?.createContract]);

                onCompleted && onCompleted(data);
            },
            onError,
        }
    );

    return [createContract, { ...mutationResult }];
};

export const useDeleteContract = ({ onCompleted, onError }) => {
    const { contracts, setContracts } = useContract();
    const [deleteContract, { ...mutationResult }] = useMutation(
        DELETE_CONTRACT,
        {
            onCompleted: (data) => {
                const newContract = contracts?.filter(
                    (c) => c.id !== data?.deleteContract.id
                );

                setContracts(newContract);

                onCompleted && onCompleted(data);
            },
            onError,
        }
    );

    return [deleteContract, { ...mutationResult }];
};

export const useGetContracts = async ({ onCompleted, onError }) => {
    const { setContracts } = useContract();
    const { ...queryResult } = useQuery(GET_CONTRACTS, {
        onCompleted: async (data) => {
            console.log(data.getContracts);

            if (setContracts !== undefined) {
                setContracts(data.getContracts);
            }

            onCompleted && onCompleted(data);
        },
    });

    return { ...queryResult };
};

export const useGetContract = async ({ address, onCompleted, onError }) => {
    const { ...queryResult } = useQuery(GET_CONTRACT, {
        variables: { address },
        onCompleted,
        onError,
    });

    return { ...queryResult };
};

export const useSetBaseUri = ({ onCompleted, onError }) => {
    const { setContracts } = useContract();
    const [setBaseUri, { ...mutationResult }] = useMutation(SET_BASE_URI, {
        onCompleted: async (data) => {
            const updated = data.setBaseUri;

            // Find obj in arr and updated
            setContracts((prevState) => {
                const newState = prevState.map((contract) => {
                    if (contract.id == updated.id) {
                        return {
                            ...contract,
                            nftCollection: updated.nftCollection,
                        };
                    }

                    return contract;
                });

                return newState;
            });

            onCompleted && onCompleted(data);
        },
        onError,
    });

    return [setBaseUri, { ...mutationResult }];
};

export const useSetWhitelist = ({ onCompleted, onError }) => {
    const { setContracts } = useContract();

    const [setWhitelist, { ...mutationResult }] = useMutation(SET_WHITELIST, {
        onCompleted: async (data) => {
            const updated = data.setWhitelist;

            // Find obj in arr and updated
            setContracts((prevState) => {
                const newState = prevState.map((contract) => {
                    if (contract.id == updated.id) {
                        return {
                            ...contract,
                            nftCollection: updated.nftCollection,
                        };
                    }

                    return contract;
                });

                return newState;
            });

            onCompleted && onCompleted(data);
        },
        onError,
    });

    return [setWhitelist, { ...mutationResult }];
};

export const useUpdateContract = ({ onCompleted, onError }) => {
    const { setContracts } = useContract();

    const [updateContract, { ...mutationResult }] = useMutation(
        UPDATE_CONTRACT,
        {
            onCompleted: async (data) => {
                const updated = data.updateContract;

                // Find obj in arr and updated
                setContracts((prevState) => {
                    const newState = prevState.map((contract) => {
                        if (contract.id == updated.id) {
                            return { ...contract, address: updated.address };
                        }

                        return contract;
                    });

                    return newState;
                });

                onCompleted && onCompleted(data);
            },
            onError,
        }
    );

    return [updateContract, { ...mutationResult }];
};
