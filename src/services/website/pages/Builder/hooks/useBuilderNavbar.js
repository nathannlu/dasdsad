import { useState, useEffect } from 'react';
import { useWebsite } from 'services/website/provider';
import { useAddPageToPublish, useRemovePageFromPublish } from 'services/website/gql/hooks/website.hook'
import { useToast } from 'ds/hooks/useToast';

const useBuilderNavbar = () => {
    const { addToast } = useToast();
    const { website, getPageName } = useWebsite();
    const [menuAnchor, setMenuAnchor] = useState(null);
    const openAnchor = Boolean(menuAnchor);
    const [isPublishing, setIsPublishing] = useState(false);
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

    const onPublish = (e) => {
        setMenuAnchor(e.currentTarget);
    }

    const onCloseAnchor = () => {
        setMenuAnchor(null);
    }

    const onPublishToDomain = async () => {
        const curPage = getPageName();
        const indexOfPublished = website.published.findIndex(page => page.name === curPage);
        setIsPublishing(true);

        try {
            if (indexOfPublished === -1) {
                const indexOfPage = website.pages.findIndex(page => page.name === curPage);
                await addPageToPublish({variables: {websiteId: website._id, pageIdx: indexOfPage}});
                addToast({
                    severity: 'success',
                    message: 'This page has been published'
                })
                setIsPublishing(false);
            }
            else {
                await removePageFromPublish({variables: {websiteId: website._id, pageIdx: indexOfPublished}});
                console.log("removed")
                await addPageToPublish({variables: {websiteId: website._id, pageIdx: indexOfPublished}});
                console.log("added")
                addToast({
                    severity: 'success',
                    message: 'This page has been published'
                })
                setIsPublishing(false);
            }
        }
        catch(err) {
            setIsPublishing(false);
            console.log(err);
        }
    }

    const isPagePublished = () => {
        return website?.published?.findIndex(page => page.name === getPageName()) !== -1;
    }

    return {
        menuAnchor,
        openAnchor,
        isPublishing,
        onPublish,
        onCloseAnchor,
        onPublishToDomain,
        isPagePublished,
    }
}

export default useBuilderNavbar