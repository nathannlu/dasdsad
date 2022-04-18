import { useContext } from 'react';
import { MetadataContext } from './MetadataContext';

export const useMetadata = () => {
    return useContext(MetadataContext);
};
