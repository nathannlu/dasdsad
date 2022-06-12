import { useEffect, useState } from 'react'

export const useGas = () => {
    const [fees, setFees] = useState();
    const [isEthUsd, setIsEthUsd] = useState();
    const [isSolUsd, setIsSolUsd] = useState();

    useEffect(() => {
        getETHPrice();
    }, [])

    const getETHPrice = async () => {
        
    }

    return {
        fees,
        setFees,
        isEthUsd,
        setIsEthUsd,
        isSolUsd,
        setIsSolUsd
    }
}