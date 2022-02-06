import React, { useState, useContext } from 'react';
import Web3 from 'web3/dist/web3.min';
import { useToast } from 'ds/hooks/useToast';
//import { useWebsite } from 'libs/website';
//import NFTCollectible from 'services/blockchain/blockchains/ethereum/abis/NFTCollectible.json';
import NFTCollectible from 'services/blockchain/blockchains/ethereum/abis/ambitionNFT.json';

export const Web3Context = React.createContext({})

export const useWeb3 = () => useContext(Web3Context)

export const Web3Provider = ({ children }) => {
	const [account, setAccount] = useState(null); // eth address
	const { addToast } = useToast();

	// Checks if browser has Ethereum extension installed
	// If yes then set up Web3
	// If no then alert user
	const loadWeb3 = async () => {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum)
			window.ethereum.on("accountsChanged", accounts => setAccount(accounts[0]))
			await window.ethereum.enable()
		}
		else if (window.web3) { 
			window.web3 = new Web3(window.web3.currentProvider)
		}
		else {
			addToast({
				severity: 'warning',
				message: 'Non-Ethereum browser detected. You should consider trying MetaMask!'
			})
		}
	};
	
	// Load account and load smart contracts
	const loadBlockchainData = async (_contract) => {

		if (window.ethereum) {
			//const Contract = _contract
			const web3 = window.web3

			// Load account
			const accounts = await web3.eth.getAccounts()
			setAccount(accounts[0])
		}
	};

	const signNonce = async ({address, nonce}) => {
		const web3 = window.web3

		const signature = await web3.eth.personal.sign(
			web3.utils.fromUtf8(`I am signing my one-time nonce: ${nonce}`),
			address,
		)

		return ({address, signature})
	}

	// Mint NFT
	const mint = async (price, contractAddress) => {
		const contract = await retrieveContract(contractAddress)
		const priceInWei = Web3.utils.toWei(price);

		contract.methods.mintNFTs(1).send({ from: account, value: priceInWei }, err => {
			if (err) {
				addToast({
					severity: 'error',
					message: err.message
				})
			} else {
				addToast({
					severity: 'info',
					message: 'Sending transaction to Ethereum. This might take a couple of seconds...'
				})
			}
		})
		.on('error', err => {
			addToast({
				severity: 'error',
				message: err.message
			})
		})
		.on("confirmation", () => {
			addToast({
				severity: 'success',
				message: 'Purchase complete.'
			})
		})
	}

	const openContract = async (contractAddress) => {
		const contract = await retrieveContract(contractAddress)

		contract.methods.setOpen(true).send({ from: account, value: 0 }, err => {
			if (err) {
				addToast({
					severity: 'error',
					message: err.message
				})
			} else {
				addToast({
					severity: 'info',
					message: 'Sending transaction to Ethereum. This might take a couple of seconds...'
				})
			}
		})
		.on('error', err => {
			addToast({
				severity: 'error',
				message: err.message
			})
		})
		.on("confirmation", () => {
			addToast({
				severity: 'success',
				message: 'Sales are now open.'
			})
		})
	}

	const checkOwner = async (id, contractAddress) => {
		const contract = await retrieveContract(contractAddress)
		const owner = await contract.methods.ownerOf(id).call();
		return owner
	}


	// Update base URI
	const updateBaseUri = async (baseUri, contractAddress) => {
		const contract = await retrieveContract(contractAddress)
		console.log(baseUri);

		contract.methods.setBaseURI(baseUri).send({ from: account, value: 0 }, err => {
			if (err) {
				addToast({
					severity: 'error',
					message: err.message
				})
			} else {
				addToast({
					severity: 'info',
					message: 'Sending transaction to Ethereum. This might take a couple of seconds...'
				})
			}
		})
		.on('error', err => {
			addToast({
				severity: 'error',
				message: err.message
			})
		})
		.on("confirmation", () => {
			addToast({
				severity: 'success',
				message: 'Successfully updated baseUri.'
			})
		})
	}

	const withdraw = async (contractAddress) => {
		const contract = await retrieveContract(contractAddress)
		contract.methods.withdraw().send({ from: account, value: 0 }, err => {
			if (err) {
				addToast({
					severity: 'error',
					message: err.message
				})
			} else {
				addToast({
					severity: 'info',
					message: 'Sending transaction to Ethereum. This might take a couple of seconds...'
				})
			}

		})
		.on('error', err => {
			addToast({
				severity: 'error',
				message: err.message
			})
		})
		.on("confirmation", () => {
			addToast({
				severity: 'success',
				message: 'Funds are deposited to your account'
			})
		})
	}

	const getBalance = async (contractAddress) => {
		const web3 = window.web3

		if (contractAddress) {
			const balance = await web3.eth.getBalance(contractAddress)
			const balanceInEth = web3.utils.fromWei(balance)

			return balanceInEth
		}
	}

	const retrieveContract = async (contractAddress) => {
		const web3 = window.web3;

		if (true) {
			const contract = new web3.eth.Contract(NFTCollectible.abi, contractAddress);

			return contract;
		}
	}

	const getBaseTokenURI = async (contractAddress) => {
		const web3 = window.web3
		const contract = await retrieveContract(contractAddress)

		return contract.methods.baseTokenURI().call()
	}

    // Get current network
    const getNetworkID = () => {
        return `0x${parseInt(window.ethereum.networkVersion).toString(16)}`;
    }

    // Set current network
    const setNetwork = async (networkID) => {
        return window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: networkID }],
        })
        .then(() => {
            return 'prompt_successful';
        })
        .catch(async err => {
            if (err.code === 4001) { // User cancled prompt
                return 'prompt_cancled';
            }
            else if (err.code === 4902) { // Unrecognized chain ID
                let networkData = {
                    chainId: "",
                    chainName: "",
                    nativeCurrency: {
                        name: "",
                        symbol: "",
                        decimals: -1
                    },
                    rpcUrls: [],
                    blockExplorerUrls: []
                }

                networkData.chainId = networkID;

                if (networkID === "0x89") { // Polygon
                    networkData.rpcUrls.push("https://polygon-rpc.com");
                    networkData.chainName = "Polygon Mainnet (Matic)";
                    networkData.nativeCurrency.name = "Polygon";
                    networkData.nativeCurrency.symbol = "MATIC";
                    networkData.nativeCurrency.decimals = 18;
                    networkData.blockExplorerUrls.push("https://polygonscan.com");
                }
                else if (networkID === "0x13881") { // Polygon Mumbai Testnet
                    networkData.rpcUrls.push("https://rpc-mumbai.maticvigil.com");
                    networkData.chainName = "Polygon Mumbai Testnet";
                    networkData.nativeCurrency.name = "Mumbai";
                    networkData.nativeCurrency.symbol = "MATIC";
                    networkData.nativeCurrency.decimals = 18;
                    networkData.blockExplorerUrls.push("https://mumbai.polygonscan.com");
                }

                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [networkData]
                });

                return 'prompt_successful';
            }
            return 'prompt_cancled';
        })
    }

	const payInEth = async (size, callback) => {
		const web3 = window.web3
		const inEth = 0.000034;
		const amount = inEth * size;


		web3.eth.sendTransaction({
			from: account,
			to: "0x6C20AbbBDC33B00d2C1411Be28026d5495486ae0",
			value: web3.utils.toWei(amount.toFixed(7).toString(), "ether")
		}, (err, res) => {
			callback(res)	
		})
	}

	return (
		<Web3Context.Provider
			value={{
				loadWeb3,
				loadBlockchainData,
				mint,
				openContract,
				updateBaseUri,
				retrieveContract,
				withdraw,
				getBalance,
				account,
				signNonce,
				checkOwner,
                getNetworkID,
                setNetwork,

				payInEth,
			}}
		>
			{ children }
		</Web3Context.Provider>
	)
};


