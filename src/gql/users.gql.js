import { gql } from '@apollo/client';


// Email login
export const REGISTER = gql`
	mutation Register($name: String!, $email: String!, $password: String!) {
		register(name: $name, email: $email, password: $password) {
			uid
			name
			email
		}
	}
`

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			user {
				uid
				name
				email
				stripeCustomerId
				websites {
					title
					isPublished
					isCustomDomainActive
					customDomain
					contractAddress
					priceInEth
					author
					pages {
						pageName
						pageData
					}
				}
			}
			token
		}
	}
`

// Metamask login
export const GET_NONCE = gql`
	mutation GetNonceByAddress($address: String!) {
		getNonceByAddress(address: $address)
	}
`

export const VERIFY_SIGNATURE = gql`
	mutation VerifySignature($address: String!, $signature: String!){
		verifySignature(address: $address, signature: $signature) {
			token
			user {
				uid
				address
				name
				email
				stripeCustomerId
			}
		}
	}
`

// Verifies jwt token
export const REAUTHENTICATE = gql`
	query Reauthenticate {
		getCurrentUser {
			uid
			address
			name
			email
			password
			stripeCustomerId
			websites {
				author
				title
				isPublished
				isCustomDomainActive
				customDomain
				contractAddress
				priceInEth
				pages {
					uid
					pageName
					pageData
				}
			}
			collections {
				uid
				name
				description
				collectionSize
				layers {
					name
					weight
					images {
						name
						weight
						url
					}
				}
			}
		}
	}
`
