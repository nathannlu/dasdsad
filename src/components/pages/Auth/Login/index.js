import React, { useEffect } from 'react';
import { Button } from 'ds/components';
import { useWeb3 } from 'libs/web3';

import { useGetNonceByAddress, useVerifySignature } from 'gql/hooks/users.hook';

const Login = () => {
	const { account, loadWeb3, signNonce, loadBlockchainData } = useWeb3()
	const [getNonceByAddress] = useGetNonceByAddress({
		address: account
	})
	const [verifySignature] = useVerifySignature({});

	const onClick = async () => {

		// Check if address has nonce
		const res = await getNonceByAddress()
		const nonce = res.data.getNonceByAddress

		// Create a signature from address
		const { address, signature } = await signNonce({ address: account, nonce });
		
		const rezz = await verifySignature({variables: {address, signature}})

		console.log(rezz)

		



		// fetchCurrentNounce(address)
	}


	useEffect(() => {
		(async() => {
			await loadWeb3();
			await loadBlockchainData();
		})()
	})

	return (
		<div>
			Login

			<Button onClick={onClick}>
				Sign in with metamask
			</Button>
		</div>
	)
};

export default Login;
