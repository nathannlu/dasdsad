import { useState, useEffect } from 'react';
import { useWebsite } from 'services/website/provider';
import { useToast } from 'ds/hooks/useToast';
import deflate from 'deflate-js';
import CryptoJS from 'crypto-js';

const useImportContract = () => {
    const { addToast } = useToast();
    const { importContractAddress, setImportABI } = useWebsite();
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
        try {
            const abiFile = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = () => {
                const ABIplain = reader.result;
                const ABIparsed = JSON.parse(ABIplain);
                if (!ABIparsed.abi) throw new Error('Invalid ABI File, cannot find ABI object key');

                const ABIarr = Array.prototype.map.call(JSON.stringify(ABIparsed.abi), (char) => {
                    return char.charCodeAt(0);
                });

                const ABIdeflated = deflate.deflate(ABIarr, 9);
                const ABIwords = CryptoJS.enc.Utf8.parse(ABIdeflated.toString());
                const ABIbase64 = CryptoJS.enc.Base64.stringify(ABIwords);

                setImportABI(ABIbase64);

                addToast({
                    severity: 'success',
                    message: 'ABI successfully uploaded',
                })
            }
            reader.readAsText(abiFile);
        }
        catch(err) {
            addToast({
                severity: 'error',
                message: err.message,
            })
        }
    }

    return {
        stepCount,
        setStepCount,
        validate,
        handleABIupload
    };
};

export default useImportContract;
