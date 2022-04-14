import { useState, useEffect } from 'react';
import { useWebsite } from 'services/website/provider';
import { useToast } from 'ds/hooks/useToast';
import CryptoJS from 'crypto-js'

const useImportContract = () => {
    const { addToast } = useToast();
    const { importContractAddress } = useWebsite();
    const [stepCount, setStepCount] = useState(0);

    const validate = () => {
        try {
            if (!importContractAddress.length) throw new Error('Please enter the contract address you want to import');
            if (importContractAddress.at(1) !== 'x') throw new Error('Please enter a valid contract address');

            setStepCount(1);
        }
        catch (err) {
            addToast({
                severity: 'error',
                message: err.message,
            })
        }
    }

    const handleABIupload = (acceptedFiles) => {
        const abiFile = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = () => {
            const ABIplain = reader.result;
            const ABIencrypted = CryptoJS.AES.encrypt(ABIplain, 'booty');
            console.log(ABIencrypted.toString())
        }
        reader.readAsText(abiFile);
    }

    return {
        stepCount,
        setStepCount,
        validate,
        handleABIupload
    };
};

export default useImportContract;
