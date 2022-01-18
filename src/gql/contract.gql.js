import { gql } from '@apollo/client';

export const CREATE_CONTRACT = gql`
	mutation CreateContract($collectionPrice: String!, $royaltyPercentage: Int!, $collectionSize: Int!, $blockchain: String!) {
		createContract(collectionPrice: $collectionPrice, royaltyPercentage: $royaltyPercentage, collectionSize: $collectionSize, blockchain: $blockchain)
	}
`
