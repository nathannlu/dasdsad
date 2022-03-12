import { gql } from '@apollo/client';


// Email login
export const REGISTER = gql`
	mutation Register($name: String!, $email: String!, $password: String!) {
		register(name: $name, email: $email, password: $password) {
			id
			name
			email
		}
	}
`

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			user {
				id
				address
				name
				email
				stripeCustomerId
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
				id
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
			id
			address
			name
			email
			password
			stripeCustomerId
		}
	}
`
