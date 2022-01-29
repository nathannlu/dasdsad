import { useMutation, useQuery } from '@apollo/client';
import { SUBSCRIBE_PLAN, CHARGE, GET_PRODUCT_PRICES, CREATE_PAYMENT_INTENT, GET_USER_SUBSCRIPTIONS, STOP_USER_SUBSCRIPTION } from '../billing.gql';

export const useSubscribePlan = ({ paymentMethodId, priceId, customerId, onCompleted, onError }) => {
	const [subscribe, { ...mutationResult }] = useMutation(SUBSCRIBE_PLAN, {
		variables: { paymentMethodId, priceId, customerId },
		onCompleted,
		onError
	})

	return [subscribe, { ...mutationResult }]
};

export const useCharge = ({ paymentMethodId, amount, token, onCompleted, onError }) => {
	const [charge, { ...mutationResult }] = useMutation(CHARGE, {
		variables: { paymentMethodId, token, amount },
		onCompleted,
		onError
	})

	return [charge, { ...mutationResult }]
};

export const useGetProductPrices = ({ productId, onError }) => {
    const { ...queryResult } = useQuery(GET_PRODUCT_PRICES, {
		variables: { productId },
		onError
	});

	return { ...queryResult }
}

export const useCreatePaymentIntent = ({ price, onCompleted, onError }) => {
    const { ...queryResult } = useQuery(CREATE_PAYMENT_INTENT, {
		variables: { price },
		onCompleted,
		onError
	});

	return { ...queryResult }
}

export const useGetUserSubscriptions = ({ customerId, onCompleted, onError }) => {
    const { ...queryResult } = useQuery(GET_USER_SUBSCRIPTIONS, {
		variables: { customerId },
        onCompleted,
		onError: err => {
            console.log(err)
        }
	});

	return { ...queryResult }
}

export const useStopUserSubscription = ({ subscriptionId, onCompleted, onError }) => {
    const [stopUserSubscription, { ...mutationResult }] = useMutation(STOP_USER_SUBSCRIPTION, {
		variables: { subscriptionId },
		onCompleted,
		onError: err => {
            console.log(err)
        }
	})

	return [stopUserSubscription, { ...mutationResult }]
}