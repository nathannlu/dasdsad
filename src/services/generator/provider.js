import React, { useState, useContext } from 'react';
import { MetadataProvider } from 'services/generator/controllers/metadata';
import { LayerManagerProvider } from 'services/generator/controllers/manager';
import { GeneratorProvider } from 'services/generator/controllers/generator';

export const CollectionContext = React.createContext({})

export const useCollection = () => useContext(CollectionContext)


export const CollectionProvider = ({ children }) => {

	return (
		<CollectionContext.Provider>
				<MetadataProvider>
					<LayerManagerProvider>
						<GeneratorProvider>
							{ children }
						</GeneratorProvider>
					</LayerManagerProvider>
				</MetadataProvider>
		</CollectionContext.Provider>
	)
}
