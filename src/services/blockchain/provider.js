import React, { useState, useContext } from 'react';

export const DeployContext = React.createContext({})

export const useDeploy = () => useContext(DeployContext)


export const DeployProvider = ({ children }) => {

	return (
		<DeployContext.Provider>
			{ children }
		</DeployContext.Provider>
	)
}
