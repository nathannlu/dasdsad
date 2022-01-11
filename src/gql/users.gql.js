import { gql } from '@apollo/client';


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
		}
	}
`
