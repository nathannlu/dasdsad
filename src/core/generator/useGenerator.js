

import { useContext } from 'react';
import { GeneratorContext } from './GeneratorContext';

export const useGenerator = () => {
	return useContext(
		GeneratorContext
	);
}


