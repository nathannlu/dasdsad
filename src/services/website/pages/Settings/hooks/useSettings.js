import { useState, useEffect } from 'react';
import { useWebsite } from 'services/website/provider';
import { useDeleteWebsite, useSetWebsiteFavicon, 
    useUpdateWebsiteSEO, useVerifyDns, 
    useAddCustomDomain, useRemoveCustomDomain, 
    useSetCustomDomain, useAddPageToPublish,
    useRemovePageFromPublish,
} from 'services/website/gql/hooks/website.hook'
import { useToast } from 'ds/hooks/useToast';

const useSettings = () => {
    const { addToast } = useToast();
    const { website, addImageToLocal, deleteImage, removeUnusedImages, websiteId, pageName } = useWebsite();
    const [tabValue, setTabValue] = useState('general');
    const [confirmationState, setConfirmationState] = useState(false);
    const [confirmationData, setConfirmationData] = useState(null);
    const [faviconImage, setFaviconImage] = useState('https://dummyimage.com/25x25');
    const [displayImage, setDisplayImage] = useState('https://dummyimage.com/215x215');
    const [styleSaveStatus, setStyleSaveStatus] = useState(false);
    const [seoSaveStatus, setSeoSaveStatus] = useState(false);
    const [showDomainModal, setShowDomainModal] = useState(false);
    const [domainIsActive, setDomainIsActive] = useState(false);
    const [domainName, setDomainName] = useState('');
    const [deleteWebsite] = useDeleteWebsite({
        websiteId: website._id,
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
    const [addCustomDomain] = useAddCustomDomain({
        websiteId: website._id,
        domain: domainName,
        onError: err => addToast({
			severity: 'error',
			message: err.message
		})
    })
    const [verifyDns] = useVerifyDns({
        domain: domainName,
        onError: err => addToast({
			severity: 'error',
			message: err.message
		})
    })
    const [removeCustomDomain] = useRemoveCustomDomain({
        domain: domainName,
        onError: err => addToast({
			severity: 'error',
			message: err.message
		})
    })
    const [setCustomDomain] = useSetCustomDomain({
        domain: domainName,
        isActive: domainIsActive,
        onError: err => addToast({
			severity: 'error',
			message: err.message
		})
    })
    const [addPageToPublish] = useAddPageToPublish({
        onError: err => addToast({
			severity: 'error',
			message: err.message
		})
    })
    const [removePageFromPublish] = useRemovePageFromPublish({
        onError: err => addToast({
			severity: 'error',
			message: err.message
		})
    })

    useEffect(() => {
        if (!Object.keys(website).length) return;
        const update = async () => {

            // Set images and remove unused images
            setFaviconImage(website.favicon ? website.favicon : "https://dummyimage.com/25x25");
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
        await removeUnusedImages([]);
        await removeUnusedImages([], true);
        localStorage.removeItem(`${websiteId}-${pageName}-images-settings`);
        localStorage.removeItem(`${websiteId}-${pageName}-images`);
        await deleteWebsite();
    }

    const onDeleteFavicon = async () => {
        setFaviconImage('https://dummyimage.com/25x25');
        setStyleSaveStatus(true);
    }

    const onChangeFavicon = async (info) => {
        setFaviconImage(info.cdnUrl);
        addImageToLocal(info.uuid, true);
        setStyleSaveStatus(true);
    }

    const onSaveFavicon = async () => {
        // Save new favicon
        if (faviconImage !== 'https://dummyimage.com/25x25') {
            const uuid = faviconImage.substring(faviconImage.indexOf(".com/") + 5, faviconImage.length - 1);
            const faviconURL = `https://ucarecdn.com/${uuid}/`;
            setFaviconImage(faviconURL);
            await setWebsiteFavicon({ variables: { websiteId: website._id, imageUrl: faviconURL } });
        } // Delete favicon
        else if (website.favicon !== 'https://dummyimage.com/25x25' && faviconImage === 'https://dummyimage.com/25x25') {
            const uuid = website.favicon.substring(website.favicon.indexOf(".com/") + 5, website.favicon.length - 1);
            await deleteImage(uuid, true);
            await setWebsiteFavicon({ variables: { websiteId: website._id, imageUrl: 'https://dummyimage.com/25x25' } });
        }

        setStyleSaveStatus(false);
    }

    const onSaveSEO = async (data) => {
        let newData = {...data};
        if (typeof newData.language === 'object' && Object.keys(newData.language).length && newData.language.data.length) newData.language = newData.language.data 
        else newData.language = newData.language = "EN";
        
        // Check if should delete display image
        if (website.seo.image !== 'https://dummyimage.com/215x215' && displayImage === 'https://dummyimage.com/215x215') {
            const uuid = website.seo.image.substring(website.seo.image.indexOf(".com/") + 5, website.seo.image.length - 1);
            console.log(uuid);
            newData.image = 'https://dummyimage.com/215x215';
            await deleteImage(uuid, true);
        }

        await updateWebsiteSEO({ variables: { websiteId: website._id, data: newData } });
        setSeoSaveStatus(false);
    }

    const onChangeDisplayImage = async (info) => {
        setDisplayImage(info.cdnUrl);
        addImageToLocal(info.uuid, true);
        setSeoSaveStatus(true);
    }

    const onDeleteDisplayImage = async () => {
        setDisplayImage('https://dummyimage.com/215x215');
        setSeoSaveStatus(true);
    }

    const onDomainNameChange = (e) => {
        setDomainName(e.target.value);
    }

    const handleAddDomain = () => {
        setDomainName('');
        setShowDomainModal(true);
    }

    const onAddDomain = async (domain) => {
        const domainList = website.domains.map((domain) => domain.name);
        if (domainList.indexOf(domain) == -1) {
            await addCustomDomain();
        }
    }

    const onDeleteDomain = async (domain) => {
        setDomainName(domain);
        await removeCustomDomain({variables: {websiteId: website._id, domain}});
    }

    const onVerifyDomain = async (domain) => {
        setDomainName(domain);
        await verifyDns({variables: {websiteId: website._id, domain}});
    }

    const onMakeDefault = async (domain) => {
        setDomainName(domain);
        setDomainIsActive(false);
        await setCustomDomain({variables: {websiteId: website._id, domain, isActive: false}});
    }

    const onPublishPage = async (pageIdx) => {
        const pageName = website.pages[pageIdx].name;
        const indexOfPublished = website.published.findIndex(page => page.name === pageName);

        if (indexOfPublished === -1) {
            await addPageToPublish({variables: {websiteId: website._id, pageIdx}});
        } else {
            await removePageFromPublish({variables: {websiteId: website._id, pageIdx}});
        }     
    }

    const onDomainState = async () => {
       try {
            const curDomain = website.customDomain;
            if (!curDomain.length) throw new Error('Please set a default custom domain first');
            
            const curState = website.isCustomDomainActive;
            setDomainName(curDomain);
            setDomainIsActive(!curState);
            await setCustomDomain({variables: {websiteId: website._id, domain: curDomain, isActive: !curState}});
       }
       catch (err) {
            console.log(err);
            addToast({
                severity: 'error',
                message: err.message
            })
        }
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
        onSaveFavicon,
        onChangeFavicon,
        onDeleteFavicon,
        displayImage,
        onSaveSEO,
        onChangeDisplayImage,
        onDeleteDisplayImage,
        styleSaveStatus,
        setStyleSaveStatus,
        seoSaveStatus,
        setSeoSaveStatus,
        showDomainModal,
        setShowDomainModal,
        onAddDomain,
        domainName,
        onDomainNameChange,
        onDeleteDomain,
        handleAddDomain,
        onVerifyDomain,
        onMakeDefault,
        onPublishPage,
        onDomainState,
    }
}

export default useSettings