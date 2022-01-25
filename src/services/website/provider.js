import React, { useState, useContext } from 'react';

export const WebsiteContext = React.createContext({})

export const useWebsite = () => useContext(WebsiteContext)


export const WebsiteProvider = ({ children }) => {

	return (
		<WebsiteContext.Provider>
			{ children }
		</WebsiteContext.Provider>
	)
}
