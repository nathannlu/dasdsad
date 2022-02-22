import { gql } from "@apollo/client";

export const CREATE_WEBSITE = gql`
    mutation CreateWebsite($title: String!, $contractAddress: String) {
        createWebsite(title: $title, contractAddress: $contractAddress) {
            author
            title
            isPublished
            isSubscribed
            pages {
                name
                data
            }
            customDomain
            isCustomDomainActive
            domains {
                domain
                isActive	
            }
            settings {
                connectedContractAddress
            }
            favicon
            seo {
                title
                previewTitle
                description
                keywords
                language
                robots
                url
                image
            }
            published {
                name
                data
            }
        }
    }
`

export const GET_WEBSITES = gql`
    query GetWebsites {
        getWebsites {
            _id
            author
            title
            isPublished
            isSubscribed
            pages {
                name
                data
            }
            customDomain
            isCustomDomainActive
            domains {
                domain
                isActive	
            }
            settings {
                connectedContractAddress
            }
            favicon
            seo {
                title
                previewTitle
                description
                keywords
                language
                robots
                url
                image
            }
            published {
                name
                data
            }
        }
    }
`
export const GET_PUBLISHED = gql`
    query GetPublished($title: String!) {
        getPublished(title: $title) {
            author
            title
            isPublished
            isSubscribed
            pages {
                name
                data
            }
            customDomain
            isCustomDomainActive
            domains {
                domain
                isActive	
            }
            settings {
                connectedContractAddress
            }
            favicon
            seo {
                title
                previewTitle
                description
                keywords
                language
                robots
                url
                image
            }
            published {
                name
                data
            }
        }
    }
`

export const UPDATE_PAGE_DATA = gql`
	mutation UpdatePageData($websiteId: ID!, $pageName: String!, $pageData: String!) {
		updatePageData(websiteId: $websiteId, pageName: $pageName, pageData: $pageData) {
			pages {
				name
				data
			}
		}
	}
`

// WIP
export const ADD_PAGE = gql`
	mutation AddPage($websiteTitle: String!, $pageName: String!, $pageData: String) {
		addPage(websiteTitle: $websiteTitle, pageName: $pageName, pageData: $pageData) {
			uid
			pageName
			pageData
		}
	}
`

export const VERIFY_DNS = gql`
	mutation VerifyDns($websiteId: String!, $domain: String!) {
		verifyDns(websiteId: $websiteId, domain: $domain)
	}
`

export const DELETE_PAGE = gql`
	mutation DeletePage($websiteTitle: String!, $uid: ID!) {
		deletePage(websiteTitle: $websiteTitle, uid: $uid)
	}
`

export const BUILD_WEBSITE = gql`
	query BuildWebsite($title: String!) {
		buildWebsite(title: $title)
	}
`

export const DELETE_WEBSITE = gql`
	mutation DeleteWebsite($websiteId: String!) {
		deleteWebsite(websiteId: $websiteId)
	}
`

export const SET_WEBSITE_FAVICON = gql`
	mutation SetWebsiteFavicon($websiteId: String!, $imageUrl: String!) {
		setWebsiteFavicon(websiteId: $websiteId, imageUrl: $imageUrl)
	}
`

export const UPDATE_WEBSITE_SEO = gql`
	mutation UpdateWebsiteSEO($websiteId: String!, $data: SeoInput!) {
		updateWebsiteSEO(websiteId: $websiteId, data: $data)
	}
`

export const SET_WEBSITE_SUBSCRIPTION = gql`
    mutation SetWebsiteSubscription($isSubscribed: Boolean!) {
        setWebsiteSubscription(isSubscribed: $isSubscribed) {
            isSubscribed
        }
    }
`

export const ADD_CUSTOM_DOMAIN = gql`
	mutation AddCustomDomain($websiteId: String!, $domain: String!) {
		addCustomDomain(websiteId: $websiteId, domain: $domain)
	}
`

export const REMOVE_CUSTOM_DOMAIN = gql`
	mutation RemoveCustomDomain($websiteId: String!, $domain: String!) {
		removeCustomDomain(websiteId: $websiteId, domain: $domain)
	}
`

export const SET_CUSTOM_DOMAIN = gql`
	mutation SetCustomDomain($websiteId: String!, $domain: String!, $isActive: Boolean!) {
		setCustomDomain(websiteId: $websiteId, domain: $domain, isActive: $isActive)
	}
`

export const ADD_PAGE_TO_PUBLISH = gql`
	mutation AddPageToPublish($websiteId: String!, $pageIdx: Int!) {
		addPageToPublish(websiteId: $websiteId, pageIdx: $pageIdx) {
            name
            data
        }
	}
`

export const REMOVE_PAGE_FROM_PUBLISH = gql`
	mutation RemovePageFromPublish($websiteId: String!, $pageIdx: Int!) {
		removePageFromPublish(websiteId: $websiteId, pageIdx: $pageIdx) {
            name
            data
        }
	}
`

export const SET_CONTRACT_ADDRESS = gql`
	mutation SetContractAddress($websiteId: String!, $address: String!) {
		setContractAddress(websiteId: $websiteId, address: $address)
	}
`