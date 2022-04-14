import React, { useState, useContext } from 'react';
import {
    useUpdatePageData,
    useUpdateWebsiteSEO,
    useSetWebsiteFavicon,
} from 'services/website/gql/hooks/website.hook';
import { useToast } from 'ds/hooks/useToast';
import { useAuth } from 'libs/auth';
import config from 'config';
import axios from 'axios';
import lz from 'lzutf8';

export const WebsiteContext = React.createContext({});

export const useWebsite = () => useContext(WebsiteContext);

export const WebsiteProvider = ({ children }) => {
    const { addToast } = useToast();
    const [website, setWebsite] = useState({});
    const [imagePlaceHolders, setImagePlaceHolders] = useState([
        'https://via.placeholder.com/',
        'https://dummyimage.com/',
    ]);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [isImportContractOpen, setIsImportContractOpen] = useState(false);
    const [importContractAddress, setImportContractAddress] = useState('');
    const [importABI, setImportABI] = useState('');
    const { user } = useAuth();
    const [updatePageData] = useUpdatePageData({
        onCompleted: () =>
            addToast({
                severity: 'success',
                message: 'Progress saved!',
            }),
        onError: (err) =>
            addToast({
                severity: 'error',
                message: err.message,
            }),
    });
    const [updateWebsiteSEO] = useUpdateWebsiteSEO({
        onCompleted: () => {
            // Do Nothing
        },
        onError: (err) =>
            addToast({
                severity: 'error',
                message: err.message,
            }),
    });
    const [setWebsiteFavicon] = useSetWebsiteFavicon({
        onCompleted: () => {
            // Do Nothing
        },
        onError: (err) =>
            addToast({
                severity: 'error',
                message: err.message,
            }),
    });

    const getWebsitePage = (pageName) => {
        return website?.pages.find((page) => page.name == pageName);
    };

    const onSave = async (query) => {
        if (!website.isSubscribed) {
            setIsCheckoutModalOpen(true);
        } else {
            onSaveChanges(query);
        }
    };

    const onSaveChanges = async (query) => {
        try {
            const json = query.serialize();
            const pageData = lz.encodeBase64(lz.compress(json));
            const websiteId = getWebsiteId();
            const pageName = getPageName();

            // Removed unused images when saved
            await removeUnusedImages(json);

            if (website.author !== user.id)
                throw new Error('Failed to save, you do not own this website.');

            if (website.title !== websiteId)
                throw new Error('Failed to save, wrong website id.');

            // Change if we support multiple pages
            if (website.pages[0].name !== pageName)
                throw new Error('Failed to save, wrong page name.');

            await updatePageData({
                variables: {
                    websiteId,
                    pageName,
                    pageData,
                },
            });
        } catch (e) {
            addToast({
                severity: 'error',
                message: e.message,
            });
        }
    };

    const deleteImage = async (imageID, isSettings = false) => {
        try {
            const opt = {
                headers: {
                    Accept: 'application/vnd.uploadcare-v0.6+json',
                    Authorization: `Uploadcare.Simple ${config.uploadcare.publicKey}:${config.uploadcare.secretKey}`,
                },
            };
            const res = await axios.delete(
                `https://api.uploadcare.com/files/${imageID}/`,
                opt
            );

            removeImageFromLocal(imageID, isSettings);
        } catch (e) {
            addToast({
                severity: 'error',
                message: e.message,
            });
        }
    };

    const deleteImageBulk = async (imageIdArray, isSettings = false) => {
        try {
            imageIdArray.forEach((imageId) => {
                removeImageFromLocal(imageId, isSettings);
            });

            const opt = {
                headers: {
                    Accept: 'application/vnd.uploadcare-v0.6+json',
                    Authorization: `Uploadcare.Simple ${config.uploadcare.publicKey}:${config.uploadcare.secretKey}`,
                },
                data: imageIdArray,
            };

            const res = await axios.delete(
                `https://api.uploadcare.com/files/storage/`,
                opt
            );
        } catch (e) {
            addToast({
                severity: 'error',
                message: e.message,
            });
        }
    };

    // Add Image to local storage
    // Note: LocalStorage key is different for website builder and settings
    const addImageToLocal = (uuid, isSettings = false) => {
        const websiteId = getWebsiteId();
        const pageName = getPageName();

        let storageItems;
        if (isSettings)
            storageItems = localStorage.getItem(
                `${websiteId}-${pageName}-images-settings`
            );
        else
            storageItems = localStorage.getItem(
                `${websiteId}-${pageName}-images`
            );

        if (!storageItems) {
            if (isSettings)
                localStorage.setItem(
                    `${websiteId}-${pageName}-images-settings`,
                    JSON.stringify([uuid])
                );
            else
                localStorage.setItem(
                    `${websiteId}-${pageName}-images`,
                    JSON.stringify([uuid])
                );
        } else {
            let currentUploadedImages = JSON.parse(storageItems);
            currentUploadedImages.push(uuid);
            if (isSettings)
                localStorage.setItem(
                    `${websiteId}-${pageName}-images-settings`,
                    JSON.stringify(currentUploadedImages)
                );
            else
                localStorage.setItem(
                    `${websiteId}-${pageName}-images`,
                    JSON.stringify(currentUploadedImages)
                );
        }
    };

    // Remove Image from local storage
    // Note: LocalStorage key is different for website builder and settings
    const removeImageFromLocal = (uuid, isSettings = false) => {
        const websiteId = getWebsiteId();
        const pageName = getPageName();

        let storageItems;
        if (isSettings)
            storageItems = localStorage.getItem(
                `${websiteId}-${pageName}-images-settings`
            );
        else
            storageItems = localStorage.getItem(
                `${websiteId}-${pageName}-images`
            );

        if (!storageItems) return;
        let currentUploadedImages = JSON.parse(storageItems);
        currentUploadedImages.splice(currentUploadedImages.indexOf(uuid), 1);

        if (isSettings)
            localStorage.setItem(
                `${websiteId}-${pageName}-images-settings`,
                JSON.stringify(currentUploadedImages)
            );
        else
            localStorage.setItem(
                `${websiteId}-${pageName}-images`,
                JSON.stringify(currentUploadedImages)
            );
    };

    // Remove Unused Images from database
    // Note: LocalStorage key is different for website builder and settings
    // Note: if on settings, im passing settings images through jsonPageData parameter
    const removeUnusedImages = async (jsonPageData, isSettings = false) => {
        const websiteId = getWebsiteId();
        const pageName = getPageName();

        let storageItems;
        if (isSettings)
            storageItems = localStorage.getItem(
                `${websiteId}-${pageName}-images-settings`
            );
        else
            storageItems = localStorage.getItem(
                `${websiteId}-${pageName}-images`
            );

        if (storageItems != null && storageItems.length > 0) {
            let unusedImages = [];
            JSON.parse(storageItems).forEach((imageId) => {
                if (jsonPageData.indexOf(imageId) == -1)
                    unusedImages.push(imageId);
            });
            if (!unusedImages.length) return;
            await deleteImageBulk(unusedImages, isSettings);
        }
    };

    const getWebsiteId = () => {
        return window.location.pathname.split('/')[2];
    };

    const getPageName = () => {
        return window.location.pathname.split('/')[3];
    };

    const goToSettings = () => {
        location.href = `/websites/${getWebsiteId()}/${getPageName()}/settings`;
    };

    const goToBuilder = () => {
        location.href = `/websites/${getWebsiteId()}/${getPageName()}`;
    };

    // Update old website versions
    const updateOldWebsites = async () => {
        if (!Object.keys(website).length > 0) return;

        // Add Favicon
        if (!website.favicon) {
            await setWebsiteFavicon({
                variables: {
                    websiteId: website._id,
                    imageUrl: 'https://dummyimage.com/25x25',
                },
            });
        }

        // Add SEO
        if (!website.seo) {
            const defaultData = {
                title: 'Ambition | Mint Website',
                previewTitle: 'Ambition',
                description:
                    'Generate thousands of digital arts online - The simplest way. Use our no-code NFT collection generator software to build the next BAYC.',
                keywords:
                    'Ambition, Ambition SO, NFTDataGen, Mint Website, Mint NFT Website Hosting, Mint NFT, NFT, Mint, Crypto Currency, Crypto, Ethereum',
                language: 'EN',
                robots: 'index, follow',
                url: 'https://ambition.so/',
                image: 'https://dummyimage.com/215x215',
            };
            await updateWebsiteSEO({
                variables: { websiteId: website._id, data: defaultData },
            });
        }
    };

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
                goToSettings,
                getWebsiteId,
                getPageName,
                goToBuilder,
                updateOldWebsites,
                isImportContractOpen,
                setIsImportContractOpen,
                importContractAddress,
                setImportContractAddress,
                importABI,
                setImportABI,
            }}>
            {children}
        </WebsiteContext.Provider>
    );
};
