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
			nftCollection {
				price
				currency
				size
				royalty
				baseUri
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
			nftCollection {
				price
				currency
				size
				royalty
				baseUri
			}
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
			nftCollection {
				price
				currency
				size
				royalty
				baseUri
			}
		}
	}
`

export const SET_BASE_URI = gql`
	mutation SetBaseUri($baseUri: String!, $id: ID!) {
		setBaseUri(baseUri: $baseUri, id: $id)	{
			id
			nftCollection {
				baseUri
			}
		}
	}
`
