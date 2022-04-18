import { gql } from '@apollo/client';

export const SUBSCRIBE_PLAN = gql`
    mutation SubscribePlan(
        $paymentMethodId: String!
        $customerId: String!
        $priceId: String!
        $objectId: ID
        $type: String
    ) {
        subscribe(
            paymentMethodId: $paymentMethodId
            customerId: $customerId
            priceId: $priceId
            objectId: $objectId
            type: $type
        )
    }
`;

export const CHARGE = gql`
    mutation Charge($amount: Int!, $token: String!, $referral: String) {
        charge(amount: $amount, token: $token, referral: $referral)
    }
`;

export const GET_PRODUCT_PRICES = gql`
    query GetProductPrices($productId: String!) {
        getProductPrices(productId: $productId) {
            id
            unit_amount
            frequency
        }
    }
`;

export const CREATE_PAYMENT_INTENT = gql`
    query CreatePaymentIntent($price: Int!) {
        createPaymentIntent(price: $price)
    }
`;

export const GET_USER_SUBSCRIPTIONS = gql`
    query GetUserSubscriptions($customerId: String!) {
        getUserSubscriptions(customerId: $customerId) {
            id
            status
            productId
            productType
            price
            startDate
            endDate
            isCanceled
            canceledDate
        }
    }
`;

export const STOP_USER_SUBSCRIPTION = gql`
    mutation StopUserSubscription($subscriptionId: String!) {
        stopUserSubscription(subscriptionId: $subscriptionId)
    }
`;
