import React, { useState, useContext } from 'react';
import Web3 from 'web3/dist/web3.min';
import { useToast } from 'ds/hooks/useToast';
import { useWeb3 } from 'libs/web3';



export const ContractContext = React.createContext({})

export const useContract = () => useContext(ContractContext)

export const ContractProvider = ({ children }) => {
	const [loading, setLoading] = useState(true)
	const { addToast } = useToast()
	const { getNetworkID, setNetwork } = useWeb3()
	const [activeStep, setActiveStep] = useState(0);
	const [start, setStart] = useState(false);
	const [error, setError] = useState(false);
	const [contracts, setContracts] = useState([]);
	const [selectInput, setSelectInput] = useState('ethereum');
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [uploadedJson, setUploadedJson] = useState([]);

	const [imagesUrl, setImagesUrl] = useState('')
	const [metadataUrl, setMetadataUrl] = useState('') //unused 
	const [ipfsUrl, setIpfsUrl] = useState(''); //metadata url



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


	const	controllers = {
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

		validateNetwork,
		handleSelectNetwork,
	}




	return (
		<ContractContext.Provider
			value={controllers}
		>
			{ children }
		</ContractContext.Provider>
	)
}
