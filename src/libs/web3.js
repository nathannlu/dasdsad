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
	const mint = async (contractAddress, count = 1) => {
		const contract = await retrieveContract(contractAddress)
		const price = await contract.methods.cost().call();

//		const priceInWei = Web3.utils.toWei(price);

		// Support depreciated method
		contract.methods.mintNFTs(count).estimateGas({
			from: account,
			value: price
		}, (err, gasAmount) => {
			if(gasAmount !== undefined) {
				contract.methods.mintNFTs(count).send({ from: account, value: price }, err => {
					if (err) {
						addToast({
							severity: 'error',
							message: err.message
						})
					} else {
						addToast({
							severity: 'info',
							message: 'Sending transaction to Blockchain. This might take a couple of seconds...'
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
		})

		contract.methods.mint(count).estimateGas({
			from: account,
			value: price * count
		}, (err, gasAmount) => {

			if(!err && gasAmount !== undefined) {
				contract.methods.mint(count).send({ from: account, value: price * count }, err => {
					if (err) {
						addToast({
							severity: 'error',
							message: err.message
						})
					} else {
						addToast({
							severity: 'info',
							message: 'Sending transaction to Blockchain. This might take a couple of seconds...'
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
		})
	}

	// compare array buffers
	function compare(a, b) {
		for (let i = a.length; -1 < i; i -= 1) {
			if ((a[i] !== b[i])) return false;
		}
		return true;
	}

	const presaleMint = async (price, contractAddress, whitelist, count = 1) => {
		const contract = await retrieveContract(contractAddress)
		const priceInWei = Web3.utils.toWei(price);

		const leafNodes = whitelist.map(addr => keccak256(addr));
		const claimingAddress = await leafNodes.find(node =>  compare(keccak256(account), node))

		const merkleTree = new MerkleTree(leafNodes,keccak256, { sortPairs: true });

		const hexProof = merkleTree.getHexProof(claimingAddress)


		contract.methods.presaleMint(count, hexProof).send({ from: account, value: priceInWei }, err => {
			if (err) {
				addToast({
					severity: 'error',
					message: err.message
				})
			} else {
				addToast({
					severity: 'info',
					message: 'Sending transaction to Blockchain. This might take a couple of seconds...'
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


	const checkOwner = async (id, contractAddress) => {
		const contract = await retrieveContract(contractAddress)
		const owner = await contract.methods.ownerOf(id).call();
		return owner
	}

	const getPublicContractVariables = async (contractAddress) => {
        if (!contractAddress) return;

        console.log(contractAddress)

		const contract = await retrieveContract(contractAddress);

		const balance = await window.web3.eth.getBalance(contractAddress);
        console.log('balance', balance);
		const balanceInEth = window.web3.utils.fromWei(balance);
        console.log('balanceInEth', balanceInEth);
		const baseTokenUri = await contract.methods.baseTokenURI().call();
        console.log('baseTokenUri', baseTokenUri);
		const open = await contract.methods.open().call();
        console.log('open', open);

        let presaleOpen = false; // Temporary, presaleOpen is not working
		try {
            presaleOpen = await contract.methods.presaleOpen().call();
        }
        catch (err) {
            //console.log(err);
        }
        console.log('presaleOpen', presaleOpen);

		const maxPerMint = await contract.methods.maxPerMint().call();
        console.log('maxPerMint', maxPerMint);
		const cost = await contract.methods.cost().call();
        console.log('cost', cost);
		const costInEth = window.web3.utils.fromWei(cost);
        console.log('costInEth', costInEth);
		const supply = await contract.methods.supply().call();
        console.log('supply', supply);
		const totalSupply = await contract.methods.totalSupply().call();
        console.log('totalSupply', totalSupply);
		const owner = await contract.methods.owner().call();
        console.log('owner', owner);

		return {
			balance,
			balanceInEth,
			baseTokenUri,
			open,
			presaleOpen,
			maxPerMint,
			cost,
			costInEth,
			supply,
			totalSupply,
			owner,
		}
	}

	const retrieveContract = (contractAddress) => {
		const web3 = window.web3;
		if (web3.eth) {
			const contract = new web3.eth.Contract(NFTCollectible.abi, contractAddress);
			console.log(contract)
			return contract;
		}
	}

	const getPrice = async (contractAddress) => {
		const web3 = window.web3
		const contract = await retrieveContract(contractAddress)
        const price = await contract.methods.cost().call();
		return web3.utils.fromWei(price)
	}

    const getTotalMinted = async (contractAddress) => {
        const web3 = window.web3
		const contract = await retrieveContract(contractAddress)

//        const state = await contract.methods.open().call();
        const minted = await contract.methods.supply().call();

        return minted;
		}
    const getMaximumSupply = async (contractAddress) => {
        const web3 = window.web3
			try {
		const contract = await retrieveContract(contractAddress)

//        const state = await contract.methods.open().call();
        const max = await contract.methods.totalSupply().call();

				
        return max;
			} catch (e) {
        const max2 = await contract.methods.MAX_SUPPLY().call();

				return max2
			}
		}
    // Compare current network with target network and switches if it doesn't match
    const compareNetwork = async (targetNetwork, callback) => {
        const curNetwork = getNetworkID();
        if (curNetwork !== targetNetwork) {
            const status = await setNetwork(targetNetwork);
            if (status === 'prompt_successful') callback();
            else if (status === 'prompt_cancled') {
                addToast({
                    severity: 'error',
                    message: 'User canceled switching networks'
                })
            }
        }
        else {
            callback();
        }
//            callback();
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
        compareNetwork('0x1', () => {
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
        })
		return [loading]
	}



	return (
		<Web3Context.Provider
			value={{
				loadWeb3,
				loadBlockchainData,
				mint,
				retrieveContract,
				account,
				signNonce,
				checkOwner,
                getNetworkID,
                setNetwork,
                compareNetwork,
                presaleMint,

				loading,
				payInEth,
                getPrice,
                getMaximumSupply,
				getTotalMinted,

				getPublicContractVariables
			}}
		>
			{ children }
		</Web3Context.Provider>
	)
};


