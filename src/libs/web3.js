import React, { useState, useContext } from 'react';
import Web3 from 'web3/dist/web3.min';
import { useToast } from 'ds/hooks/useToast';
//import { useWebsite } from 'libs/website';
import NFTCollectible from 'ethereum/abis/NFTCollectible.json';

export const Web3Context = React.createContext({})

export const useWeb3 = () => useContext(Web3Context)

export const Web3Provider = ({ children }) => {
	const [account, setAccount] = useState(null);			// eth address
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
		console.log(address, signature)

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

	const checkOwner = async (id, contractAddress) => {
		const contract = await retrieveContract(contractAddress)
		const owner = await contract.methods.ownerOf(id).call();
		return owner
	}

	const getBaseUri = async (baseUri, contractAddress) => {
		const web3 = window.web3
		const contract = await retrieveContract(contractAddress)
		return contract.methods.baseTokenURI().call()
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

	const getTotalMinted = async (contractAddress) => {
		const web3 = window.web3
		const contract = await retrieveContract(contractAddress)


		return contract.methods.totalSupply().call()
	}

	const getBaseTokenURI = async (contractAddress) => {
		const web3 = window.web3
		const contract = await retrieveContract(contractAddress)

		return contract.methods.baseTokenURI().call()
	}

    // Get current network
    const getNetworkID = async () => {
        return window.ethereum.networkVersion;
    }

    // Set current network
    const setNetwork = async (networkID) => {
        return window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${networkID}` }],
        });
    }

	return (
		<Web3Context.Provider
			value={{
				loadWeb3,
				loadBlockchainData,
				mint,
				getBaseUri,
				updateBaseUri,
				retrieveContract,
				withdraw,
				getBalance,
				getTotalMinted,
				account,
				signNonce,
				checkOwner,
                getNetworkID,
                setNetwork,
			}}
		>
			{ children }
		</Web3Context.Provider>
	)
};


