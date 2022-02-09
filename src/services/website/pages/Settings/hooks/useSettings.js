import { useState, useEffect } from 'react';
import { useWebsite } from 'services/website/provider';
import { useDeleteWebsite, useSetWebsiteFavicon, useUpdateWebsiteSEO } from 'services/website/gql/hooks/website.hook'
import { useToast } from 'ds/hooks/useToast';

const useSettings = () => {
    const { addToast } = useToast();
    const { website, addImageToLocal, deleteImage, removeUnusedImages, websiteId, pageName } = useWebsite();
    const [tabValue, setTabValue] = useState('general');
    const [confirmationState, setConfirmationState] = useState(false);
    const [confirmationData, setConfirmationData] = useState(null);
    const [faviconImage, setFaviconImage] = useState('https://dummyimage.com/25x25');
    const [displayImage, setDisplayImage] = useState('https://dummyimage.com/215x215');
    const [deleteWebsite] = useDeleteWebsite({
        websiteId: website._id,
		onCompleted: () => {
            addToast({
                severity: 'success',
                message: "Website Deleted"
            })
            location.href = '/';
        },
		onError: err => addToast({
			severity: 'error',
			message: err.message
		})
	})
    const [setWebsiteFavicon] = useSetWebsiteFavicon({
        onCompleted: () => {
            addToast({
                severity: 'success',
                message: "Website Favicon Changed"
            })
        },
		onError: err => addToast({
			severity: 'error',
			message: err.message
		})
    })
    const [updateWebsiteSEO] = useUpdateWebsiteSEO({
        onCompleted: () => {
            addToast({
                severity: 'success',
                message: "Saved changes"
            })
        },
		onError: err => addToast({
			severity: 'error',
			message: err.message
		})
    })

    // Set favicon image and remove unused images on load
    useEffect(() => {
        if (!Object.keys(website).length) return;
        const update = async () => {
            setFaviconImage(website.favicon ? website.favicon : "https://dummyimage.com/25x25");
            // Check for old websites
            const defaultData = {
                title: "Ambition | Mint Website",
                previewTitle: "Ambition",
                description: "Generate thousands of digital arts online - The simplest way. Use our no-code NFT collection generator software to build the next BAYC.",
                keywords: "Ambition, Ambition SO, NFTDataGen, Mint Website, Mint NFT Website Hosting, Mint NFT, NFT, Mint, Crypto Currency, Crypto, Ethereum",
                language: "EN",
                robots: "index, follow",
                url: "https://ambition.so/",
                image: "https://dummyimage.com/215x215",
            }
            if (!website.seo) {
                await updateWebsiteSEO({ variables: { websiteId: website._id, data: defaultData } });
                location.reload();
            }
            setDisplayImage(website.seo.image);
            const faviconUUID = website.favicon.substring(website.favicon.indexOf(".com/") + 5, website.favicon.length - 1);
            const displayUUID = website.seo.image.substring(website.seo.image.indexOf(".com/") + 5, website.seo.image.length - 1);
            removeUnusedImages([faviconUUID, displayUUID], true);
        }
        update();
    }, [website])


    const onDeleteDialog = () => {
        setConfirmationData({
            title: 'Are you sure?',
            description: 'Do you want to delete this website?'
        })
        setConfirmationState(true);
    }

    const onProceedDelete = async () => {
        localStorage.removeItem(`${websiteId}-${pageName}-images-settings`);
        localStorage.removeItem(`${websiteId}-${pageName}-images`);
        await deleteWebsite();
    }

    const onDeleteFavicon = async () => {
        const uuid = faviconImage.substring(faviconImage.indexOf(".com/") + 5, faviconImage.length - 1);
        await deleteImage(uuid, true);
        setFaviconImage('https://dummyimage.com/25x25');
        await setWebsiteFavicon({ variables: { websiteId: website._id, imageUrl: 'https://dummyimage.com/25x25' } });
    }

    const onChangeFavicon = async (info) => {
        setFaviconImage(info.cdnUrl);
        addImageToLocal(info.uuid, true);
        await setWebsiteFavicon({ variables: { websiteId: website._id, imageUrl: info.cdnUrl } });
    }

    const onSaveSEO = async (data) => {
        let newData = {...data};
        if (!newData.language) newData.language = "EN";
        if (!newData.robot) newData.robots = "index, follow";
        if (typeof newData.language === 'object' && Object.keys(newData.language).length && newData.language.data.length) newData.language = newData.language.data 
        else newData.language = newData.language = "EN";

        await updateWebsiteSEO({ variables: { websiteId: website._id, data: newData } })
    }

    const onChangeDisplayImage = async (info, data) => {
        let newData = {...data};
        if (!newData.language) newData.language = "EN";
        if (!newData.robot) newData.robots = "index, follow";
        if (typeof newData.language === 'object' && Object.keys(newData.language).length && newData.language.data.length) newData.language = newData.language.data 
        else newData.language = newData.language = "EN";

        setDisplayImage(info.cdnUrl);
        addImageToLocal(info.uuid, true);
        await updateWebsiteSEO({ variables: { websiteId: website._id, data: newData } })
    }

    const onDeleteDisplayImage = async (data) => {
        let newData = {...data};
        if (!newData.language) newData.language = "EN";
        if (!newData.robot) newData.robots = "index, follow";
        if (typeof newData.language === 'object' && Object.keys(newData.language).length && newData.language.data.length) newData.language = newData.language.data 
        else newData.language = newData.language = "EN";

        const uuid = displayImage.substring(displayImage.indexOf(".com/") + 5, displayImage.length - 1);
        await deleteImage(uuid, true);
        setDisplayImage('https://dummyimage.com/215x215');
        await updateWebsiteSEO({ variables: { websiteId: website._id, data: newData } })
    }

    return {
        tabValue,
        setTabValue,
        onDeleteDialog,
        confirmationState,
        setConfirmationState,
        confirmationData,
        setConfirmationData,
        onProceedDelete,
        faviconImage,
        onChangeFavicon,
        onDeleteFavicon,
        onSaveSEO,
        displayImage,
        onChangeDisplayImage,
        onDeleteDisplayImage,
    }
}

export default useSettings