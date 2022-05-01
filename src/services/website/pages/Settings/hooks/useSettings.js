import { useState, useEffect } from 'react';
import { useAuth } from 'libs/auth';
import { useWebsite } from 'services/website/provider';
import {
    useDeleteWebsite,
    useSetWebsiteFavicon,
    useUpdateWebsiteSEO,
    useVerifyDns,
    useAddCustomDomain,
    useRemoveCustomDomain,
    useSetCustomDomain,
    useAddPageToPublish,
    useRemovePageFromPublish,
    useSetContractAddress,
    useUpdateWebsiteCustom,
    useSetABI
} from 'services/website/gql/hooks/website.hook';
import { useToast } from 'ds/hooks/useToast';
import { useGetContracts } from 'services/blockchain/gql/hooks/contract.hook';

import { GENERATE_SSL_CERTIFICATE } from 'services/website/gql/website.gql';

const useSettings = () => {
    const { isAuthenticated } = useAuth();
    const { addToast } = useToast();
    const {
        website,
        addImageToLocal,
        deleteImage,
        removeUnusedImages,
        websiteId,
        pageName,
        importContractAddress,
        setIsImportContractOpen,
        importABI,
        setWebsite
    } = useWebsite();
    const [tabValue, setTabValue] = useState('general');
    const [confirmationState, setConfirmationState] = useState(false);
    const [confirmationData, setConfirmationData] = useState(null);
    const [faviconImage, setFaviconImage] = useState(
        'https://dummyimage.com/25x25'
    );
    const [displayImage, setDisplayImage] = useState(
        'https://dummyimage.com/215x215'
    );
    const [styleSaveStatus, setStyleSaveStatus] = useState(false);
    const [seoSaveStatus, setSeoSaveStatus] = useState(false);
    const [showDomainModal, setShowDomainModal] = useState(false);
    const [domainIsActive, setDomainIsActive] = useState(false);
    const [domainName, setDomainName] = useState('');
    const [contracts, setContracts] = useState([]);
    const [contractAnchor, setContractAnchor] = useState(null);
    const [customSaveStatus, setCustomSaveStatus] = useState(false);
    const [customHead, setCustomHead] = useState('');
    const [customBody, setCustomBody] = useState('');
    const openContractAnchor = Boolean(contractAnchor);
    const [deleteWebsite] = useDeleteWebsite({
        websiteId: website._id,
        onError: (err) =>
            addToast({
                severity: 'error',
                message: err.message,
            }),
    });
    const [setWebsiteFavicon] = useSetWebsiteFavicon({
        onCompleted: () => {
            addToast({
                severity: 'success',
                message: 'Website Favicon Changed',
            });
        },
        onError: (err) =>
            addToast({
                severity: 'error',
                message: err.message,
            }),
    });
    const [updateWebsiteSEO] = useUpdateWebsiteSEO({
        onCompleted: () => {
            addToast({
                severity: 'success',
                message: 'Saved changes',
            });
        },
        onError: (err) =>
            addToast({
                severity: 'error',
                message: err.message,
            }),
    });
    const [addCustomDomain] = useAddCustomDomain({
        websiteId: website._id,
        domain: domainName,
        onError: (err) =>
            addToast({
                severity: 'error',
                message: err.message,
            }),
    });
    const [verifyDns] = useVerifyDns({
        domain: domainName,
        onError: (err) =>
            addToast({
                severity: 'error',
                message: err.message,
            }),
    });
    const [removeCustomDomain] = useRemoveCustomDomain({
        domain: domainName,
        onError: (err) =>
            addToast({
                severity: 'error',
                message: err.message,
            }),
    });
    const [setCustomDomain] = useSetCustomDomain({
        domain: domainName,
        isActive: domainIsActive,
        onError: (err) =>
            addToast({
                severity: 'error',
                message: err.message,
            }),
    });

    const [addPageToPublish] = useAddPageToPublish({
        onError: (err) =>
            addToast({
                severity: 'error',
                message: err.message,
            }),
    });
    const [removePageFromPublish] = useRemovePageFromPublish({
        onError: (err) =>
            addToast({
                severity: 'error',
                message: err.message,
            }),
    });
    const [setContractAddress] = useSetContractAddress({
        onError: (err) =>
            addToast({
                severity: 'error',
                message: err.message,
            }),
    });
    const [setABI] = useSetABI({
        onError: (err) =>
            addToast({
                severity: 'error',
                message: err.message,
            }),
    });
    const [updateWebsiteCustom] = useUpdateWebsiteCustom({
        onError: (err) =>
            addToast({
                severity: 'error',
                message: err.message,
            }),
    });
    useGetContracts({
        onCompleted: (data) => {
            const availableContracts = data.getContracts.filter(
                (contract) => contract.address
            );
            if (!availableContracts.length) return;
            setContracts(availableContracts);
        },
    });

    useEffect(() => {
        if (!Object.keys(website).length) return;
        const update = async () => {
            // Set images and remove unused images
            setFaviconImage(
                website.favicon
                    ? website.favicon
                    : 'https://dummyimage.com/25x25'
            );
            setDisplayImage(website.seo.image);
            const faviconUUID = website.favicon.substring(
                website.favicon.indexOf('.com/') + 5,
                website.favicon.length - 1
            );
            const displayUUID = website.seo.image.substring(
                website.seo.image.indexOf('.com/') + 5,
                website.seo.image.length - 1
            );
            removeUnusedImages([faviconUUID, displayUUID], true);

            // Set Custom Codes
            if (website.custom) {
                setCustomHead(website.custom.head);
                setCustomBody(website.custom.body);
            }
        };
        update();
    }, [website]);

    const onDeleteDialog = () => {
        setConfirmationData({
            title: 'Are you sure?',
            description: 'Do you want to delete this website?',
        });
        setConfirmationState(true);
    };

    const onProceedDelete = async () => {
        await removeUnusedImages([]);
        await removeUnusedImages([], true);
        localStorage.removeItem(`${websiteId}-${pageName}-images-settings`);
        localStorage.removeItem(`${websiteId}-${pageName}-images`);
        await deleteWebsite();
    };

    const onDeleteFavicon = async () => {
        setFaviconImage('https://dummyimage.com/25x25');
        setStyleSaveStatus(true);
    };

    const onChangeFavicon = async (info) => {
        setFaviconImage(info.cdnUrl);
        addImageToLocal(info.uuid, true);
        setStyleSaveStatus(true);
    };

    const onSaveFavicon = async () => {
        // Save new favicon
        if (faviconImage !== 'https://dummyimage.com/25x25') {
            const uuid = faviconImage.substring(
                faviconImage.indexOf('.com/') + 5,
                faviconImage.length - 1
            );
            const faviconURL = `https://ucarecdn.com/${uuid}/`;
            setFaviconImage(faviconURL);
            await setWebsiteFavicon({
                variables: { websiteId: website._id, imageUrl: faviconURL },
            });
        } // Delete favicon
        else if (
            website.favicon !== 'https://dummyimage.com/25x25' &&
            faviconImage === 'https://dummyimage.com/25x25'
        ) {
            const uuid = website.favicon.substring(
                website.favicon.indexOf('.com/') + 5,
                website.favicon.length - 1
            );
            await deleteImage(uuid, true);
            await setWebsiteFavicon({
                variables: {
                    websiteId: website._id,
                    imageUrl: 'https://dummyimage.com/25x25',
                },
            });
        }

        setStyleSaveStatus(false);
    };

    const onSaveSEO = async (data) => {
        let newData = { ...data };
        if (
            typeof newData.language === 'object' &&
            Object.keys(newData.language).length &&
            newData.language.data.length
        )
            newData.language = newData.language.data;
        else newData.language = newData.language = 'EN';

        // Check if should delete display image
        if (
            website.seo.image !== 'https://dummyimage.com/215x215' &&
            displayImage === 'https://dummyimage.com/215x215'
        ) {
            const uuid = website.seo.image.substring(
                website.seo.image.indexOf('.com/') + 5,
                website.seo.image.length - 1
            );
            console.log(uuid);
            newData.image = 'https://dummyimage.com/215x215';
            await deleteImage(uuid, true);
        }

        await updateWebsiteSEO({
            variables: { websiteId: website._id, data: newData },
        });
        setSeoSaveStatus(false);
    };

    const onChangeDisplayImage = async (info) => {
        setDisplayImage(info.cdnUrl);
        addImageToLocal(info.uuid, true);
        setSeoSaveStatus(true);
    };

    const onDeleteDisplayImage = async () => {
        setDisplayImage('https://dummyimage.com/215x215');
        setSeoSaveStatus(true);
    };

    const onDomainNameChange = (e) => {
        setDomainName(e.target.value);
    };

    const handleAddDomain = () => {
        setDomainName('');
        setShowDomainModal(true);
    };

    const onAddDomain = async (domain) => {
        const domainList = website.domains.map((domain) => domain.name);
        if (domainList.indexOf(domain) == -1) {
            await addCustomDomain();
        }
    };

    const onDeleteDomain = async (domain) => {
        setDomainName(domain);
        await removeCustomDomain({
            variables: { websiteId: website._id, domain },
        });
    };

    const onVerifyDomain = async (domain) => {
        setDomainName(domain);
        await verifyDns({ variables: { websiteId: website._id, domain } });
    };

    const onMakeDefault = async (domain) => {
        setDomainName(domain);
        setDomainIsActive(false);
        await setCustomDomain({
            variables: { websiteId: website._id, domain, isActive: false },
        });
    };

    const onGenerateSSlCertificate = async (domain) => {
        setDomainName(domain);
        const TOKEN_KEY = 'token';
        const getHeaders = () => {
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            const token = window.localStorage.getItem(TOKEN_KEY);
            if (isAuthenticated && token) {
                headers.append('authorization', `Bearer ${token}`);
            }
            return headers;
        }

        const url = process.env.CONFIG === 'dev' || process.env.NODE_ENV === 'development' && 'http://localhost:5000/graphql' || 'https://api.ambition.so/main/graphql';

        try {
            const response = await fetch(url, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ query: GENERATE_SSL_CERTIFICATE, variables: { websiteId: website._id, domain } }) });
            const responseBody = await response.json();
            console.log(responseBody);
            if (!responseBody.data) {
                const errorMessage = responseBody.errors[0]?.message;
                addToast({
                    severity: 'error',
                    message: errorMessage,
                });
                return;
            }

            setWebsite({
                ...website,
                domains: website.domains.map(d => {
                    if (d.domain === domain) {
                        return { ...d, isCustomDomainSslGenerated: true };
                    }
                    return d;
                })
            });

            addToast({
                severity: 'success',
                message: responseBody.data.generateSSlCertificate
            });
        } catch (e) {
            console.error(e, 'ERROR fetching results from apollo query!');
        }
    };

    const onPublishPage = async (pageIdx) => {
        const pageName = website.pages[pageIdx].name;
        const indexOfPublished = website.published.findIndex(
            (page) => page.name === pageName
        );

        if (indexOfPublished === -1) {
            await addPageToPublish({
                variables: { websiteId: website._id, pageIdx },
            });
        } else {
            await removePageFromPublish({
                variables: {
                    websiteId: website._id,
                    pageIdx: indexOfPublished,
                },
            });
        }
    };

    const onDomainState = async () => {
        try {
            const curDomain = website.customDomain;
            if (!curDomain.length)
                throw new Error('Please set a default custom domain first');

            const curState = website.isCustomDomainActive;
            setDomainName(curDomain);
            setDomainIsActive(!curState);
            await setCustomDomain({
                variables: {
                    websiteId: website._id,
                    domain: curDomain,
                    isActive: !curState,
                },
            });
        } catch (err) {
            console.log(err);
            addToast({
                severity: 'error',
                message: err.message,
            });
        }
    };

    const onCloseContractAnchor = () => {
        setContractAnchor(null);
    };

    const onSwitchContract = async (contract) => {
        await setContractAddress({
            variables: { websiteId: website._id, address: contract.address },
        });
        onCloseContractAnchor();
    };

    const onCustomHeadChange = (e) => {
        setCustomHead(e.target.value);
        setCustomSaveStatus(true);
    };

    const onCustomBodyChange = (e) => {
        setCustomBody(e.target.value);
        setCustomSaveStatus(true);
    };

    const onSaveCustom = async () => {
        const newCustom = {
            head: customHead,
            body: customBody,
        };
        await updateWebsiteCustom({
            variables: { websiteId: website._id, data: newCustom },
        });
        addToast({
            severity: 'success',
            message: "Updated Website's Custom Code",
        });
        setCustomSaveStatus(false);
    };

    const onImportContract = async () => {
        try {
            if (!importContractAddress.length) throw new Error('Please enter the contract address you want to import');
            if (importContractAddress.at(1) !== 'x' || importContractAddress.length < 5) throw new Error('Please enter a valid contract address');
            if (!importABI.length) throw new Error('Please upload your ABI first');

            // Set website's contract address
            await setContractAddress({
                variables: { websiteId: website._id, address: importContractAddress },
            });

            // Set website's ABI
            await setABI({
                variables: { websiteId: website._id, abi: importABI },
            });

            addToast({
                severity: 'success',
                message: "Imported Contract Successfully",
            });

            setIsImportContractOpen(false);
        }
        catch (err) {
            addToast({
                severity: 'error',
                message: err.message,
            });
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
        contracts,
        contractAnchor,
        openContractAnchor,
        onCloseContractAnchor,
        setContractAnchor,
        onSwitchContract,
        customSaveStatus,
        customHead,
        customBody,
        onCustomHeadChange,
        onCustomBodyChange,
        onSaveCustom,
        onImportContract,
        onGenerateSSlCertificate
    };
};

export default useSettings;
