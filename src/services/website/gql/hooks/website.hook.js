import { useAuth } from 'libs/auth';
import { useWebsite } from 'services/website/provider';
import { useQuery, useMutation } from '@apollo/client';
import { BUILD_WEBSITE, 
    GET_WEBSITES, 
    CREATE_WEBSITE, 
    ADD_PAGE, 
    DELETE_PAGE, 
    UPDATE_PAGE_DATA, 
    SET_CUSTOM_DOMAIN, 
    VERIFY_DNS, 
    GET_PUBLISHED, 
    DELETE_WEBSITE,
    SET_WEBSITE_FAVICON,
    UPDATE_WEBSITE_SEO,
    SET_WEBSITE_SUBSCRIPTION,
    ADD_CUSTOM_DOMAIN,
    REMOVE_CUSTOM_DOMAIN,
    ADD_PAGE_TO_PUBLISH,
    REMOVE_PAGE_FROM_PUBLISH,
    SET_CONTRACT_ADDRESS,
} from '../website.gql';
import { REAUTHENTICATE } from 'gql/users.gql';

export const useGetWebsites = () => {
	const { setWebsite } = useWebsite();

    const { ...queryResult } = useQuery(GET_WEBSITES, {
		onCompleted: data => {
			setWebsite(data?.getWebsites[0])
            //console.log(data.getWebsites[0])
		}
	});

	return { ...queryResult }
}

export const useGetPublished = ({title, onCompleted}) => {
	const { setWebsite } = useWebsite();

    const { ...queryResult } = useQuery(GET_PUBLISHED, {
		variables: {title},
		onCompleted: data => {
			setWebsite(data?.getPublished)

			onCompleted && onCompleted(data)
		}
	});

	return { ...queryResult }
}

export const useCreateWebsite = ({title, contractAddress, onCompleted, onError}) => {
	const { user } = useAuth();
	const { setWebsite } = useWebsite();

	const [createWebsite, { data }] = useMutation(CREATE_WEBSITE, {
		variables: {
			title,
			contractAddress
		},
		onCompleted: data => {
			setWebsite(data?.createWebsite)
			
			onCompleted &&onCompleted(data);
		},
		onError,
	})

	return [ createWebsite, { data} ];
};

// @TODO change this hook to use variables
export const useUpdatePageData = ({ onCompleted, onError }) => {
	//const { setWebsite } = useWebsite();

	const [updatePageData, { data }] = useMutation(UPDATE_PAGE_DATA, {
		refetchQueries: [
			GET_WEBSITES,
			"GetWebsites"
		],
		onQueryUpdated: (observable, diff) => {
			const websites = diff.result.getWebsites; // why is this getting 2 more websites lmao
			//setWebsite(websites[0]); // setWebsite is undefined at this point
		},
		onCompleted,
		onError
	})

	return [ updatePageData, { data }];
};

// WIP
export const useAddPage = ({pageName, pageData, onCompleted, onError}) => {
	const { website, setWebsite } = useWebsite();

	const [addPage, { data }] = useMutation(ADD_PAGE, {
		variables: { websiteTitle: website.title, pageName, pageData},
		refetchQueries: [
			REAUTHENTICATE,
			"Reauthenticate"
		],
		onCompleted: data => {
			const newPage = data?.addPage;
			setWebsite(prevState => {
				const updatedPageList = [...prevState.pages, newPage]
				const updatedState = { ...prevState, pages: updatedPageList }

				return {...updatedState }
			})

			if (onCompleted) {
				onCompleted(data?.addPage);
			}
		},
		onError
	})

	return [ addPage, { data }];
};

// @TODO change this hook to use variables
export const useDeletePage = ({ onCompleted, onError }) => {
	const { setWebsite } = useWebsite();

	const [deletePage, { data }] = useMutation(DELETE_PAGE, {
		refetchQueries: [
			REAUTHENTICATE,
			"Reauthenticate"
		],
		onCompleted: data => {
			const deletedPageId = data?.deletePage
			
			setWebsite(prevState => {
				const updatedPageList = prevState.pages.filter(page => page.uid !== deletedPageId)	

				const updatedState = {...prevState, pages: updatedPageList}

				return {...updatedState}
			})

			if (onCompleted) {
				onCompleted(data?.deletePage);
			}
		},
		onError
	})

	return [ deletePage, { data }];
};

export const useBuildWebsite = ({ title, onCompleted }) => {
  const { ...queryResult } = useQuery(BUILD_WEBSITE, {
		variables: { title },
		onCompleted
	});

	return { ...queryResult }
}

export const useDeleteWebsite = ({ websiteId, onCompleted, onError }) => {
    const { setWebsite } = useWebsite();

	const [deleteWebsite] = useMutation(DELETE_WEBSITE, {
		variables: { websiteId },
		onCompleted: data => {
            // if website is deleted
            if (data.deleteWebsite) location.href = '/websites';
        },
		onError
	})

	return [ deleteWebsite ];
};

export const useSetWebsiteFavicon = ({ websiteId, imageUrl, onCompleted, onError }) => {
	const [setWebsiteFavicon] = useMutation(SET_WEBSITE_FAVICON, {
		variables: { websiteId, imageUrl },
		onCompleted,
		onError
	})

	return [ setWebsiteFavicon ];
};

