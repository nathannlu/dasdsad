import React, { useState, useEffect } from 'react';
import { Container, Button, Stack, Card, Typography, FormLabel, TextField, Box, Grid, Fade, MenuItem, LoadingButton } from 'ds/components';
import { useCreateWebsite } from 'gql/hooks/website.hook';
import { useDeploy } from 'libs/deploy';
import { useGetContracts } from 'gql/hooks/contract.hook';

const Website = () => {
	useGetContracts()
	const { contracts } = useDeploy();
	const [websiteTitle, setWebsiteTitle] = useState();
	const [selectInput, setSelectInput] = useState();

	const [createWebsite] = useCreateWebsite({ 
		title: websiteTitle,
		contractAddress: selectInput,
	});
	useEffect(() => {
		setSelectInput(contracts[0]?.address)
	console.log(contracts[0]?.address)
	}, [contracts])

		

	return (
		<Fade in>
			<Container>
				<Stack gap={3}>
					<Card sx={{p: 2}}>
						<Stack gap={3}>
							<Stack>
								<Typography gutterBottom variant="h4">
									Create new website
								</Typography>
								<Typography gutterBottom variant="body">
									Fill in and configure your smart contracts
								</Typography>
							</Stack>

							<Stack gap={2} direction="row">
								<Stack sx={{flex: 1}}>
									<FormLabel sx={{fontWeight:'bold'}}>
										Website subdomain 
									</FormLabel>
									<Typography gutterBottom variant="body2">
										Set a name for your website
									</Typography>
									<Stack direction="row" alignItems="center">
										<TextField size="small" placeholder="bayc-nft" onChange={e=>setWebsiteTitle(e.target.value)} />
										<Box>
											.ambition.so
										</Box>
									</Stack>
								</Stack>
							</Stack>

							<Stack>
								<FormLabel sx={{fontWeight:'bold'}}>
									Select your smart contract
								</FormLabel>
								<TextField select onChange={e=>setSelectInput(e.target.value)} value={selectInput}>
									{contracts.map(c => (
										<MenuItem value={c.address}>
											{c.address}
										</MenuItem>
									))}

								</TextField>
							</Stack>
						</Stack>
					</Card>
					<Stack justifyContent="space-between" direction="row">
						<Button fullWidth variant="contained" onClick={createWebsite}>
							Create
						</Button>
					</Stack>
				</Stack>
			</Container>
		</Fade>
	)
};

export default Website;
