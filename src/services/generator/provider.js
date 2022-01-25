import React, { useState, useContext } from 'react';

export const CollectionContext = React.createContext({})

export const useCollection = () => useContext(CollectionContext)


export const CollectionProvider = ({ children }) => {

	return (
		<CollectionContext.Provider>
			{ children }
		</CollectionContext.Provider>
	)
}
