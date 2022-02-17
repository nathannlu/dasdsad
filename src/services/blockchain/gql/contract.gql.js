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
			}
		}
	}
`

export const SET_WHITELIST = gql`
	mutation SetWhitelist($whitelist: [String!]!, $id: ID!) {
		setWhitelist(whitelist: $whitelist, id: $id)	{
			id
		}
	}
`