export const useUpdateWebsiteSEO = ({ websiteId, data, onCompleted, onError }) => {
	const [updateWebsiteSEO] = useMutation(UPDATE_WEBSITE_SEO, {
		variables: { websiteId, data },
		onCompleted,
		onError
	})

	return [ updateWebsiteSEO ];
};

export const useSetWebsiteSubscription = ({ onError }) => {
	const { website, setWebsite } = useWebsite();

    const [setWebsiteSubscription] = useMutation(SET_WEBSITE_SUBSCRIPTION, {
		onCompleted: data => {
            let newWebsite = {...website};
            newWebsite.isSubscribed = true;
			setWebsite(newWebsite);
		}
	})

	return [ setWebsiteSubscription ];
};

export const useAddCustomDomain = ({ websiteId, domain, onError }) => {
    const { website, setWebsite } = useWebsite();

	const [addCustomDomain] = useMutation(ADD_CUSTOM_DOMAIN, {
        variables: { websiteId, domain },
		onCompleted: data => {
            let newWebsite = {...website};
            const newDomain = {
                domain,
                isActive: data.addCustomDomain,
                __typename: "Domain",
            }
            let newDomains = [...newWebsite.domains];
            newDomains.push(newDomain);
            newWebsite.domains = newDomains;
            setWebsite(newWebsite);
		},
		onError
	})

	return [ addCustomDomain ];
};

export const useRemoveCustomDomain = ({ websiteId, domain, onError }) => {
    const { website, setWebsite } = useWebsite();

	const [removeCustomDomain] = useMutation(REMOVE_CUSTOM_DOMAIN, {
        variables: { websiteId, domain },
		onCompleted: data => {
            let newWebsite = {...website};
            let newDomains = [...newWebsite.domains];
            const indexOfDeleted = newDomains.findIndex(x => x.domain === domain);
            newDomains.splice(indexOfDeleted, 1);
            newWebsite.domains = newDomains;

            if (website.customDomain === domain) {
                newWebsite.customDomain = '';
                newWebsite.isCustomDomainActive = false;
            }

            setWebsite(newWebsite);
		},
		onError
	})

	return [ removeCustomDomain ];
};

export const useVerifyDns = ({ domain, onError }) => {
	const [verifyDns, { ...mutationResult }] = useMutation(VERIFY_DNS, {
		onCompleted: data => {
            let newWebsite = {...website};
            let newDomains = [...newWebsite.domains];
            const indexOfVerified = newDomains.findIndex(x => x.domain === domain);
            newDomains[indexOfVerified].isActive = data.verifyDns;
            newWebsite.domains = newDomains;
            setWebsite(newWebsite);
		},
        onError
	})

	return [verifyDns, { ...mutationResult }];
};

export const useSetCustomDomain = ({ websiteId, domain, isActive, onError }) => {
	const { website, setWebsite } = useWebsite();

	const [setCustomDomain, { ...mutationResult }] = useMutation(SET_CUSTOM_DOMAIN, {
		variables: { websiteId, domain },
		onCompleted: data => {
            let newWebsite = {...website};
            newWebsite.customDomain = data.setCustomDomain;
            newWebsite.isCustomDomainActive = !newWebsite.isCustomDomainActive;
			setWebsite(newWebsite);
		},
		onError
	})

	return [setCustomDomain, { ...mutationResult }];
};

export const useAddPageToPublish = ({onError}) => {
    const { website, setWebsite } = useWebsite();

    const [addPageToPublish, { ...mutationResult }] = useMutation(ADD_PAGE_TO_PUBLISH, {
		onCompleted: data => {
            let newWebsite = {...website};
            let newPublish = [...newWebsite.published];
            newPublish.push(data.addPageToPublish);
            newWebsite.published = newPublish;
            newWebsite.isPublished = true;
			setWebsite(newWebsite);
		},
		onError
	})

    return [addPageToPublish, { ...mutationResult }];
}

export const useRemovePageFromPublish = ({onError}) => {
    const { website, setWebsite } = useWebsite();

    const [removePageFromPublish, { ...mutationResult }] = useMutation(REMOVE_PAGE_FROM_PUBLISH, {
		onCompleted: data => {
            let newWebsite = {...website};
            let newPublish = [...newWebsite.published];
            const indexOfDeleted = newPublish.findIndex(page => page.name === data.removePageFromPublish.name);
            newPublish.splice(indexOfDeleted, 1);
            newWebsite.published = newPublish;
            if (!newPublish.length) newWebsite.isPublished = false;
            setWebsite(newWebsite);
		},
		onError
	})

    return [removePageFromPublish, { ...mutationResult }];
}

export const useSetContractAddress = ({onError}) => {
    const { website, setWebsite } = useWebsite();

    const [setContractAddress, { ...mutationResult }] = useMutation(SET_CONTRACT_ADDRESS, {
		onCompleted: data => {
            let newWebsite = {...website};
            const newObj = {
                connectedContractAddress: data.setContractAddress
            }
            newWebsite.settings = newObj;
            setWebsite(newWebsite);
		},
		onError
	})

    return [setContractAddress, { ...mutationResult }];
}