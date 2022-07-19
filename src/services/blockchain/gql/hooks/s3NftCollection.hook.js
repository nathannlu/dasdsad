import { useMutation } from '@apollo/client';
import { UPLOAD_S3_NFT_COLLECTION, DELETE_S3_NFT_COLLECTION } from '../s3NftCollection.gql';

export const useUploadS3NftCollection = ({ onCompleted, onError }) => useMutation(UPLOAD_S3_NFT_COLLECTION, { onCompleted, onError });
export const useDeleteS3NftCollection = ({ onCompleted, onError }) => useMutation(DELETE_S3_NFT_COLLECTION, { onCompleted, onError });