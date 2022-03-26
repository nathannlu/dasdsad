import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, LoadingButton, IconButton, FormLabel, TextField, Divider, Fade, Grid, Stack, Container, Typography, Card } from 'ds/components';
import { AppBar, Toolbar } from '@mui/material';
import { useContract } from 'services/blockchain/provider';
import { useCreateContract } from 'services/blockchain/gql/hooks/contract.hook';
import { useDeployContractForm } from './hooks/useDeployContractForm';
import StepWizard from 'react-step-wizard';
import CloseIcon from '@mui/icons-material/Close';
import { useWeb3 } from "libs/web3";
import { useToast } from "ds/hooks/useToast";

const blockchains = [
	{ title: 'Ethereum', value:'ethereum', img: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'},
	{ title: 'Polygon', value:'polygon', img: 'https://cryptologos.cc/logos/polygon-matic-logo.png'},
	{ title: 'Solana', value: 'solana', img: 'https://cryptologos.cc/logos/solana-sol-logo.png'},
	{ title: 'Ethereum Testnet', value:'rinkeby', img: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'},
	{ title: 'Polygon Testnet', value:'mumbai', img: 'https://cryptologos.cc/logos/polygon-matic-logo.png'},
	{ title: 'Solana devnet', value: 'solanadevnet', img: 'https://cryptologos.cc/logos/solana-sol-logo.png'},
	/*
	{ title: 'Solana', value: 'solana', img: 'https://www.pngall.com/wp-content/uploads/10/Solana-Crypto-Logo-PNG-File.png'},
	*/
];

const Upload = () => {
    const { addToast } = useToast();
    const { wallet } = useWeb3();
	const [activeStep, setActiveStep] = useState();
	const history = useHistory();
	const {
		selectInput,
		setSelectInput
	} = useContract();
	const { 
		deployContractForm: {
			name,
			symbol,
			priceInEth,
			maxSupply,
		},
		onCompleted
	} = useDeployContractForm();
	const [createContract, { loading }] = useCreateContract({
		onCompleted
	});

    const onCreateContract = async () => {
        try {
            if ((wallet === 'metamask' || wallet === 'default') && selectInput === 'solanadevnet') throw new Error('You must login with a phantom wallet to deploy a solana contract');

            const currencyMap = {
                'ethereum': 'eth',
                'rinkeby': 'eth',
                'polygon': 'matic',
                'mumbai': 'matic',
                'solana': 'sol',
                'solanadevnet': 'sol',
            }
            
            const ContractInput = {
                name: name.value,
                symbol: symbol.value,
                blockchain: selectInput,
                type: 'whitelist',
                nftCollection: {
                    price: parseFloat(priceInEth.value),
                    size: parseInt(maxSupply.value),
                    currency: currencyMap[selectInput],
                }
            }
            await createContract({ variables: { contract: ContractInput}});
        }
        catch (err) {
            addToast({
				severity: "error",
				message: err.message,
			})
        }
    }

	return (
		<Fade in>
			<Grid 
				container
				sx={{
					minHeight: '100vh',
					overflow: 'hidden',
					bgcolor: '#fff',
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
								Create a contract
							</Typography>
						</Box>
					</Stack>
				</AppBar>

				<Grid md={6} item sx={{transition: 'all .5s', mx:'auto'}}>
					<Stack gap={2} py={4}>
						<Stack>
							<Typography gutterBottom variant="h4">
								Create ERC-721 smart contract
							</Typography>
							<Typography gutterBottom variant="body">
								Fill in and configure your smart contracts
							</Typography>
						</Stack>
						<Stack sx={{flex: 1}}>
							<FormLabel sx={{fontWeight:'bold'}}>
								Name
							</FormLabel>
							<Typography gutterBottom variant="body2">
								Set the name for your collection
							</Typography>
							<TextField {...name} fullWidth />
						</Stack>
						<Stack gap={2} direction="row">
							<Stack sx={{flex: 1}}>
								<FormLabel sx={{fontWeight:'bold'}}>
									Symbol
								</FormLabel>
								<Typography gutterBottom variant="body2">
									Set the symbol for your collection.
								</Typography>
								<TextField {...symbol} fullWidth />
							</Stack>
						</Stack>

						<Stack gap={2} direction="row">
							<Stack sx={{flex: 1}}>
								<FormLabel sx={{fontWeight:'bold'}}>
									Price per NFT minted
								</FormLabel>
								<Typography gutterBottom variant="body2">
									Set the price in ether for minting one NFT.
								</Typography>
								<TextField {...priceInEth} fullWidth />
							</Stack>

							<Stack sx={{flex: 1}}>
								<FormLabel sx={{fontWeight:'bold'}}>
									Total number of NFTs
								</FormLabel>
								<Typography gutterBottom variant="body2">
									Set the total number of NFTs in your collection
								</Typography>
								<TextField {...maxSupply} fullWidth />
							</Stack>
						</Stack>


						<Stack pt={2} gap={2}>
							<FormLabel sx={{fontWeight:'bold'}}>
								Select your blockchain
							</FormLabel>
							{blockchains.map((item, i) => (
								<Card
									sx={{
										border: item.value == selectInput && 2,
										borderColor: item.value == selectInput && 'primary.main',
										borderRadius: 2,
										transition: '.2s all',
										color: item.value == selectInput && 'primary.main',
										opacity: item.value != selectInput && .8
									}}
									onClick={() =>setSelectInput(item.value)} 
									key={i}
								>
									<Stack direction="row" alignItems="center" gap={2} p={2}>
										<img
											style={{width: '50px'}}
											src={item.img}
										/>
										<Typography variant="body" sx={{fontWeight:'bold'}}>
											Deploy on {item.title}
										</Typography>
									</Stack>
								</Card>
							))}
						</Stack>

						<Stack mt={2}>
							<LoadingButton 
								loading={loading}
								onClick={onCreateContract} 
								variant="contained"
							>
								Create contract
							</LoadingButton>
						</Stack>

					</Stack>

				</Grid>
			</Grid>
		</Fade>
	)
};

export default Upload;
