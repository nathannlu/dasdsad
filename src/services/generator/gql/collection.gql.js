import { gql } from '@apollo/client';

export const CREATE_COLLECTION = gql`
    mutation CreateCollection($collection: CollectionInput!) {
        createCollection(collection: $collection)
    }
`;

export const GET_COLLECTIONS = gql`
    query GetCollections {
        getCollections {
            id
            name
            description
            size
            author
            layers {
                name
                weight
                images {
                    name
                    weight
                    url
                }
            }
        }
    }
`;
