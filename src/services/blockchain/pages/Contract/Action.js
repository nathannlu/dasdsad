import React, { useState } from 'react';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { Fade, Container, Link, TextField, Stack, Box, Grid, Typography, Button, Divider } from 'ds/components';
import { useSetWhitelist } from 'services/blockchain/gql/hooks/contract.hook.js';
import { useWeb3 } from 'libs/web3';
import { Chip } from '@mui/material';
import { useToast } from 'ds/hooks/useToast';

import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import { WarningAmber as WarningAmberIcon, SwapVert as SwapVertIcon, Payment as PaymentIcon, Upload as UploadIcon } from '@mui/icons-material';

import Details from './Details';

const Complete = ({id, contract}) => {
	const [owners, setOwners] = useState([]);
	const [airdropList, setAirdropList] = useState('');
	const [whitelistAddresses,setWhitelistAddresses] = useState('');
	const [maxPerMintCount, setMaxPerMintCount] = useState('');
	const [newPrice, setNewPrice] = useState('');

	
	const [setWhitelist] = useSetWhitelist({})

    const [embedChainId, setEmbedChainId] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [newMetadataUrl, setNewMetadataUrl] = useState('');
    const { addToast } = useToast();

	const {
		getBalance,
		checkOwner,
		withdraw,
		mint,
		presaleMint,
		setMaxPerMint,
		openSales,
		openPresale,
		updateBaseUri,
        contractState,
        getContractState,
		presaleState,
		getPresaleState,
		airdrop,
		setWhitelist: setContractWhitelist,
		setCost,
	} = useWeb3()

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



	return (
								<>
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
							<Typography variant="small">
								Set the max per mint
							</Typography>
							<Stack direction="row">
								<TextField 
									size="small"
									placeholder="5" 
									onChange={e => setMaxPerMintCount(e.target.value)}
								/>
								<Button size="small" variant="contained" onClick={() => {
									setMaxPerMint(contract.address, maxPerMintCount)
								}}>
									<UploadIcon />
								</Button>
							</Stack>
						</Stack>

						<Stack gap={1}>
							<Typography variant="small">
								Update NFT cost
							</Typography>
							<Stack direction="row">
								<TextField 
									size="small"
									placeholder="5" 
									onChange={e => setNewPrice(e.target.value)}
								/>
								{contract.nftCollection.currency}

								<Button size="small" variant="contained" onClick={() => {
									setCost(contract.address, newPrice)
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
									placeholder={`0x123\n0x456\n0x789`}
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

						</>
	)
};

export default Complete;
