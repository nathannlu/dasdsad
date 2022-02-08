import React, { useState, useEffect } from 'react';
import { Container, Divider, Button, IconButton, Stack, Card, Typography, FormLabel, TextField, Box, Grid, Fade, MenuItem, LoadingButton } from 'ds/components';
import { AppBar, Toolbar } from '@mui/material';
import { useCreateWebsite } from 'services/website/gql/hooks/website.hook';
import { useContract } from 'services/blockchain/provider';
import { useGetContracts } from 'services/blockchain/gql/hooks/contract.hook';
import { useToast } from 'ds/hooks/useToast';
import { useHistory } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

const Website = props => {
	const [contracts, setContracts] = useState([]);
	const [websiteTitle, setWebsiteTitle] = useState('');
	const [selectInput, setSelectInput] = useState('Select your contract');
	const { addToast } = useToast();
	const history = useHistory();

	const [createWebsite] = useCreateWebsite({ 
		title: websiteTitle,
		contractAddress: selectInput,
		onCompleted: data => {
			addToast({
				severity: 'success',
				message: 'Website created',
			});
			history.push('/websites');
		}
	});

	useGetContracts({
		onCompleted: data => {
            const availableContracts =  data.getContracts.filter((contract) => {
                return contract.address;
            })
            if (!availableContracts.length) return;
            setContracts(availableContracts);
			setSelectInput(availableContracts[0].address);
		}
	})

	const onSubmit = () => {
        try {
            if (!websiteTitle.length) throw new Error('Website subdomain must be filled');
            if (!selectInput.length || selectInput === 'Select your contract') throw new Error('You must choose a contract');

            createWebsite();
        }
        catch (e) {
            addToast({
				severity: 'error',
				message: e.message,
			});
        }
	}

	return (
		<Fade in>
			<Grid 
				container
				sx={{
					minHeight: '100vh',
					overflow: 'hidden',
					bgcolor: 'white',
					position: 'absolute',
					zIndex: 1100,
					top: 0,
					paddingTop: '67px'
				}}
			>
				<AppBar position="fixed" sx={{bgcolor: 'grey.100', py: 2, boxShadow: 'none', borderBottom: '1px solid rgba(0,0,0,.2)', color: '#000'}}>
					<Stack direction="row" px={2} gap={2} alignItems="center">
						<IconButton onClick={() => history.goBack()}>
							<CloseIcon sx={{fontSize: '18px'}} />
						</IconButton>
						<Divider sx={{height: '20px', borderWidth: .5}} orientation="vertical" />
						<Box>
							<Typography variant="body">
								Create a website
							</Typography>
						</Box>
					</Stack>
				</AppBar>

				<Container>
					<Stack pt={3} gap={3}>
						<Stack>
							<Typography variant="h4">
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
								{contracts.map((c, idx) => (
									<MenuItem 
										key={idx} 
										value={c.address}
									>
										{c.address}
									</MenuItem>
								))}

							</TextField>
						</Stack>

						<Stack justifyContent="space-between" direction="row">
							<Button fullWidth variant="contained" onClick={onSubmit}>
								Create
							</Button>
						</Stack>
					</Stack>
				</Container>
			</Grid>
		</Fade>
	)
};

export default Website;
