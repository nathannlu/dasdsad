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
				whitelist
                cacheHash
                candyAccountAddress
			}
		}
	}
`

export const UPDATE_CONTRACT = gql`
	mutation UpdateContract($id: ID!, $address: String!) {
		updateContract(id: $id, address: $address) {
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
				whitelist
                cacheHash
                candyAccountAddress
			}
		}
	}
`

export const DELETE_CONTRACT = gql`
	mutation DeleteContract($id: ID!) {
		deleteContract(id: $id)	{
			id
		}
	}
`

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
				whitelist
                cacheHash
                candyAccountAddress
			}
		}
	}
`

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
				whitelist
                cacheHash
                candyAccountAddress
			}
		}
	}
`

export const SET_BASE_URI = gql`
	mutation SetBaseUri($baseUri: String!, $id: ID!) {
		setBaseUri(baseUri: $baseUri, id: $id)	{
			id
			nftCollection {
				price
				currency
				size
				royalty
				baseUri
				whitelist
                cacheHash
                candyAccountAddress
			}
		}
	}
`

export const SET_WHITELIST = gql`
	mutation SetWhitelist($whitelist: [String!]!, $id: ID!) {
		setWhitelist(whitelist: $whitelist, id: $id)	{
			id
			nftCollection {
				price
				currency
				size
				royalty
				baseUri
				whitelist
                cacheHash
                candyAccountAddress
			}
		}
	}
`

export const SET_CACHE_HASH = gql`
    mutation SetCacheHash($id: ID!, $cacheHash: String!) {
        setCacheHash(id: $id, cacheHash: $cacheHash) {
            id
            nftCollection {
                price
                currency
                size
                royalty
                baseUri
                whitelist
                cacheHash
                candyAccountAddress
            }
        }
    }
`

export const SET_CANDY_ACCOUNT_ADDRESS = gql`
    mutation SetCandyAccountAddress($id: ID!, $address: String!) {
        setCandyAccountAddress(id: $id, address: $address) {
            id
            nftCollection {
                price
                currency
                size
                royalty
                baseUri
                whitelist
                cacheHash
                candyAccountAddress
            }
        }
    }
`