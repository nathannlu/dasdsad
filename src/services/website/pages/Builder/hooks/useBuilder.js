import { useEffect } from 'react';
import { useWebsite } from 'services/website/provider';

export const useBuilder = () => {
	const {website, websites, setWebsite} = useWebsite();
	
	const getWebsiteId = () => {
		return window.location.pathname.split('/')[2];
	};

	const getPageName = () => {
		return window.location.pathname.split('/')[3];
	};


	useEffect(() => {
		console.log(getWebsiteId(), getPageName())
	}, [])
	

	return {
		getPageName	
	}
};
