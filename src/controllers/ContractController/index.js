import { useState } from 'react';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { mintV2 } from 'solana/helpers/mint';
import ERC721 from 'services/blockchain/blockchains/ethereum/abis/ambitionNFTPresale.json';
import ERC721a from 'services/blockchain/blockchains/ethereum/abis/AmbitionCreatorImpl.json';
import ProxyERC721a from 'services/blockchain/blockchains/ethereum/abis/AmbitionERC721ATestnet.json';

/**
 * Compare array buffers
 */
const compare = (a, b) => {
	for (let i = a.length; -1 < i; i -= 1) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}

/**
 * Determine if contract is ERC or CandyMachine
 */
const getContractType = (blockchain) => {
	if (
		blockchain == 'ethereum' ||
		blockchain == 'polygon' ||
		blockchain == 'rinkeby' ||
		blockchain == 'mumbai'
	) {
		return 'ethereum'
	} else if (
		blockchain == 'solana' ||
		blockchain == 'solanadevnet'
	) {
		return 'solana'
	}
};

/**
 * Determine blockchain of contract based on its address
 */
const deriveBlockchain = (contractAddress) => {
	
};

/**
 * Logic smart contract address. Proxy contracts delegate function calls to this address.
 * Only used in this context to construct contract ABI
 */
const impl = '0x65Cf89C53cC2D1c21564080797b47087504a3815';

/**
 * Initial contract state
 *
 * @property balance - Balance of smart contract
 * @property metadataUrl - Target URL of baseUri
 * @property price - Cost of minting a single NFT
 * @property collectionSize - Size of NFT collection
 * @property amountSold - Number of NFTs sold
 * @property maxPerMint - Number of NFTs that can be minted at a time
 * @property maxPerWallet - Number of NFTs a minter's wallet can hold
 * @property isPresaleOpen - Presale state
 * @property isPublicSaleOpen - Public sale state
 * 
 * @TODO turn into type.
 */
const ContractState = {
	balance: '',	
	metadataUrl: '',
	price: 1,
	collectionSize: '',
	amountSold: '',
	maxPerMint: '',
	maxPerWallet: '',
	isPresaleOpen: false,
	isPublicSaleOpen: true,
};

/**
 * Controller responsible for submitting and managing contract transactions
 */
export class ContractController {
	version = 'erc721a';

	constructor(contractAddress, blockchain, version) {
		// Set contract methods (only needed for ethereum contracts)
		if(getContractType(blockchain) == 'ethereum') {
			this.contract = this.retrieveEthereumContract(contractAddress);
		} else {
			this.contract = {};
		}
		this.contract.contractAddress = contractAddress;
		this.contract.type = getContractType(blockchain);
		this.blockchain = blockchain;

		// if contract is on chain
		// populate these values
		this.state = ContractState;
	}


	/**
	 * Generates runnable "method" functions for interacting with smart contract
	 */
	retrieveEthereumContract(contractAddress) {
		const { version } = this;

		const web3 = window.web3;

		if (web3.eth) {
			if (version == 'erc721') {
				return new web3.eth.Contract(ERC721.abi, contractAddress);
			}
			if (version == 'erc721a') {
				return new web3.eth.Contract(ERC721a.abi, impl);
			}
		}
	};

	/**
	 * Retrieves all public variables of a smart contract
	 *
	 * @TODO add support for ERC-721
	 */
	populateContractInfo = () => {
		// if erc721
		const { contract: { type }} = this;

		if (type == 'ethereum') {
			if (version == 'erc721') {
				// @TODO add support

			}

			if (version == 'erc721a') {

			}
		}

		if (type == 'solana') {
			// @TODO needs support
		}
	};


	/**
	 * Deploys new proxy contract
	 *
	 * @param deployerAddress - wallet address of the user deploying the contract
	 * @param name - Name of the smart contract
	 * @param symbol - Token symbol. Shown in Etherscan, Opensea, etc
	 * @param totalSupply - Size of the NFT collection
	 *
	 * @TODO Support solana
	 */
	async deployContract(deployerAddress, name, symbol, totalSupply) {
		const { blockchain, contract: { type }} = this;

		// Proxy contract
		const proxyContract = new web3.eth.Contract(ProxyERC721a.abi);


		if (type == 'ethereum') {
			const options = {
				data: ProxyERC721a.bytecode,
				arguments: [name, symbol, parseInt(totalSupply)],
			};
			const senderInfo = {
				from: deployerAddress,
			};

			return proxyContract.deploy(options)
				.send(senderInfo, (err, txnhash) => {
					if (err) {
						throw new Error(err.message);
					} else {
						console.log(
							'Deploying contract... should take a couple of seconds'
						);
					}
				})
				.on('error', function(error){
					throw new Error(error.message)
				})
		}

		if (type == 'solana') {
			// @TODO solana contract deploy
			
		}
	};


