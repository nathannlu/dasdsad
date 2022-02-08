import React, { useState } from 'react';
import { Stack, Box, Typography, TextField, Button } from 'ds/components';
import { useSetBaseUri } from 'services/blockchain/gql/hooks/contract.hook';
import { useToast } from 'ds/hooks/useToast';

const ImportLink = (props) => {
	const [ipfsUrl, setIpfsUrl] = useState('');
	const { addToast } = useToast();
  const [setBaseUri] = useSetBaseUri({
		onCompleted: () => {
			addToast({
				severity: 'success',
				message: 'Successfully added contract base URI'
			})
			props.setIsModalOpen(false)
		}
	})
	
	return (
		<Stack gap={2}>
			<Box>
				<Button size="small" onClick={()=>props.goToStep(1)}>
					Go back
				</Button>
			</Box>
			<Box>
				<Typography>
					Input your metadata URL here
				</Typography>
			</Box>

			<Box>
				<TextField 
					onChange={e => setIpfsUrl(e.target.value)} 
					value={ipfsUrl}
				/>
			</Box>

			<Button variant="contained" onClick={() => setBaseUri({variables: {baseUri: ipfsUrl, id: props.id}})}>
				Confirm
			</Button>
		</Stack>
	)
};

export default ImportLink;
