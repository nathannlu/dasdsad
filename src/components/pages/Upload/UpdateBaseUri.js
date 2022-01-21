import React from 'react';
import { Button } from 'ds/components';
import { useWeb3 } from 'libs/web3';
import { useSetBaseUri } from 'gql/hooks/contract.hook';

const UpdateBaseUri = () => {
	const { updateBaseUri } = useWeb3();
	const ipfsUrl = 'sd';
	let contractAddress = '0x8493aa28d7021869E604ce877FBD8910B94354DC'
	const [setBaseUri] = useSetBaseUri({})

	const onClick = async () => {
		await updateBaseUri(ipfsUrl)	

		// Update in database
		await setBaseUri({ variables: { baseUri: ipfsUrl, address: contractAddress }})
	}
	
	return (
		<Button onClick={onClick} variant="contained">
			Update base URI
		</Button>
	)
};

export default UpdateBaseUri
