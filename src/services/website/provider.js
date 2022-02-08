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
    const [imagePlaceHolders, setImagePlaceHolders] = useState(['https://via.placeholder.com/', 'https://dummyimage.com/']);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
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

    const onSave = async (query) => {
        if (!website.isSubscribed) {
            setIsCheckoutModalOpen(true);
        } else {
            onSaveChanges(query);
        }
    }
 
    const onSaveChanges = async (query) => {
        try {
            const json = query.serialize();
            const pageData = (lz.encodeBase64(lz.compress(json)));
            const websiteId = window.location.pathname.split("/").slice(-2)[0];
            const pageName = window.location.pathname.split("/").slice(-1).pop();
            
            // Removed unused images when saved
            await removeUnusedImages(json);

            if (website.author !== user.id) throw new Error("Failed to save, you do not own this website.");

            if (website.title !== websiteId) throw new Error("Failed to save, wrong website id.");

            // Change if we support multiple pages
            if (website.pages[0].name !== pageName) throw new Error("Failed to save, wrong page name.");

            await updatePageData({ variables: { 
                websiteId,
                pageName,
                pageData
            }})
        }
        catch (e) {
            addToast({
                severity: 'error',
                message: e.message
            })
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

            removeImageFromLocal(imageID);
        }
        catch (e) {
            addToast({
                severity: 'error',
                message: e.message
            });
        }
    }

    const deleteImageBulk = async (imageIdArray) => {
        try {
            imageIdArray.forEach((imageId) => {
                removeImageFromLocal(imageId);
            })

            const opt = {
                headers: {
                    'Accept': "application/vnd.uploadcare-v0.6+json",
                    'Authorization': `Uploadcare.Simple ${config.uploadcare.publicKey}:${config.uploadcare.secretKey}`,
                },
                data: imageIdArray
            }

            const res = await axios.delete(`https://api.uploadcare.com/files/storage/`, opt);
        }
        catch (e) {
            addToast({
                severity: 'error',
                message: e.message
            });
        }
    }

    const addImageToLocal = (uuid) => {
        const websiteId = window.location.pathname.split("/").slice(-2)[0];
        const pageName = window.location.pathname.split("/").slice(-1).pop();
        const storageItems = localStorage.getItem(`${websiteId}-${pageName}-images`);
        if (!storageItems) {
            localStorage.setItem(`${websiteId}-${pageName}-images`, JSON.stringify([uuid]));
        } else {
            let currentUploadedImages = JSON.parse(storageItems);
            currentUploadedImages.push(uuid);
            localStorage.setItem(`${websiteId}-${pageName}-images`, JSON.stringify(currentUploadedImages));
        }
    }

    const removeImageFromLocal = (uuid) => {
        const websiteId = window.location.pathname.split("/").slice(-2)[0];
        const pageName = window.location.pathname.split("/").slice(-1).pop();
        const storageItems = localStorage.getItem(`${websiteId}-${pageName}-images`);
        if (!storageItems) return;
        let currentUploadedImages = JSON.parse(storageItems);
        currentUploadedImages.splice(currentUploadedImages.indexOf(uuid), 1);
        localStorage.setItem(`${websiteId}-${pageName}-images`, JSON.stringify(currentUploadedImages));
    }

    const removeUnusedImages = async (jsonPageData) => {
        const websiteId = window.location.pathname.split("/").slice(-2)[0];
        const pageName = window.location.pathname.split("/").slice(-1).pop();
        const storageItems = localStorage.getItem(`${websiteId}-${pageName}-images`);
        if (storageItems != null && storageItems.length > 0) {
            let unusedImages = [];
            JSON.parse(storageItems).forEach((imageId) => {
                if (jsonPageData.indexOf(imageId) == -1) unusedImages.push(imageId);
            })
            if (!unusedImages.length) return;
            await deleteImageBulk(unusedImages)
        }
    }

	return (
		<WebsiteContext.Provider
			value={{
				website,
				setWebsite,
				getWebsitePage,
                deleteImage,
                deleteImageBulk,
                onSaveChanges,
                imagePlaceHolders,
                addImageToLocal,
                removeImageFromLocal,
                removeUnusedImages,
                isCheckoutModalOpen,
                setIsCheckoutModalOpen,
                onSave,
			}}
		>
			{children}
		</WebsiteContext.Provider>
	)
};
