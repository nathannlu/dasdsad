import React, { useState, useContext } from 'react';
import { useUpdatePageData } from '../gql/hooks/website.hook';

export const WebsiteContext = React.createContext({})

export const useWebsite = () => useContext(WebsiteContext);

export const WebsiteProvider = ({ children }) => {
	const [website, setWebsite] = useState({});

//	const [updatePageData, { data }] = useUpdatePageData()

	/*
	const saveToDatabase = (pageData, pageName, title) => {
		updatePageData({ variables: { pageName, pageData } })
	}
	*/

	const getWebsitePage = (pageName) => {
		return website.pages.find(page => page.pageName == pageName);
	}

	return (
		<WebsiteContext.Provider
			value={{
				website,
				setWebsite,
	//			saveToDatabase,
				getWebsitePage,
			}}
		>
			{children}
		</WebsiteContext.Provider>
	)
};

