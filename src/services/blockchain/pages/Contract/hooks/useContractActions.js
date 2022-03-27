import { useState, useEffect } from 'react';
import { useToast } from 'ds/hooks/useToast';
import { useForm } from 'ds/hooks/useForm';
import { useWeb3 } from 'libs/web3';
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import { useSetWhitelist } from "services/blockchain/gql/hooks/contract.hook.js";
import { mintV2 } from 'solana/helpers/mint';
import { withdrawV2 } from 'solana/helpers/withdraw';

export const useContractActions = (contractAddress) => {
	const { addToast } = useToast();
	const { retrieveContract, account } = useWeb3();
	const [contract, setContract] = useState({});
	const [setWhitelist] = useSetWhitelist({});
	const { form: actionForm  } = useForm({
		airdropList: {
			default: '',
			placeholder: `0x123\n0x456\n0x789`,
			rules: []
		},
		whitelistAddresses: {
			default: '',
			placeholder: `0x123\n0x456\n0x789`,
			rules: []
		},
		maxPerMintCount: {
			default: '',
			placeholder: '5',
			rules: []
		},
		newPrice: {
			default: '',
			placeholder: '5',
			rules: []
		},
		newMetadataUrl: {
			default: '',
			placeholder: 'New metadata URL',
			rules: []
		},
	});

	const onTxnError = (err) => {
		addToast({
			severity: 'error',
			message: err.message
		})
	}

	const onTxnInfo = () => {
		addToast({
			severity: 'info',
			message: 'Sending transaction to Ethereum. This might take a couple of seconds...'
		})
	}

	const onTxnSuccess = () => {
		addToast({
			severity: 'success',
			message: `Transaction success`
		})
	}

	// Update base URI
	const updateBaseUri = async (baseUri = actionForm.newMetadataUrl.value) => {

		contract.methods.setBaseURI(baseUri).send({
			from: account,
			value: 0 
		}, err => err ? onTxnError(err) : onTxnInfo())
		.once('error', err => onTxnError(err))
		.once("confirmation", () => onTxnSuccess())
	}

	const setMaxPerMint = async (count = actionForm.maxPerMintCount.value) => {
		contract.methods.setMaxPerMint(parseInt(count)).send({
			from: account,
			value: 0 
		}, err => err ? onTxnError(err) : onTxnInfo())
		.once('error', err => onTxnError(err))
		.once("confirmation", () => onTxnSuccess())
	}

	const setCost = async (price = actionForm.newPrice.value) => {
		const web3 = window.web3;
		const priceInWei = web3.utils.toWei(price);

		contract.methods.setCost(priceInWei).send({ 
			from: account,
			value: 0 
		},  err => err ? onTxnError(err) : onTxnInfo())
		.once('error', err => onTxnError(err))
		.once("confirmation", () => onTxnSuccess())
	}

	const openSales = async (status = true) => {
		contract.methods.setOpen(status).send({ 
			from: account,
			value: 0
		}, err => err ? onTxnError(err) : onTxnInfo())
		.once('error', err => onTxnError(err))
		.once("confirmation", () => onTxnSuccess())
	}
	
	const openPresale = async (status = true) => {
		contract.methods.setPresaleOpen(status).send({
			from: account,
			value: 0
		}, err => err ? onTxnError(err) : onTxnInfo())
		.once('error', err => onTxnError(err))
		.once("confirmation", () => onTxnSuccess())
	}

	const airdrop = async (list = actionForm.airdropList.value.split('\n')) => {
		console.log(list)
		contract.methods.airdrop(list).send({
			from: account,
			value: 0
		}, err => err ? onTxnError(err) : onTxnInfo())
		.once('error', err => onTxnError(err))
		.once("confirmation", () => onTxnSuccess())
	}



	const setMerkleRoot = (id, addresses = actionForm.whitelistAddresses.value.split("\n")) => {
		const leafNodes = addresses.map((addr) => keccak256(addr));
		const merkleTree = new MerkleTree(leafNodes, keccak256, {
			sortPairs: true,
		});
		const root = merkleTree.getRoot();

		contract.methods.setPreSaleAddresses(root).send({ 
			from: account,
			value: 0
		}, err => err ? onTxnError(err) : onTxnInfo())
		.once('error', err => onTxnError(err))
		.once("confirmation", () => onTxnSuccess())

		setWhitelist({ variables: { id, whitelist: addresses } });
	};


	const presaleMint = async (whitelist, count = 1) => {
		const cost = await contract.methods.cost().call()

		const leafNodes = whitelist.map(addr => keccak256(addr));
		const claimingAddress = await leafNodes.find(node =>  compare(keccak256(account), node)) || ''
		const merkleTree = new MerkleTree(leafNodes,keccak256, { sortPairs: true });
		
		const hexProof = merkleTree.getHexProof(claimingAddress)

		contract.methods.presaleMint(count, hexProof).send({ 
			from: account,
			value: cost
		}, err => err ? onTxnError(err) : onTxnInfo())
		.once('error', err => onTxnError(err))
		.once("confirmation", () => onTxnSuccess())
	}

	// compare array buffers
	function compare(a, b) {
		for (let i = a.length; -1 < i; i -= 1) {
			if ((a[i] !== b[i])) return false;
		}
		return true;
	}


	const withdraw = async (wallet = 'metamask', env = 'mainnet') => {
        if (wallet == 'phantom') {
            console.log('withdrawing phantom')
            await withdrawV2(env, contractAddress);
            return;
        }

		contract.methods.withdraw().send({ 
			from: account,
			value: 0
		}, err => err ? onTxnError(err) : onTxnInfo())
		.once('error', err => onTxnError(err))
		.once("confirmation", () => onTxnSuccess())
	}

	// Mint NFT
	const mint = async (count = 1, wallet = 'metamask', env = 'mainnet') => {
        if (wallet == 'phantom') {
            console.log('minting phantom')
            await mintV2(env, contractAddress, account);
            return;
        }

		const { methods } = contract;
		const price = await methods.cost().call();

					methods.mint(count).send({ 
						from: account,
						value: price
					}, err => err ? onTxnError(err) : onTxnInfo())
					.once('error', err => onTxnError(err))
					.once("confirmation", () => onTxnSuccess())


		/*
		try {
			// Support depreciated method
			await methods.mintNFTs(count).estimateGas({
				from: account,
				value: price
			}, (err, gasAmount) => {
				if(!err && gasAmount !== undefined) {
					methods.mintNFTs(count).send({ 
						from: account,
						value: price
					}, err => err ? onTxnError(err) : onTxnInfo())
					.once('error', err => onTxnError(err))
					.once("confirmation", () => onTxnSuccess())
				}
			})

			await methods.mint(count).estimateGas({
				from: account,
				value: price
			}, (err, gasAmount) => {
				if(!err && gasAmount !== undefined) {
					methods.mint(count).send({ 
						from: account,
						value: price
					}, err => err ? onTxnError(err) : onTxnInfo())
					.once('error', err => onTxnError(err))
					.once("confirmation", () => onTxnSuccess())
				}
			})
		} catch (e) {
			addToast({
				severity: 'error',
				message: e.message
			});
		}
		*/

	}
	
	useEffect(() => {
		const c = retrieveContract(contractAddress)
		setContract(c)
	}, [contractAddress])

	return {
		actionForm,
		updateBaseUri,
		setMaxPerMint,
		setCost,
		openSales,
		openPresale,
		airdrop,
		setMerkleRoot,
		presaleMint,
		withdraw,
		mint
	}
};
