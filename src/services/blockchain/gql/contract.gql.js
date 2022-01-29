import { gql } from '@apollo/client';

export const CREATE_CONTRACT = gql`
	mutation CreateContract($contract: ContractInput!) {
		createContract(contract: $contract) {
			address	
		}
	}
`

export const GET_CONTRACTS = gql`
	query GetContracts {
		getContracts {
			id
			author
			blockchain
			address
			nftCollection {
				price
				currency
				size
				royalty
			}
		}
	}
`

export const SET_BASE_URI = gql`
	mutation SetBaseUri($baseUri: String!) {
		setBaseUri(baseUri: $baseUri)	
	}
`