	/**
	 * Mints NFT. Supports Ethereum & Solana, mainnet + testnets
	 *
	 * @param walletAddress - Address of minter
	 * @param count - Amount of NFT to mint
	 * @param whitelist - Optional. List of addresses used to construct proof for whitelist.
	 */
	async mint(walletAddress, count, whitelist) {
		const {
			blockchain,
			contract: {
				contractAddress,
				type
			},
			state: { price, isPresaleOpen, isPublicSaleOpen },
		} = this;

		// Solana minting
		if(blockchain == 'solana') {
			await mintV2('mainnet', contractAddress, walletAddress);
			return;
		}
		if(blockchain == 'solanadevnet') {
			await mintV2('devnet', contractAddress, walletAddress);
			return;
		}

		//  Ethereum minting
		if (type == 'ethereum') {
			const {	contract: { methods: { presaleMint, mint }}} = this;
			let txnData;

			if (isPresaleOpen == false && isPublicSaleOpen == false) {
				throw new Error('Sales are not open');
				return;
			}

			// Presale mint
			if (isPresaleOpen) {
				// Find merkleroot
				const leafNodes = whitelist.map((addr) => keccak256(addr));
				const claimingAddress =
					(await leafNodes.find((node) =>
						compare(keccak256(account), node)
					)) || '';
				const merkleTree = new MerkleTree(leafNodes, keccak256, {
					sortPairs: true,
				});
				const hexProof = merkleTree.getHexProof(claimingAddress);

				txnData = presaleMint(count, hexProof).encodeABI();
			}

			// Public sale mint
			if (isPublicSaleOpen) {
				txnData = mint(count).encodeABI();
			}

			// Send transaction
			// @TODO no error
			return web3.eth.sendTransaction(
				{
					from: walletAddress,
					to: contractAddress,
					data: txnData,
					value: price,
				},
				(err, hash) => {
					if (err) {
						throw new Error(err.message);
					}
				}
			);
		}
	}

	/**
	 * Send NFTs to a list of wallet addresses.
	 *
	 * @param walletAddress - Owner of smart contract
	 * @param recipients - Array of wallet addresses to receive NFTs
	 * @param amount - Array of NFTs to airdrop per address, with index corresponding to address index
	 */
	async airdrop(walletAddress, recipients, amount) {
		const { version, contract: { contractAddress, methods: {airdrop}}} = this;
		let txnData;

		// ERC-721 doesn't have ability to set specific amount of tokens to airdrop per address
		// like 721a does
		if(version == 'erc721') {
			txnData = airdrop(recipients).encodeABI();
		}
		if(version == 'erc721a') {
			txnData = airdrop(recipients, amount).encodeABI();
		}

		// Send transaction
		// @TODO no error
		return eeb3.eth.sendTransaction(
			{
				from: walletAddress,
				to: contractAddress,
				data: txnData,
				value: 0,
			},
			(err) => {
				if (err) {
					throw new Error(err.message);
				}
			}
		);
	}


	/**
	 * Updates sale-related states in smart contract
	 *
	 * @param walletAddress - Owner of smart contract
	 * @param open - Smart contract boolean public sale state
	 * @param cost - Price of single NFT in wei?
	 * @param maxW - Max per wallet
	 * @param maxM - Max per mint
	 */
  async updateSale(walletAddress, open, cost, maxW, maxM) {
		const { version, contract: { contractAddress, methods: {updateSale}}} = this;
		let txnData;

		// @TODO load current states for non updating values

		if(version == 'erc721') {
			throw new Error("Function not supported in this version")
		}
		if(version == 'erc721a') {
			txnData = updateSale(open, cost, maxW, maxM).encodeABI();
		}

		// Send transaction
		// @TODO no info
		return web3.eth.sendTransaction(
			{
				from: walletAddress,
				to: contractAddress,
				data: txnData,
				value: 0,
			},
			(err) => {
				throw new Error(err.message);
			}
		);
  }

	/**
	 * Updates presale in smart contract
	 *
	 * @param walletAddress - Owner of smart contract
	 * @param open - Boolean presale state
	 * @param root - Merkleroot of all addresses on the whitelist. Used to verify address for presale mint,
	 */
  async updatePresale(open, root) {
		const { version, contract: { contractAddress, methods: {updatePresale}}} = this;
		let txnData;

		// @TODO load current states for non updating values

		if(version == 'erc721') {
			throw new Error("Function not supported in this version")
		}
		if(version == 'erc721a') {
			txnData = updatePresale(open, cost, maxW, maxM).encodeABI();
		}

		// Send transaction
		// @TODO no info
		return web3.eth.sendTransaction(
			{
				from: walletAddress,
				to: contractAddress,
				data: txnData,
				value: 0,
			},
			(err) => {
				throw new Error(err.message);
			}
		);
  }


	/**
	 * Updates contract baseUri (metadata destination)
	 * depending on @param revealed boolean. Our smart contracts now
	 * host 2 uri states - for pre-reveal and post-reveal
	 *
	 * @param walletAddress - Owner of smart contract
	 * @param revealed - Uri to update. Also functions as a toggle for which uri to display.
	 * @param uri - Metadata uri
	 */
  async updateReveal(walletAddress, revealed, uri) {
		const { version, contract: { contractAddress, methods: {updateReveal}}} = this;
		let txnData;

		if(version == 'erc721') {
			throw new Error("Function not supported in this version")
		}
		if(version == 'erc721a') {
			txnData = updateReveal(open, cost, maxW, maxM).encodeABI();
		}

		// Send transaction
		// @TODO no info
		return web3.eth.sendTransaction(
			{
				from: walletAddress,
				to: contractAddress,
				data: txnData,
				value: 0,
			},
			(err) => {
				throw new Error(err.message);
			}
		);
  }

	/**
	 * Withdraws funds from smart contract. In the case of Solana,
	 * also shuts down contract.
	 * Supports ERC-721 & ERC-721a
	 * 
	 * @TODO support solana
	 */
  async withdraw() {
		const { version, contract: { contractAddress, type, methods: {withdraw}}} = this;
		let txnData;

		if (type == 'ethereum') {
			txnData = withdraw(open, cost, maxW, maxM).encodeABI();

			// Send transaction
			// @TODO no info
			return web3.eth.sendTransaction(
				{
					from: walletAddress,
					to: contractAddress,
					data: txnData,
					value: 0,
				},
				(err) => {
					throw new Error(err.message);
				}
			);
		}

		if (type == 'solana') {
			// @TODO Solana withdraw
		}
  }
}


