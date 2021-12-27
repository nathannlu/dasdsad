import { useMutation, useQuery } from '@apollo/client';
import { SUBSCRIBE_PLAN, CHARGE, GET_PRODUCT_PRICES, CREATE_PAYMENT_INTENT } from '../billing.gql';

export const useSubscribePlan = ({ paymentMethodId, priceId, customerId, onCompleted, onError }) => {
	const [subscribe, { ...mutationResult }] = useMutation(SUBSCRIBE_PLAN, {
		variables: { paymentMethodId, priceId, customerId },
		onCompleted,
		onError
	})

	return [subscribe, { ...mutationResult }]
};

export const useCharge = ({ paymentMethodId, amount, token, onCompleted, onError }) => {
	console.log(paymentMethodId, amount, token)
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
