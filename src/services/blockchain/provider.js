import React, { useState, useContext } from 'react';
import Web3 from 'web3/dist/web3.min';
import { useToast } from 'ds/hooks/useToast';
import { useWeb3 } from 'libs/web3';
import { useEthereum } from 'services/blockchain/blockchains/hooks/useEthereum';
import { useSolana } from 'services/blockchain/blockchains/hooks/useSolana';

export const ContractContext = React.createContext({})

export const useContract = () => useContext(ContractContext)

export const ContractProvider = ({ children }) => {
	const { addToast } = useToast()

	const [loading, setLoading] = useState(true)
	const [activeStep, setActiveStep] = useState(0);
	const [start, setStart] = useState(false);
	const [error, setError] = useState(false);

	const [contracts, setContracts] = useState([]);
	const [contract, setContract] = useState({});

	const [selectInput, setSelectInput] = useState('ethereum');
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [uploadedJson, setUploadedJson] = useState([]);
	const [imagesUrl, setImagesUrl] = useState('')
	const [metadataUrl, setMetadataUrl] = useState('') //unused 
	const [ipfsUrl, setIpfsUrl] = useState(''); //metadata url
    const [cacheHash, setCacheHash] = useState('');
    const { account } = useWeb3();

    const { deployEthereumContract } = useEthereum();
    const { deploySolanaContract } = useSolana();

    const deployContract = async () => {
        try {
            if (!contract || !Object.keys(contract).length) throw new Error("Contract not found");

            if (contract.blockchain.indexOf('solana') === -1) {
                await deployEthereumContract({
                    uri: contract.nftCollection.baseUri,
                    name: contract.name,
                    symbol: contract.symbol,
                    totalSupply: contract.nftCollection.size,
                    cost: contract.nftCollection.price,
                    open: false,
                    id
                })
            }
            else {
				await deploySolanaContract({
                    uri: contract.nftCollection.baseUri,
                    name: contract.name,
                    address: account, 
                    symbol: contract.symbol, 
                    size: contract.nftCollection.size, 
                    price: contract.nftCollection.price, 
                    liveDate: 'now',
                    creators: [ {address: account, verified: true, share: 100} ],
                    cacheHash: contract.nftCollection.cacheHash
                });
            }
        }
        catch (err) {
            console.error(err);
            addToast({
                severity: 'error',
                message: err.message
            })
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
        deployContract,
        cacheHash,
        setCacheHash
	}

	return (
		<ContractContext.Provider
			value={controllers}
		>
			{ children }
		</ContractContext.Provider>
	)
}
