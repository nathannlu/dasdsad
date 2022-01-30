import React, { useState, useContext } from 'react';

export const WebsiteContext = React.createContext({})

export const useWebsite = () => useContext(WebsiteContext);

export const WebsiteProvider = ({ children }) => {
	const [website, setWebsite] = useState({});

	const getWebsitePage = (pageName) => {
		return website?.pages.find(page => page.name == pageName);
	}

	return (
		<WebsiteContext.Provider
			value={{
				website,
				setWebsite,
				getWebsitePage,
			}}
		>
			{children}
		</WebsiteContext.Provider>
	)
};
