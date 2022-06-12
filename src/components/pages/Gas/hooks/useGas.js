import { useEffect, useState } from 'react'

export const useGas = () => {
    const [fees, setFees] = useState();
    const [eth, setEth] = useState();
    const [sol, setSol] = useState();

    useEffect(() => {
        getETHPrice();
    }, [])

    const getETHPrice = async () => {
        
    }

    return {
        fees,
        setFees
    }
}