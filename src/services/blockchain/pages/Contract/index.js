import React, { useState, useEffect } from 'react';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { useParams } from "react-router-dom";
import { useWeb3 } from 'libs/web3';
import { useContract } from 'services/blockchain/provider';
import { Fade, Container, Link, TextField, Stack, Box, Grid, Typography, Button, Divider } from 'ds/components';
import { useSetWhitelist } from 'services/blockchain/gql/hooks/contract.hook.js';
import { Chip } from '@mui/material';
import { WarningAmber as WarningAmberIcon, SwapVert as SwapVertIcon, Payment as PaymentIcon, Upload as UploadIcon } from '@mui/icons-material';

import IPFSModal from './IPFSModal';
import NotComplete from './NotComplete';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';



import { useToast } from 'ds/hooks/useToast';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const Upload = (props) => {
	const [balance, setBalance] = useState(null)
	const [owners, setOwners] = useState([]);
	const [soldCount, setSoldCount] = useState(null)
	const [airdropList, setAirdropList] = useState('');
	const [whitelistAddresses,setWhitelistAddresses] = useState('');
	
	const [setWhitelist] = useSetWhitelist({})

	const [contract, setContract] = useState({});
	const [price, setPrice] = useState();
    const [embedChainId, setEmbedChainId] = useState('');
    const [embedCode, setEmbedCode] = useState('');
	const { id } = useParams();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [newMetadataUrl, setNewMetadataUrl] = useState('');
    const { addToast } = useToast();

	const isSetupComplete = contract?.nftCollection?.baseUri && contract?.address ? true : false

	const { contracts } = useContract();
	const {
		loadWeb3,
		loadBlockchainData,
		getBalance,
		checkOwner,
		withdraw,
		mint,
		presaleMint,
		openSales,
		openPresale,
		updateBaseUri,
        contractState,
        getContractState,
		presaleState,
		getPresaleState,
		airdrop,
		setWhitelist: setContractWhitelist
	} = useWeb3()

	useEffect(() => {
		(async () => {
			await loadWeb3();
			await loadBlockchainData();
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
                src="https://${window.location.hostname.indexOf('localhost') === -1 ? window.location.hostname : `${window.location.hostname}:3000`}/smart-contracts/embed?contract=${c.address}&chainId=${chainId}"
                width="350px"
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

                // Get sales status
                await getContractState(c.address);
                await getPresaleState(c.address);

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
		await mint(contract.nftCollection.price.toString(), contract.address);
	}

	const setMerkleRoot = () => {
		const addresses = whitelistAddresses.split('\n');
		const leafNodes = addresses.map(addr => keccak256(addr));	
		const merkleTree = new MerkleTree(leafNodes,keccak256, { sortPairs: true });
		const root = merkleTree.getRoot()

		setContractWhitelist(contract.address, root)

		// @TODO move this to set contract whitelist callback 
		setWhitelist({ variables: {id, whitelist: addresses }});
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
							<Chip label={contract?.blockchain} />

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
							<Typography variant="body">
								Status:
							</Typography>
							{!isSetupComplete ? (
								<Chip icon={<WarningAmberIcon />} color="warning" label="Set up required" />
							) : (
								<Chip color="success" label="Live on blockchain" />
							)}
						</Box>
						{contract?.address && (
						<Stack direction="column" gap={2}>
							<Box>
								<Box sx={{
									px:1,
									py:.5,
									bgcolor: 'grey.100', 
									fontWeight:'bold', 
									border: '0.5px solid rgba(0,0,0,.1)',
									borderRadius: 2,
								}}>
									{contract.address ? contract.address : null}
								</Box>
							</Box>
							<Box>
								<a href="https://opensea.io/get-listed/step-two" target="_blank">
									<Button>
										Connect with OpenSea
									</Button>
								</a>
							</Box>
						</Stack>
						)}


					</Stack>
					{!isSetupComplete ? (
						<NotComplete 
							id={id}
							contract={contract} 
							setIsModalOpen={setIsModalOpen} 
						/>
					) : (
						<>
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
                            {contractState ? (
                                <Button 
                                    startIcon={<LockIcon />}
                                    size="small"
                                    variant="contained"
                                    onClick={() => openSales(contract.address, false)}
                                    color='error'
                                >
                                    Close Public Sales
                                </Button>
                            ) : (
                                <Button 
                                    startIcon={<LockOpenIcon />}
                                    size="small"
                                    variant="contained"
                                    onClick={() => openSales(contract.address)}
                                >
                                    Open Public Sales
                                </Button>
                            )}
                            {presaleState ? (
                                <Button 
                                    startIcon={<LockIcon />}
                                    size="small"
                                    variant="contained"
                                    onClick={() => openPresale(contract.address, false)}
                                    color='error'
                                >
                                    Close Pre-Sales
                                </Button>
                            ) : (
                                <Button 
                                    startIcon={<LockOpenIcon />}
                                    size="small"
                                    variant="contained"
                                    onClick={() => openPresale(contract.address)}
                                >
                                    Open Pre-Sales
                                </Button>
                            )}

                            <Button 
                                startIcon={<PaymentIcon />}
                                size="small"
                                variant="contained"
                                onClick={() => mintNow()}
                                disabled={!contractState}
                            >
                                Mint
                            </Button>
                            <Button 
                                startIcon={<PaymentIcon />}
                                size="small"
                                variant="contained"
                                onClick={() => presaleMint(
																	contract.nftCollection.price.toString(), 
																	contract.address,
																	contract.nftCollection.whitelist)}
//                                disabled={!contractState}
                            >
                                Presale Mint
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


						<Stack gap={1}>
							<Typography variant="body" sx={{fontWeight:'bold'}}>
								Airdrop
							</Typography>
							<Typography variant="small">
								Please make sure there are no extra spaces, commas, or line breaks in your list.
							</Typography>
							<Stack direction="row">
								<TextField 
									sx={{width: '500px'}}
									multiline
									rows={7}
									size="small"
									onChange={e => setAirdropList(e.target.value)}
									placeholder={`0x123\n0x456\n0x789`}
								/>
								<Box>
									<Button size="small" variant="contained" onClick={() => {
										airdrop(contract.address, airdropList.split("\n"))
									}}>
										<UploadIcon />
									</Button>
								</Box>

							</Stack>
						</Stack>

						<Stack gap={1}>
							<Typography variant="body" sx={{fontWeight:'bold'}}>
								Set whitelist
							</Typography>
							<Typography variant="small">
								Paste <u>every</u> address you would like to enable presale for. Please make sure there are no extra spaces, commas, or line breaks in your list.
							</Typography>
							<Stack direction="row">
								<TextField 
									sx={{width: '500px'}}
									multiline
									rows={7}
									size="small"
									onChange={e => setWhitelistAddresses(e.target.value)}
								/>
								<Box>
									<Button size="small" variant="contained" onClick={() => {
										setMerkleRoot(whitelistAddresses)
									}}>
										<UploadIcon />
									</Button>
								</Box>

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
                                        src={`https://${window.location.hostname.indexOf('localhost') === -1 ? window.location.hostname : `${window.location.hostname}:3000`}/smart-contracts/embed?contract=${contract.address}&chainId=${embedChainId}`}
                                        width="350px"
                                        height="100px"
                                        frameBorder="0"
                                        scrolling="no"
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Stack>

						</>
					)}
				</Stack>
				<IPFSModal id={id} contract={contract} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
			</Container>
		</Fade>
	)
};

export default Upload;
