import React, { useState, useContext } from 'react';
import { useUpdatePageData } from 'services/website/gql/hooks/website.hook';
import { useToast } from 'ds/hooks/useToast';
import { useAuth } from 'libs/auth';
import config from 'config'
import axios from 'axios';
import lz from 'lzutf8';

export const WebsiteContext = React.createContext({})

export const useWebsite = () => useContext(WebsiteContext);

export const WebsiteProvider = ({ children }) => {
    const { addToast } = useToast();
	const [website, setWebsite] = useState({});
    const [imagePlaceHolders, setImagePlaceHolders] = useState(['https://via.placeholder.com/', 'https://dummyimage.com/'])
	const [updatePageData, { data }] = useUpdatePageData({
		onCompleted: () => addToast({
			severity: 'success',
			message: "Progress saved!"
		}),
		onError: err => addToast({
			severity: 'error',
			message: err.message
		})
	})
    const { user } =  useAuth();
    
	const getWebsitePage = (pageName) => {
		return website?.pages.find(page => page.name == pageName);
	}

    const onSaveChanges = (query, silent = false) => {
        try {
            const json = query.serialize();
            const pageData = (lz.encodeBase64(lz.compress(json)));
            const websiteId = window.location.pathname.split("/").slice(-2)[0];
            const pageName = window.location.pathname.split("/").slice(-1).pop();
            
            if (website.author !== user.id) throw new Error("Failed to save, you do not own this website.");

            if (website.title !== websiteId) throw new Error("Failed to save, wrong website id.");

            // Change if we support multiple pages
            if (website.pages[0].name !== pageName) throw new Error("Failed to save, wrong page name.");

            updatePageData({ variables: { 
                websiteId,
                pageName,
                pageData
            }})
        }
        catch (e) {
            if (!silent) {
                addToast({
                    severity: 'error',
                    message: e.message
                })
            }
        }
    }

    const deleteImage = async (imageID) => {
        try {
            const opt = {
                headers: {
                    'Accept': "application/vnd.uploadcare-v0.6+json",
                    'Authorization': `Uploadcare.Simple ${config.uploadcare.publicKey}:${config.uploadcare.secretKey}`,
                }
            }
            const res = await axios.delete(`https://api.uploadcare.com/files/${imageID}/`, opt);
        }
        catch (e) {
            addToast({
                severity: 'error',
                message: e.message
            });
        }
    }

	return (
		<WebsiteContext.Provider
			value={{
				website,
				setWebsite,
				getWebsitePage,
                deleteImage,
                onSaveChanges,
                imagePlaceHolders,
			}}
		>
			{children}
		</WebsiteContext.Provider>
	)
};
