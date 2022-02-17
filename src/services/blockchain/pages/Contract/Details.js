import React, { useState, useEffect } from 'react';
import { Stack, Box, Grid, Typography, Button, Divider } from 'ds/components';
import { Chip } from '@mui/material';
import { useWeb3 } from 'libs/web3';

const Details = ({contract}) => {
	const [balance, setBalance] = useState(null)
	const [soldCount, setSoldCount] = useState(null)
	const [price, setPrice] = useState();

	const {
		contractState,
		getContractState,
		presaleState,
		getPresaleState,
	} = useWeb3()

	useEffect(() => {
		(async () => {
			const b = await getBalance(contract.address)
			setBalance(b);

			const nftsSold = b / contract.nftCollection.price

			if(b == 0) {
				setSoldCount(0)
			} else {
				setSoldCount(nftsSold)
			}

			// Get sales status
			await getContractState(contract.address);
			await getPresaleState(contract.address);
		})();
	}, [contract])


	return (
		<Stack>
			<Typography variant="h6" sx={{fontWeight:'bold'}}>
				Details
			</Typography>

			<Grid container>
				<Grid item xs={6}>
					Balance:
				</Grid>
				<Grid sx={{fontWeight:'bold'}} item xs={6}>
					{balance} {contract.nftCollection.currency}
				</Grid>
				<Grid item xs={6}>
					NFTs sold:
				</Grid>
				<Grid sx={{fontWeight:'bold'}} item xs={6}>
					{soldCount}
				</Grid>
				<Grid item xs={6}>
					Price per NFT:
				</Grid>
				<Grid sx={{fontWeight:'bold'}} item xs={6}>
					{price} {contract.nftCollection.currency}
				</Grid>
				<Grid item xs={6}>
					Collection size:
				</Grid>
				<Grid sx={{fontWeight:'bold'}} item xs={6}>
					{contract?.nftCollection ? contract?.nftCollection?.size : null}
				</Grid>

											<Grid item xs={6}>
					Pre sales status:
				</Grid>
				<Grid sx={{fontWeight:'bold'}} item xs={6}>
													{presaleState ? (
															<Chip label='Open' color='success' size='small'/>
													) : (
															<Chip label='Closed' color='error' size='small'/>
													)}
				</Grid>

											<Grid item xs={6}>
					Public sales status:
				</Grid>
				<Grid sx={{fontWeight:'bold'}} item xs={6}>
													{contractState ? (
															<Chip label='Open' color='success' size='small'/>
													) : (
															<Chip label='Closed' color='error' size='small'/>
													)}
				</Grid>
			</Grid>
		</Stack>
	)
};

export default Details;
