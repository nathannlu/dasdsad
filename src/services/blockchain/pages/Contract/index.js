import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useWeb3 } from 'libs/web3';
import { useContract } from 'services/blockchain/provider';
import { Fade, Container, Link, TextField, Stack, Box, Grid, Typography, Button, Divider } from 'ds/components';
import { Textfield } from '@mui/material'
import { SwapVert as SwapVertIcon, Payment as PaymentIcon, Upload as UploadIcon } from '@mui/icons-material';
import { useToast } from 'ds/hooks/useToast';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const Upload = (props) => {
	const [balance, setBalance] = useState(null)
	const [owners, setOwners] = useState([]);
	const [soldCount, setSoldCount] = useState(null)
	const [contract, setContract] = useState({});
	const [price, setPrice] = useState();
    const [embedChainId, setEmbedChainId] = useState('');
    const [embedCode, setEmbedCode] = useState('');
	const { id } = useParams();
	const [newMetadataUrl, setNewMetadataUrl] = useState('');
    const { addToast } = useToast();

	const { contracts } = useContract();
	const { 
		retrieveContract,
		loadWeb3,
		loadBlockchainData,
		withdraw,
		getBalance,
		mint,
		checkOwner,
		getTotalMinted,
		updateBaseUri,
		getBaseUri
	} = useWeb3()

	useEffect(() => {
		(async () => {
			await loadWeb3()
			await loadBlockchainData()
		})()
	}, [])

	useEffect(() => {
		if(contracts.length > 0) {
			(async () => {
				const c = contracts.find(c => c.id == id)
				setContract(c)

                let chainId;
                if (c.blockchain === 'ethereum') chainId = '0x1'
                else if (c.blockchain === 'rinkeby') chainId = '0x4'
                else if (c.blockchain === 'polygon') chainId = '0x89'
                else if (c.blockchain === 'mumbai') chainId = '0x13881'
                setEmbedChainId(chainId);

                setEmbedCode(`<iframe
                src="http://${window.location.hostname.indexOf('localhost') === -1 ? window.location.hostname : `${window.location.hostname}:3000`}/smart-contracts/embed?contract=${c.address}&chainId=${chainId}"
                width="300px"
                height="100px"
                frameborder="0"
                scrolling="no"
            />`);

				const b = await getBalance(c.address)
				setBalance(b);
				setPrice(c.nftCollection.price);

				const nftsSold = b / c.nftCollection.price

				if(b == 0) {
					setSoldCount(0)
				} else {
					setSoldCount(nftsSold)
				}

				let list = [];
				for (let i = 0; i < nftsSold; i++) {
					const o = await checkOwner(i, c.address)
					setOwners(prevState => {
						prevState.push(o)
						return [...prevState]
					})
				}
			})()
		}
	},[contracts])

	const mintNow = async () => {
		await mint(contract.nftCollection.price.toString(), contract.address)
	}

    const copyEmbedCode = () => {
        navigator.clipboard.writeText(embedCode);
        addToast({
            severity: 'info',
            message: 'Embed code copied to clipboard'
        })
    }

	return (
		<Fade in>
			<Container>
				<Stack py={2} gap={5}>
					<Stack direction="column" gap={2}>
						<Box>
							<img 
								style={{height: '40px'}}
								src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d2aac6943de77b8cf95ef1_deploy-to-blockchain-icon.png" 
							/>
						</Box>
						<Box>
							<Typography variant="h4">
								Contract overview
							</Typography>
							<Typography variant="body">
								Your deployed smart-contract's address on the blockchain
							</Typography>
						</Box>
						<Box>
							<Box sx={{
								px:1,
								py:.5,
								bgcolor: 'grey.100', 
								fontWeight:'bold', 
								border: '0.5px solid rgba(0,0,0,.1)',
								borderRadius: 2,
							}}>
								{contract.address ? contract.address : 'asd'}
							</Box>
						</Box>
						<Box>
							<Link to="https://opensea.io/get-listed/step-two" target="_blank">
								Connect with OpenSea
							</Link>
						</Box>
					</Stack>
					<Divider />
					<Stack>
						<Typography variant="h6" sx={{fontWeight:'bold'}}>
							Details
						</Typography>

						<Grid container>
							<Grid item xs={6}>
								Balance:
							</Grid>
							<Grid sx={{fontWeight:'bold'}} item xs={6}>
								{balance}ETH
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
								{price}ETH
							</Grid>
							<Grid item xs={6}>
								Collection size:
							</Grid>
							<Grid sx={{fontWeight:'bold'}} item xs={6}>
								{contract?.nftCollection ? contract?.nftCollection?.size : null}
							</Grid>
						</Grid>

					</Stack>
					<Divider />
					<Stack gap={2}>
						<Typography variant="h6" sx={{fontWeight:'bold'}}>
							Interact
						</Typography>
						<Stack direction="row" gap={2}>
							<Button 
								startIcon={<SwapVertIcon />}
								size="small" 
								variant="contained" 
								onClick={() => withdraw(contract.address)}
							>
								Pay out to bank
							</Button>
							<Button 
								startIcon={<PaymentIcon />}
								size="small"
								variant="contained"
								onClick={() => mintNow()}
							>
								Mint
							</Button>
						</Stack>
						<Stack gap={1}>
							<Typography variant="small">
								Update where your NFT collection metadata folder points to. Updating this may break your collection.
							</Typography>
							<Stack direction="row">
								<TextField 
									size="small"
									placeholder="New metadata URL" 
									onChange={e => setNewMetadataUrl(e.target.value)}
								/>
								<Button size="small" variant="contained" onClick={() => {
									updateBaseUri(newMetadataUrl, contract.address)
								}}>
									<UploadIcon />
								</Button>
							</Stack>
						</Stack>
					</Stack>
						
					<Stack sx={{background: '#eee', borderRadius: 2, p:2}}>
						<Typography variant="h6">
							Addresses who own your NFT
						</Typography>
						<Box>
							{owners.map((addr, idx) => (
								<div key={idx}>
									{addr}
								</div>
							))}
						</Box>
					</Stack>

                    <Divider />
                    <Stack gap={2} alignItems='flex-start'>
                        <Typography variant="h6" sx={{fontWeight:'bold'}}>
							Embed
						</Typography>
                        <Box
                            display='flex'
                        >
                            <Box
                                flex='1'
                                display='flex'
                                flexDirection='column'
                            >
                                <Typography>
                                    Code:
                                </Typography>
                                <TextField
                                    sx={{
                                        width: '600px',
                                        mb: '1em'
                                    }}
                                    rows={8}
                                    multiline
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    value={embedCode}
                                />
                                <Button
                                    variant='outlined'
                                    endIcon={<ContentCopyIcon />}
                                    onClick={copyEmbedCode}
                                >
                                    Copy to clipboard
                                </Button>
                            </Box>
                            <Box
                                sx={{ ml: '1em' }}
                                display='flex'
                                flexDirection='column'
                            >
                                <Typography>
                                    Preview:
                                </Typography>
                                <Box>
                                    <iframe
                                        src={`http://${window.location.hostname.indexOf('localhost') === -1 ? window.location.hostname : `${window.location.hostname}:3000`}/smart-contracts/embed?contract=${contract.address}&chainId=${embedChainId}`}
                                        width="300px"
                                        height="100px"
                                        frameBorder="0"
                                        scrolling="no"
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Stack>
				</Stack>
			</Container>
		</Fade>
	)
};

export default Upload;
