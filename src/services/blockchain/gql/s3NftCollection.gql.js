import { gql } from '@apollo/client';

export const UPLOAD_S3_NFT_COLLECTION = gql`
    mutation UploadS3NftCollection($collection: [Upload!]!, $contractId: ID!, $collectionType: String!, $type: String!) {
        uploadS3NftCollection(collection: $collection, contractId: $contractId, collectionType: $collectionType, type: $type)
    }
`;

export const DELETE_S3_NFT_COLLECTION = gql`
    mutation DeleteS3NftCollection($contractId: ID!) {
        deleteS3NftCollection(contractId: $contractId)
    }
`;