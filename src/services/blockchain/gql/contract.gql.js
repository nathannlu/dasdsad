import { gql } from '@apollo/client';

export const CREATE_CONTRACT = gql`
    mutation CreateContract($contract: ContractInput!) {
        createContract(contract: $contract) {
            id
            name
            symbol
            type
            author
            blockchain
            address
            isSubscribed
            nftCollection {
                price
                currency
                size
                royalty
                baseUri
                unRevealedBaseUri
                whitelist
            }
        }
    }
`;

export const UPDATE_CONTRACT_DETAILS = gql`
    mutation UpdateContractDetails($id: ID!, $name: String!, $symbol: String!, $blockchain: String!, $price: String!, $size: String!, $currency: String!) {
        updateContractDetails(id: $id, name: $name, symbol: $symbol, blockchain: $blockchain, price: $price, size: $size, currency: $currency) {
            id
            name
            symbol
            type
            author
            blockchain
            address
            isSubscribed
            nftCollection {
                price
                currency
                size
                royalty
                baseUri
                unRevealedBaseUri
                whitelist
            }
        }
    }
`;

export const UPDATE_CONTRACT_ADDRESS = gql`
    mutation UpdateContractAddress($id: ID!, $address: String!) {
        updateContractAddress(id: $id, address: $address) {
            id
            name
            symbol
            type
            author
            blockchain
            address
            isSubscribed
            nftCollection {
                price
                currency
                size
                royalty
                baseUri
                unRevealedBaseUri
                whitelist
            }
        }
    }
`;

export const DELETE_CONTRACT = gql`
    mutation DeleteContract($id: ID!) {
        deleteContract(id: $id) {
            id
        }
    }
`;

export const GET_CONTRACTS = gql`
    query GetContracts {
        getContracts {
            id
            name
            symbol
            type
            author
            blockchain
            address
            isSubscribed
            nftCollection {
                price
                currency
                size
                royalty
                baseUri
                unRevealedBaseUri
                whitelist
            }
        }
    }
`;

export const GET_CONTRACT = gql`
    query GetContract($address: String!) {
        getContract(address: $address) {
            id
            name
            symbol
            type
            author
            blockchain
            address
            nftCollection {
                price
                currency
                size
                royalty
                baseUri
                unRevealedBaseUri
                whitelist
            }
        }
    }
`;

export const SET_BASE_URI = gql`
    mutation SetBaseUri($baseUri: String!, $id: ID!) {
        setBaseUri(baseUri: $baseUri, id: $id) {
            id
            nftCollection {
                price
                currency
                size
                royalty
                baseUri
                unRevealedBaseUri
                whitelist
            }
        }
    }
`;

export const SET_UN_REVEALED_BASE_URI = gql`
    mutation SetUnRevealedBaseUri($unRevealedBaseUri: String!, $id: ID!) {
        setUnRevealedBaseUri(unRevealedBaseUri: $unRevealedBaseUri, id: $id) {
            id
            nftCollection {
                price
                currency
                size
                royalty
                baseUri
                unRevealedBaseUri
                whitelist
            }
        }
    }
`;

export const SET_NFT_PRICE = gql`
    mutation SetNftPrice($price: String!, $id: ID!) {
        setNftPrice(price: $price, id: $id) {
            id
            nftCollection {
                price
                currency
                size
                royalty
                baseUri
                unRevealedBaseUri
                whitelist
            }
        }
    }
`;

export const SET_WHITELIST = gql`
    mutation SetWhitelist($whitelist: [String!]!, $id: ID!) {
        setWhitelist(whitelist: $whitelist, id: $id) {
            id
            nftCollection {
                price
                currency
                size
                royalty
                baseUri
                unRevealedBaseUri
                whitelist
            }
        }
    }
`;
