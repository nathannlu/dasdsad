import { useAuth } from 'libs/auth';
import { useWebsite } from 'libs/website';
import { useQuery, useMutation } from '@apollo/client';
import { BUILD_WEBSITE, GET_WEBSITES, CREATE_WEBSITE, ADD_PAGE, DELETE_PAGE, UPDATE_PAGE_DATA, SET_CUSTOM_DOMAIN, VERIFY_DNS, SET_CONTRACT_ADDRESS, GET_PUBLISHED } from '../website.gql';
import { REAUTHENTICATE } from 'gql/users.gql';


export const useGetWebsites = () => {
	const { setWebsite } = useWebsite();

  const { ...queryResult } = useQuery(GET_WEBSITES, {
		onCompleted: data => {
			setWebsite(data?.getWebsites[0])
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
			
			if (onCompleted) {
				onCompleted(data);
			}
		},
		onError,
	})

	return [ createWebsite, { data} ];
};

// @TODO change this hook to use variables
export const useUpdatePageData = ({ onCompleted, onError }) => {
	const { setWebsite } = useWebsite();

	const [updatePageData, { data }] = useMutation(UPDATE_PAGE_DATA, {
		refetchQueries: [
			GET_WEBSITES,
			"GetWebsites"
		],
		onQueryUpdated: (observable, diff) => {
			const websites = diff.result.getWebsites;
			console.log(websites)
			setWebsite(websites[0]);
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
export const useSetCustomDomain = ({title, customDomain, onCompleted, onError}) => {
	const { setWebsite } = useWebsite();

	const [setCustomDomain, { ...mutationResult }] = useMutation(SET_CUSTOM_DOMAIN, {
		variables: { title, customDomain },
		onCompleted: data => {
			const customDomain = data.setCustomDomain.customDomain;
		
			setWebsite(prevState => {
				const updatedDomain = { ...prevState }
				updatedDomain.customDomain = customDomain;
				updatedDomain.isCustomDomainActive = false;
			
				return {...updatedDomain}
			})

			if (onCompleted) {
				onCompleted(data?.setCustomDomain);
			}
		},
		onError
	})

	return [setCustomDomain, { ...mutationResult }];
};
export const useVerifyDns = ({title, onCompleted}) => {
	const [verifyDns, { ...mutationResult }] = useMutation(VERIFY_DNS, {
		variables: { title },
		onCompleted
	})

	return [verifyDns, { ...mutationResult }];
};
export const useSetContractAddress = ({ onCompleted, onError }) => {
	const { setWebsite } = useWebsite();

	const [setContractAddress, { ...mutationResult }] = useMutation(SET_CONTRACT_ADDRESS, {
		onCompleted: data => {
			const contractAddress = data.setContractAddress.contractAddress;
			const priceInEth = data.setContractAddress.priceInEth;
		
			setWebsite(prevState => {
				const updatedWebsite = { ...prevState }
				updatedWebsite.contractAddress = contractAddress;
				updatedWebsite.priceInEth = priceInEth;
			
				return {...updatedWebsite}
			})

			if (onCompleted) {
				onCompleted(data?.setContractAddress);
			}
		},
		onError
	})

	return [setContractAddress, { ...mutationResult }];
};
export const useBuildWebsite = ({ title, onCompleted }) => {
  const { ...queryResult } = useQuery(BUILD_WEBSITE, {
		variables: { title },
		onCompleted
	});

	return { ...queryResult }
}

