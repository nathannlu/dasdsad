/**
 * Handles everything related to Layers array
 */

import { useContext } from 'react';
import { LayerManagerContext } from './LayerManagerContext';

export const useLayerManager = () => {
    return useContext(LayerManagerContext);
};
