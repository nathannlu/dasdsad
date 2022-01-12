import { gql } from "@apollo/client";

export const CREATE_WEBSITE = gql`
	mutation CreateWebsite($author: ID!, $title: String!) {
		createWebsite(author: $author, title: $title) {
			title
			isPublished
			pages {
				pageName
				pageData
			}
			customDomain
			isCustomDomainActive
			author
		}	
	}
`

// Depreciated
// App now uses REAUTHENTICATE from users.gql to populate website state
export const GET_WEBSITE = gql`
	query GetWebsite($title: String!) {
		getWebsite(title: $title) {
			author
			title
			customDomain
			isCustomDomainActive
			contractAddress
			priceInEth
			pages {
				pageName
				pageData
			}
		}
	}
`

export const BUILD_WEBSITE = gql`
	query BuildWebsite($title: String!) {
		buildWebsite(title: $title)
	}
`

export const ADD_PAGE = gql`
	mutation AddPage($websiteTitle: String!, $pageName: String!, $pageData: String) {
		addPage(websiteTitle: $websiteTitle, pageName: $pageName, pageData: $pageData) {
			uid
			pageName
			pageData
		}
	}
`

export const UPDATE_PAGE_DATA = gql`
	mutation UpdatePageData($uid: ID!, $pageData: String!) {
		updatePageData(uid: $uid, pageData: $pageData) {
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
