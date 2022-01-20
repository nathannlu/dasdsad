import { useState } from 'react';
import { useWeb3 } from 'libs/web3';
//import { useWebsite } from 'libs/website';
import { useToast } from 'ds/hooks/useToast';
//import { useSetContractAddress } from 'gql/hooks/website.hook';

import posthog from 'posthog-js';
import NFTCollectible from 'ethereum/abis/NFTCollectible.json';

export const useDeployContract = ({
	baseURI,
	priceInEth,
	maxSupply,
	onDeploy,
	onCompleted,
	onError
}) => {
	const [loading, setLoading] = useState(false)
	const { addToast } = useToast()
	const { account } = useWeb3()
//	const { website } = useWebsite();


	const deployContract = async () => {
		const web3 = window.web3
		const contract = new web3.eth.Contract(NFTCollectible.abi)
		const priceInWei = web3.utils.toWei(priceInEth);

		const options = {
			data: NFTCollectible.bytecode,
			arguments: ['', priceInWei, maxSupply]
		}
		const senderInfo = {
			from: account
		}

		contract
			.deploy(options)
			.send(senderInfo, (err, txnHash) => {
				console.log('deploying contract...')
				if(err) {
					onError(err)
				} else {
					onDeploy()
					setLoading(true);
				}
			})
			.on('error', err => {
				onError(err)
				setLoading(false)
			})
			.on('confirmation', (confirmationNumber, receipt) => {
				console.log('deployed')
				onCompleted(receipt);

				/*
				setContractAddress({ variables: {
					title: website.title,
					contractAddress: receipt.contractAddress,
					priceInEth
				}});
				*/
				addToast({
					severity: 'success',
					message:'Contract deployed under:' + receipt.contractAddress
				})

				posthog.capture('User deployed smart contract');

				setLoading(false)
			})
	};

	return [deployContract, {loading}]
}

