import React, { useState, useEffect, useContext } from 'react';
import { useToast } from 'ds/hooks/useToast';
import { useWeb3 } from 'libs/web3';
import bs58 from 'bs58';

export const ContractContext = React.createContext({});

export const useContract = () => useContext(ContractContext);

export const ContractProvider = ({ children }) => {
    const { addToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [fetchContractLoading, setFetchContractLoading] = useState(true);
    const [activeStep, setActiveStep] = useState(0);
    const [start, setStart] = useState(false);
    const [error, setError] = useState(false);

    const [contracts, setContracts] = useState([]);
    const [contract, setContract] = useState({});

    const [selectInput, setSelectInput] = useState('solana');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadedUnRevealedImageFile, setUploadedUnRevealedImageFile] = useState(null);
    const [uploadedJson, setUploadedJson] = useState([]);
    const [metadataUrl, setMetadataUrl] = useState(null); //unused
    const [ipfsUrl, setIpfsUrl] = useState(null); // deprecated metadata url

    const [unRevealedBaseUri, setUnRevealedBaseUri] = useState(null);
    const [imagesUrl, setImagesUrl] = useState(null); // url of nft images folder
	const [baseUri, setBaseUri] = useState(null); // new metadata url (use this one)



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
        uploadedUnRevealedImageFile,
        setUploadedUnRevealedImageFile,
        unRevealedBaseUri,
        setUnRevealedBaseUri,
			baseUri,
			setBaseUri,
        uploadedJson,
        setUploadedJson,

        contracts,
        setContracts,
        contract,
        setContract,

        loading,
        setLoading,
			fetchContractLoading,
									setFetchContractLoading,
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
