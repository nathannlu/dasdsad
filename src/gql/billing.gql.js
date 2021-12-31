import { gql } from "@apollo/client";

export const SUBSCRIBE_PLAN = gql`
	mutation SubscribePlan($paymentMethodId: String!,$customerId: String!, $priceId: String!,) {
		subscribe(paymentMethodId: $paymentMethodId, customerId: $customerId, priceId: $priceId)
	}
`

export const CHARGE = gql`
	mutation Charge($amount: Int!, $token: String!) {
		charge(amount: $amount, token: $token)
	}
`

export const GET_PRODUCT_PRICES = gql`
	query GetProductPrices($productId: String!) {
		getProductPrices(productId: $productId) {
			id
			unit_amount
			frequency
		}
	}
`

export const CREATE_PAYMENT_INTENT = gql`
	query CreatePaymentIntent($price: Int!) {
		createPaymentIntent(price: $price)
	}
`
