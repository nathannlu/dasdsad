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
export const SET_CUSTOM_DOMAIN = gql`
	mutation SetCustomDomain($title: String!, $customDomain: String!) {
		setCustomDomain(title: $title, customDomain: $customDomain) {
			customDomain	
			isCustomDomainActive
		}
	}
`

export const VERIFY_DNS = gql`
	mutation VerifyDns($title: String!) {
		verifyDns(title: $title)
	}
`

export const DELETE_PAGE = gql`
	mutation DeletePage($websiteTitle: String!, $uid: ID!) {
		deletePage(websiteTitle: $websiteTitle, uid: $uid)
	}
`

export const SET_CONTRACT_ADDRESS = gql`
	mutation SetContractAddress($title: String!, $contractAddress: String!, $priceInEth: String!) {
		setContractAddress(title: $title, contractAddress: $contractAddress, priceInEth: $priceInEth) {
			contractAddress
			priceInEth
		}
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