import { useState, useEffect } from 'react';
import { useGetProductPrices } from 'gql/hooks/billing.hook';

export const useGetPlanSettings = (planId) => {
	const { data, loading } = useGetProductPrices({ productId: planId })
	const productPrices = data?.getProductPrices
	const [selectedPlan, setSelectedPlan] = useState();

	useEffect(() => {
        if (!data) return;
        setSelectedPlan(data?.getProductPrices[0]);
    },[data])

	return {
		loading,
		productPrices,
		selectedPlan,
		setSelectedPlan
	}
}
