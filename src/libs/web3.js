import React, { useState, useContext } from 'react';
import Web3 from 'web3/dist/web3.min';
import { useToast } from 'ds/hooks/useToast';
//import { useWebsite } from 'libs/website';
//import NFTCollectible from 'services/blockchain/blockchains/ethereum/abis/NFTCollectible.json';
import config from 'config';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import NFTCollectible from 'services/blockchain/blockchains/ethereum/abis/ambitionNFTPresale.json';

export const Web3Context = React.createContext({})

export const useWeb3 = () => useContext(Web3Context)

export const Web3Provider = ({ children }) => {
	const [account, setAccount] = useState(null); // eth address
	const [loading, setLoading] = useState(false);
    const [contractState, setContractState] = useState(false);
    const [presaleState, setPresaleState] = useState(false);
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


		await contract.methods.mintNFTs(1).send({ from: account, value: priceInWei }, err => {
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
		.once("confirmation", () => {
			addToast({
				severity: 'success',
				message: 'NFT successfully minted.'
			})
		})
	}

	// compare array buffers
	function compare(a, b) {
		for (let i = a.length; -1 < i; i -= 1) {
			if ((a[i] !== b[i])) return false;
		}
		return true;
	}

	const presaleMint = async (price, contractAddress, whitelist) => {
		const contract = await retrieveContract(contractAddress)
		const priceInWei = Web3.utils.toWei(price);

		const leafNodes = whitelist.map(addr => keccak256(addr));
		const claimingAddress = await leafNodes.find(node =>  compare(keccak256(account), node))

		const merkleTree = new MerkleTree(leafNodes,keccak256, { sortPairs: true });

		const hexProof = merkleTree.getHexProof(claimingAddress)


		contract.methods.presaleMint(1,hexProof).send({ from: account, value: priceInWei }, err => {
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
		.once("confirmation", () => {
			addToast({
				severity: 'success',
				message: 'NFT successfully minted.'
			})
		})
	}

	const openSales = async (contractAddress, status = true) => {
		const contract = await retrieveContract(contractAddress)

		contract.methods.setOpen(status).send({ from: account, value: 0 }, err => {
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
		.once("confirmation", () => {
            getContractState(contractAddress);
			addToast({
				severity: 'success',
				message: `Sales are now ${status ? 'open' : 'closed'}.`
			})
		})
	}
	const openPresale = async (contractAddress, status = true) => {
		const contract = await retrieveContract(contractAddress)

		contract.methods.setPresaleOpen(status).send({ from: account, value: 0 }, err => {
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
		.once("confirmation", () => {
            getPresaleState(contractAddress);
			addToast({
				severity: 'success',
				message: `Pre sales are now ${status ? 'open' : 'closed'}.`
			})
		})
	}

	const setWhitelist = async (contractAddress, root) => {
		const contract = await retrieveContract(contractAddress)

		contract.methods.setPreSaleAddresses(root).send({ from: account, value: 0 }, err => {
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
		.once("confirmation", () => {
			addToast({
				severity: 'success',
				message: `Successfully set whitelist addresses`
			})
		})
	}

	const airdrop = async (contractAddress, list) => {
		const contract = await retrieveContract(contractAddress)

		contract.methods.airdrop(list).send({ from: account, value: 0 }, err => {
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
		.once("confirmation", () => {
			addToast({
				severity: 'success',
				message: `Successfully airdropped users`
			})
		})
	}

    const getContractState = async (contractAddress) => {
        const contract = await retrieveContract(contractAddress);
        const state = await contract.methods.open().call();
        setContractState(state);
        return state; // false - closed, true - open
    }
    const getPresaleState = async (contractAddress) => {
        const contract = await retrieveContract(contractAddress);
        const state = await contract.methods.presaleOpen().call();
        setPresaleState(state);
        return state; // false - closed, true - open
    }

	const checkOwner = async (id, contractAddress) => {
		const contract = await retrieveContract(contractAddress)
        console.log(contract.methods);
		const owner = await contract.methods.ownerOf(id).call();
        console.log(owner);
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
		.once("confirmation", () => {
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
		.once("confirmation", () => {
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

	const getPrice = async (contractAddress) => {
		const web3 = window.web3
		const contract = await retrieveContract(contractAddress)
        const price = await contract.methods.PRICE().call();
		return web3.utils.fromWei(price)
	}

    const getMaximumSupply = async (contractAddress) => {
        const web3 = window.web3
		const contract = await retrieveContract(contractAddress)
        const max = await contract.methods.MAX_SUPPLY().call();
        return max;
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
			to: config.company.walletAddress,
			value: web3.utils.toWei(amount.toFixed(7).toString(), "ether")
		})
		.on('transactionHash', () => {
			setLoading(true);
			addToast({
				severity: 'info',
				message: 'Sending transaction. This could take up to a minute...'
			})
		})
		.once('confirmation', () => {
			setLoading(false);
			callback()
		})
		.on('error', () => {
			setLoading(false);
		})

		return [loading]
	}



	return (
		<Web3Context.Provider
			value={{
				loadWeb3,
				loadBlockchainData,
				airdrop,
				mint,
				presaleMint,
				openSales,
				openPresale,
				updateBaseUri,
				retrieveContract,
				withdraw,
				getBalance,
				account,
				signNonce,
				checkOwner,
                getNetworkID,
                setNetwork,

				loading,
				payInEth,
                contractState,
                getContractState,
                presaleState,
                getPresaleState,
				setWhitelist,
                getPrice,
                getMaximumSupply,
			}}
		>
			{ children }
		</Web3Context.Provider>
	)
};


