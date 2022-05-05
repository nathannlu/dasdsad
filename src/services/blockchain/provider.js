import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3/dist/web3.min';
import { useToast } from 'ds/hooks/useToast';
import { useWeb3 } from 'libs/web3';
import bs58 from 'bs58';

export const ContractContext = React.createContext({});

export const useContract = () => useContext(ContractContext);

export const ContractProvider = ({ children }) => {
    const { addToast } = useToast();
    const { getNetworkID, setNetwork } = useWeb3();

    const [loading, setLoading] = useState(true);
    const [activeStep, setActiveStep] = useState(0);
    const [start, setStart] = useState(false);
    const [error, setError] = useState(false);

    const [contracts, setContracts] = useState([]);
    const [contract, setContract] = useState({});

    const [selectInput, setSelectInput] = useState('ethereum');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadedJson, setUploadedJson] = useState([]);
    const [imagesUrl, setImagesUrl] = useState(null);
    const [metadataUrl, setMetadataUrl] = useState(null); //unused
    const [ipfsUrl, setIpfsUrl] = useState(null); //metadata url
    const [cacheHash, setCacheHash] = useState('');
    const { account, loadBlockchainData, loadWeb3 } = useWeb3();

    // monkey patch
    Object.prototype.toBuffer = function (fn) {
        const isBase58 = (value) => /^[A-HJ-NP-Za-km-z1-9]*$/.test(this);
        if (typeof this == 'string' && isBase58) {
            console.log(this);

            const decoded = bs58.decode(this);
            console.log(decoded);

            return decoded;
        }
    };

    /*

    const handleSelectNetwork = async (value) => {
            console.log(value)
        try {
            if (!window.ethereum) throw new Error("Please install Metamask Wallet");
            const id = getNetworkID();
            let res = true;
            if (value === "ethereum") {
                if (id !== "0x1") res = await setNetwork("0x1");
            }
            else if (value === "polygon") {
                if (id !== "0x89") res = await setNetwork("0x89");
            }
            else if (value === "rinkeby") {
                if (id !== "0x4") res = await setNetwork("0x4");
            }
            else if (value === "mumbai") {
                if (id !== "0x13881") res = await setNetwork("0x13881");
            }
            if (res === "prompt_cancled") throw new Error("Please switch to the desired network")
            setSelectInput(value);
        }
        catch (e) {
            addToast({
                severity: 'error',
                message: e.message
            });
            setError(true);
        }
    }

<<<<<<< HEAD
    // Check before network pinning image
    const validateNetwork = async () => {
        try {
            if (!window.ethereum) throw new Error("Please install Metamask Wallet");
            const id = await getNetworkID(); // Check current network
            let res = true;
            if (selectInput === "ethereum") {
                if (id !== "0x1") res = await setNetwork("0x1");
            }
            else if (selectInput === "polygon") {
                if (id !== "0x89") res = await setNetwork("0x89");
            }
            else if (selectInput === "rinkeby") {
                if (id !== "0x4") res = await setNetwork("0x4");
            }
            else if (selectInput === "mumbai") {
                if (id !== "0x13881") res = await setNetwork("0x13881");
            }
            if (!res) return false;
            return true;
        }
        catch (e) {
            addToast({
                severity: 'error',
                message: e.message
            });
            setError(true);
            return false;
        }
    }
*/

    useEffect(() => {
        (async () => {
            await loadWeb3();
            await loadBlockchainData();
        })();
    }, []);

    const onDeleteContract = async (curContract, deleteContract, handleClose) => {
        try {
            if (curContract.isSubscribed) throw new Error('You must cancel your subscription before you can delete this contract');

            deleteContract({
                variables: {
                    id: curContract.id,
                },
            });
            handleClose();
        }
        catch (err) {
            addToast({
                severity: 'error',
                message: err.message,
            });
        }
    }

    const controllers = {
        imagesUrl,
        setImagesUrl,
        metadataUrl,
        setMetadataUrl,
        ipfsUrl,
        setIpfsUrl,
        uploadedFiles,
        setUploadedFiles,
        uploadedJson,
        setUploadedJson,

        contracts,
        setContracts,
        contract,
        setContract,

        loading,
        setLoading,
        activeStep,
        setActiveStep,
        start,
        setStart,
        error,
        setError,
        selectInput,
        setSelectInput,
        onDeleteContract

        //		validateNetwork,
        //		handleSelectNetwork,
    };

    return (
        <ContractContext.Provider value={controllers}>
            {children}
        </ContractContext.Provider>
    );
};
