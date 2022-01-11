import { useState, useEffect } from 'react';
import { useGetProductPrices } from 'gql/hooks/billing.hook';

export const useGetPlanSettings = (planId) => {
	const { data, loading } = useGetProductPrices({ productId: planId})

	const productPrices = data?.getProductPrices

	const [selectedPlan, setSelectedPlan] = useState();
	useEffect(() => setSelectedPlan(data?.getProductPrices[0]),[loading])

	return {
		loading,
		productPrices,
		selectedPlan,
		setSelectedPlan
	}
}
