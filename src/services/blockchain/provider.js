import React, { useState, useContext } from 'react';

export const ContractContext = React.createContext({})

export const useContract = () => useContext(ContractContext)

export const ContractProvider = ({ children }) => {

	return (
		<ContractContext.Provider>
			{ children }
		</ContractContext.Provider>
	)
}
