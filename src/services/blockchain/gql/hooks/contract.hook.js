import { useMutation, useQuery } from '@apollo/client';
import {
    CREATE_CONTRACT,
    GET_CONTRACTS,
    SET_BASE_URI,
    SET_UN_REVEALED_BASE_URI,
    UPDATE_CONTRACT_ADDRESS,
    UPDATE_CONTRACT_DETAILS,
    SET_WHITELIST,
    GET_CONTRACT,
    DELETE_CONTRACT,
    SET_NFT_PRICE,
    SET_EMBED_BUTTON_CSS
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
    const { setContracts, setFetchContractLoading } = useContract();

    const { ...queryResult } = useQuery(GET_CONTRACTS, {
        fetchPolicy: 'network-only',
        onCompleted: async (data) => {
            if (setContracts !== undefined) {
                setContracts(data.getContracts);
            }

            onCompleted && onCompleted(data);

            setFetchContractLoading(false);

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

export const useSetUnRevealedBaseUri = ({ onCompleted, onError }) => {
    const { setContracts } = useContract();
    const [setUnRevealedBaseUri, { ...mutationResult }] = useMutation(SET_UN_REVEALED_BASE_URI, {
        onCompleted: async (data) => {
            const updated = data.setUnRevealedBaseUri;

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

    return [setUnRevealedBaseUri, { ...mutationResult }];
};

export const useSetNftPrice = ({ onCompleted, onError }) => {
    const { setContracts } = useContract();
    const [setNftPrice, { ...mutationResult }] = useMutation(SET_NFT_PRICE, {
        onCompleted: async (data) => {
            const updated = data.setNftPrice;

            // Find obj in arr and updated
            setContracts((prevState) => {
                const newState = prevState.map((contract) => {
                    if (contract.id == updated.id) {
                        return { ...contract, nftCollection: updated.nftCollection };
                    }
                    return contract;
                });
                return newState;
            });
            onCompleted && onCompleted(data);
        },
        onError
    });

    return [setNftPrice, { ...mutationResult }];
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
        onError
    });

    return [setWhitelist, { ...mutationResult }];
};

export const useSetEmbedButtonCss = ({ onCompleted, onError }) => {
    const { setContracts } = useContract();

    const [setEmbedButtonCss, { ...mutationResult }] = useMutation(SET_EMBED_BUTTON_CSS, {
        onCompleted: async (data) => {
            const updated = data.setEmbedButtonCss;

            // Find obj in arr and updated
            setContracts((prevState) => {
                const newState = prevState.map((contract) => {
                    if (contract.id == updated.id) {
                        return {
                            ...contract,
                            embed: { ...contract.embed, css: JSON.parse(updated.embed.css) }
                        };
                    }
                    return contract;
                });
                return newState;
            });
            onCompleted && onCompleted(data);
        },
        onError
    });

    return [setEmbedButtonCss, { ...mutationResult }];
};

export const useUpdateContractAddress = ({ onCompleted, onError }) => {
    const { setContracts } = useContract();

    const [updateContractAddress, { ...mutationResult }] = useMutation(
        UPDATE_CONTRACT_ADDRESS,
        {
            onCompleted: async (data) => {
                const updated = data.updateContractAddress;

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

    return [updateContractAddress, { ...mutationResult }];
};

export const useUpdateContractDetails = ({ onCompleted, onError }) => {
    const { setContracts } = useContract();

    const [updateContractDetails, { ...mutationResult }] = useMutation(
        UPDATE_CONTRACT_DETAILS,
        {
            onCompleted: async (data) => {
                const updated = data.updateContractDetails;

                // Find obj in arr and updated
                setContracts((prevState) => {
                    const newState = prevState.map((contract) => {
                        if (contract.id == updated.id) {
                            return { ...contract, ...updated };
                        }
                        return contract;
                    });
                    return newState;
                });
                onCompleted && onCompleted(data);
            },
            onError
        }
    );

    return [updateContractDetails, { ...mutationResult }];
};
