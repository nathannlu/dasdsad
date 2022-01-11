import { gql } from '@apollo/client';

export const CREATE_COLLECTION = gql`
	mutation CreateCollection($collection: CollectionInput!) {
		createCollection(collection: $collection)
	}
`
