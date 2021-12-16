import React, { useState, useContext } from 'react';
import { useArray } from 'ds/hooks/useArray';

export const CollectionContext = React.createContext({});
export const useCollection = () => useContext(CollectionContext);


export const CollectionProvider = ({ children }) => {
	const {
		list: layers,
		setList: setLayers,
		addToArray,
		selected,
		setSelected
	} = useArray();

	let collectionSize = { value: 10 };
	
	return (
		<CollectionContext.Provider
			value={{
				layers,
				setLayers,
				collectionSize,
				addToArray,
				selected,
				setSelected
			}}
		>
			{children}
		</CollectionContext.Provider>
	)
};
