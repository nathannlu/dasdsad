import React, { useState, useContext } from 'react';
import Web3 from 'web3/dist/web3.min';
import axios from 'axios'
import config from 'config'
import basePathConverter from 'base-path-converter';
import { useToast } from 'ds/hooks/useToast';
import { useForm } from 'ds/hooks/useForm';
import { useWeb3 } from 'libs/web3';
import { useAuth } from 'libs/auth';
import { useCreateContract } from 'gql/hooks/contract.hook';
import NFTCollectible from 'ethereum/abis/NFTCollectible.json';

export const DeployContext = React.createContext({})

export const useDeploy = () => useContext(DeployContext)

export const DeployProvider = ({ children }) => {
	const [loading, setLoading] = useState(false)
	const { addToast } = useToast()
	const { account, getNetworkID, setNetwork } = useWeb3()
	const { user } = useAuth();
	const [activeStep, setActiveStep] = useState(0);
	const [start, setStart] = useState(false);
	const [error, setError] = useState(false);
	const [contracts, setContracts] = useState([]);
	const [selectInput, setSelectInput] = useState('ethereum');
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [uploadedJson, setUploadedJson] = useState([]);
	// IPFS urls 
	const [imagesUrl, setImagesUrl] = useState('')
	const [metadataUrl, setMetadataUrl] = useState('') //unused 
	const [ipfsUrl, setIpfsUrl] = useState(''); //metadata url
	const { form: deployContractForm } = useForm({
		priceInEth: {
			default: '',
			placeholder: '0.05'
		},
		royaltyPercentage: {
			default: '',
			placeholder: 5
		},
		maxSupply: {
			default: '',
			placeholder: '3333'
		},
		ipfsLink: {
			default: '',
		}
	});
	const [createContract] = useCreateContract({});

	const deployContract = async () => {
		try {
			const web3 = window.web3
			let contract = new web3.eth.Contract(NFTCollectible.abi)
			const priceInWei = web3.utils.toWei(deployContractForm.priceInEth.value);

			console.log(contract.defaultChain)

			let options;
			if(deployContractForm.ipfsLink.value.length < 1) {
				options = {
					data: NFTCollectible.bytecode,
					arguments: [ipfsUrl, priceInWei, deployContractForm.maxSupply.value]
				}
			}

			if(deployContractForm.ipfsLink.value.length > 0) {
				addToast({
					severity: 'info',
					message: "Deploying with IPFS link: " + deployContractForm.ipfsLink.value
				});
				options = {
					data: NFTCollectible.bytecode,
					arguments: [deployContractForm.ipfsLink.value, priceInWei, deployContractForm.maxSupply.value]
				}
			}

			const senderInfo = {
				from: account
			}

			contract.deploy(options)
            .send(senderInfo, (err, txnHash) => {
                if(err) {
                    addToast({
                        severity: 'error',
                        message: err.message
                    });
                    setError(error)
                } else {
                    addToast({
                        severity: 'info',
                        message: "Deploying contract... should take a couple of seconds"
                    });
                }
            })
            .on('error', err => {
                addToast({
                    severity: 'error',
                    message: err.message
                });
                setLoading(false)
                setError(true)
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                console.log('deployed')
                addToast({
                    severity: 'success',
                    message:'Contract deployed under:' + receipt.contractAddress
                })
                onDeploySuccess(receipt.contractAddress);
                
                posthog.capture('User deployed smart contract');
                setLoading(false)
            })
		} 
        catch (e) {
			addToast({
				severity: 'error',
				message: e.message
			});
			setError(true);
		}
	};

	const onDeploySuccess = async (contractAddress) => {
		const ContractInput = {
			address: contractAddress,
			blockchain: selectInput,
			nftCollection: {
				price: parseFloat(deployContractForm.priceInEth.value),
				currency: 'eth',
				size: parseInt(deployContractForm.maxSupply.value),
				royalty: parseInt(deployContractForm.royaltyPercentage.value),
				baseUri: ipfsUrl
			}
		}
		await createContract({ variables: { contract: ContractInput} });
		setStart(false);
	}

    // Check before network pinning image
    const validateNetwork = async () => {
        try {
            if (!window.ethereum) throw new Error("Please install Metamask Wallet");

            if (selectInput === "ethereum") {        
                const id = await getNetworkID(); // Check current network
                if (id !== 1) { // Ethereum
                    await setNetwork(1); // Switch to ethereum
                }
            }
            else if (selectInput === "rinkeby") {        
                const id = await getNetworkID(); // Check current network
                if (id !== 4) { // Rinkeby
                    await setNetwork(4); // Switch to rinkeby
                }
            }     

            await pinImages();
        }
        catch (e) {
            addToast({
				severity: 'error',
				message: e.message
			});
			setError(true);
        }
    }

	const pinImages = async () => {
		const folder = uploadedFiles
		setStart(true);
		setActiveStep(0);
		const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        const src = `./images`;

		addToast({
			severity: 'info',
			message: "Deploying images to IPFS... this may take a long time depending on your collection size"
		});

        let data = new FormData();
		for (let i = 0; i < folder.length; i++) {
			data.append('file', folder[i], `/assets/${folder[i].name}`)
		}

        //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
        //metadata is optional
        const metadata = JSON.stringify({
            name: user.id + '_assets',
        });

		data.append('pinataMetadata', metadata);

		const opt = {
			maxBodyLength: 'Infinity',
			headers: {
				'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
				'pinata_api_key': config.pinata.key,
				'pinata_secret_api_key': config.pinata.secret
			}
		}

		try {
			const res = await axios.post(url,data,opt)
			setImagesUrl(res.data.IpfsHash)
			addToast({
				severity: 'success',
				message: 'Added images to IPFS under URL: ipfs//' + res.data.IpfsHash
			})
		} 
        catch(e) {
			addToast({
				severity: 'error',
				message: e.message
			});
			setError(true);
		}
	};

	const updateAndSaveJson = async (file, data) => {
		return new Promise((resolve, reject) => {

			if(file.name !=='metadata.json') {
				const fileReader = new FileReader();
				fileReader.onload = function ( evt ) {
					// Parse JSON and modify
					const jsonMetadata = JSON.parse(evt.target.result)
					const tokenId = file.name.split('.')[0]
					jsonMetadata.image = `ipfs://${imagesUrl}/${tokenId}.png`

					// Attach JSON to formdata
					const metadataFile = new Blob([JSON.stringify(jsonMetadata)])
					data.append('file', metadataFile, `/metadata/${tokenId}`)

					resolve(data)
				};
				fileReader.readAsText(file);

			} else {
				data.append('file', file, '/metadata/metadata')
				resolve(data)
			}
		})
	}

	const pinMetadata = async () => {
		const folder = uploadedJson;
        let data = new FormData();
		const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

		addToast({
			severity: 'info',
			message: "Deploying metadata to IPFS... this may take a long time depending on your collection size"
		});

		// Update metadata
		for (let i = 0; i < folder.length; i++) {
			await updateAndSaveJson(folder[i], data)
		}

        const metadata = JSON.stringify({
            name: user.id + '_metadata',
        });

		data.append('pinataMetadata', metadata);

		const opt = {
			maxBodyLength: 'Infinity',
			headers: {
				'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
				'pinata_api_key': config.pinata.key,
				'pinata_secret_api_key': config.pinata.secret
			}
		}

		try {
			const res = await axios.post(url, data, opt)
			addToast({
				severity: 'success',
				message: 'Added json metadata to IPFS under URL: ipfs://' + res.data.IpfsHash
			})
			setIpfsUrl('ipfs://' + res.data.IpfsHash + '/')
			setMetadataUrl(res.data.IpfsHash)
		} 
        catch(e) {
			addToast({
				severity: 'error',
				message: e.message 
			});
        };
	}

	return (
		<DeployContext.Provider
			value={{
				uploadedFiles,
				setUploadedFiles,
				uploadedJson,
				setUploadedJson,
				imagesUrl,
				setImagesUrl,
				deployContractForm,

				ipfsUrl,
				setIpfsUrl,
				metadataUrl,

                validateNetwork,
				pinImages,
				pinMetadata,
				deployContract,
				contracts,
				setContracts,

				selectInput,
				setSelectInput,

				activeStep,
				setActiveStep,
				start,
				error
			}}
		>
			{children}
		</DeployContext.Provider>
	)
}
