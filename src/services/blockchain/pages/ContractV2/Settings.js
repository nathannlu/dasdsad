import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import {
	TextField,
	Stack,
	Box,
	Grid,
	Card,
	Typography,
	Button,
	CircularProgress
} from 'ds/components';
import {
	LockOpen as LockOpenIcon,
	Lock as LockIcon,
	SwapVert as SwapVertIcon,
	// Payment as PaymentIcon,
	// Upload as UploadIcon,
} from '@mui/icons-material';

import { Skeleton } from '@mui/material';

import { useContractActions } from './hooks/useContractActions';

import { ContractDetails } from '../../widgets';

const actions = [
	{ title: 'Update metadata url', value: 'newMetadataUrl' },
	{ title: 'Update max per mint', value: 'max' },
	{ title: 'Update max per wallet', value: 'maxWallet' },
	{ title: 'Update price', value: 'price' },
	{ title: 'Airdrop addresses', value: 'airdrop' },
	{ title: 'Set whitelist', value: 'whitelist' },
];

const Settings = ({ contract, contractController, contractState }) => {
	const {
		actionForm: { airdropList, whitelistAddresses, maxPerMintCount, newPrice, newMetadataUrl, maxPerWalletCount, },
		withdraw,
		setOpenSales,
		setOpenPresale,
		updateReveal,
		setMaxPerMint,
		setMaxPerWallet,
		setCost,
		setAirdropList,
		setMerkleRoot,
		isSaving
	} = useContractActions();

	// const [airdropList, setAirdropList] = useState('');
	const [selectedUpdate, setSelectedUpdate] = useState('newMetadataUrl');

	// const contractAddress = '0xd4975541438a06e5b6dc7dd2d5bc646aed652616'

	// @TODO wire wallet address
	// const walletAddress = '0xfd6c3bD6dB6D7cbB77Ee64d1E406B2ACB63A5166';
	const walletAddress = '0x1ADb0A678F41d4eD91169D4b8A5B3C149b92Fc46';

	// const impl = '0x65Cf89C53cC2D1c21564080797b47087504a3815';

	const { id } = useParams();

	// const blockchain = 'ethereum';
	// const version = 'erc721a';

	// const contract = new ContractController(contractAddress, blockchain, version)

	// const setMetadataUrl = () => {
	// 	const ipfsUri = 'ipfs://QmY3ru7ZeAihUU3xexCouSrbybaBV1hPe5EwvNqph1AYdS/'
	// 	contract.updateReveal(from, true, ipfsUri)
	// }

	if (!contractState || !contractController) {
		return (
			<Box>
				<Stack mt={8}>
					<ContractDetails contract={contract} />
					<Grid sx={{ maxWidth: 600, width: 'auto' }} xs={12} item pr={2}>
						<Stack gap={1} mt={4}>
							{actions.map((action, i) => (
								<Card
									key={i}
									sx={{
										p: 2,
										borderRadius: 2,
										cursor: 'pointer',
										background:
											selectedUpdate ==
											action.value &&
											'#42a5f520',
										color:
											selectedUpdate ==
											action.value &&
											'primary.main',
										transition: '.2s all',
									}}
									variant="contained">
									<Typography> {action.title} </Typography>
									<Skeleton />
								</Card>
							))}
						</Stack>
					</Grid>
				</Stack>
			</Box>
		);
	}

	return (
		<Box>
			<Stack mt={8}>
				<ContractDetails contract={contract} />
				<Box mt={4}>
					<Grid container>
						<Grid xs={3} item pr={2}>
							<Stack gap={1}>
								{actions.map((action, i) => (
									<Card
										key={i}
										sx={{
											p: 2,
											borderRadius: 2,
											cursor: 'pointer',
											background: isSaving && 'rgba(0, 0, 0, 0.06)' || selectedUpdate === action.value && '#42a5f520',
											color: isSaving && 'rgba(0, 0, 0, 0.87)' || selectedUpdate === action.value && 'primary.main',
											transition: '.2s all'
										}}
										style={{ pointerEvents: isSaving && 'none' || undefined }}
										onClick={() => {
											if (isSaving) {
												return;
											}
											setSelectedUpdate(action.value);
										}}
										variant="contained"
									>
										<Typography> {action.title} </Typography>
									</Card>
								))}
							</Stack>
						</Grid>

						<Grid xs={9} md={6} item>
							<Stack>
								{{
									newMetadataUrl: (
										<Stack direction="column">
											<TextField size="small" value={contractState?.metadataUrl} {...newMetadataUrl} />

											<Button
												sx={{ width: 'max-content', my: 2, ml: 'auto' }}
												size="small"
												variant="contained"
												onClick={() => updateReveal(contractController, walletAddress)}
												disabled={isSaving}
											>
												{isSaving && <CircularProgress isButtonSpinner={true} /> || null}
												UPDATE
											</Button>

										</Stack>
									),
									max: (
										<Stack direction="column">
											<TextField size="small" value={contractState?.maxPerMint}  {...maxPerMintCount} />

											<Button
												sx={{ width: 'max-content', my: 2, ml: 'auto' }}
												size="small"
												variant="contained"
												onClick={() => setMaxPerMint(contractController)}
												disabled={isSaving}
											>
												{isSaving && <CircularProgress isButtonSpinner={true} /> || null}
												UPDATE
											</Button>
										</Stack>
									),
									maxWallet: (
										<Stack direction="column">
											<TextField size="small" value={contractState?.maxPerWallet} {...maxPerWalletCount} />

											<Button
												sx={{ width: 'max-content', my: 2, ml: 'auto' }}
												size="small"
												variant="contained"
												onClick={() => setMaxPerWallet(contractController)}
												disabled={isSaving}
											>
												{isSaving && <CircularProgress isButtonSpinner={true} /> || null}
												UPDATE
											</Button>
										</Stack>
									),
									price: (
										<Stack direction="column">
											<TextField
												size="small"
												InputProps={{ endAdornment: contract.nftCollection.currency }}
												value={contractState?.price}
												{...newPrice}
											/>

											<Button
												sx={{ width: 'max-content', my: 2, ml: 'auto' }}
												size="small"
												variant="contained"
												onClick={() => setCost(contractController)}
												disabled={isSaving}
											>
												{isSaving && <CircularProgress isButtonSpinner={true} /> || null}
												UPDATE
											</Button>
										</Stack>
									),
									airdrop: (
										<Stack direction="column">
											<TextField
												sx={{ maxWidth: '600px' }}
												multiline
												rows={7}
												size="small"
												value={contractState?.metadataUrl}
												{...airdropList}
											/>
											<Button
												sx={{ width: 'max-content', my: 2, ml: 'auto' }}
												size="small"
												variant="contained"
												onClick={() => setAirdropList(contractController)}
												disabled={isSaving}
											>
												{isSaving && <CircularProgress isButtonSpinner={true} /> || null}
												UPDATE
											</Button>
										</Stack>
									),
									whitelist: (
										<Stack direction="column">
											<TextField
												sx={{ maxWidth: '600px' }}
												multiline
												rows={7}
												size="small"
												value={contractState?.metadataUrl}
												{...whitelistAddresses}
											/>
											<Button
												sx={{ width: 'max-content', my: 2, ml: 'auto' }}
												size="small"
												variant="contained"
												onClick={() => setMerkleRoot(id)}
												disabled={isSaving}
											>
												{isSaving && <CircularProgress isButtonSpinner={true} /> || null}
												UPDATE
											</Button>
										</Stack>
									),
								}[selectedUpdate]}
							</Stack>
						</Grid>
					</Grid>

					{/*
			<Overview setIsModalOpen={setIsModalOpen} />

			<button onClick={()=>contract.mint(from, 1)}>
				Mint
			</button>
			*/}

					{/* <button onClick={() => setMetadataUrl()}>
					Set metadata URL
				</button> */}

					{/* <button onClick={() => airdropAddresses()}>
						airdrop
					</button>

					<TextField
						sx={{ width: '500px' }}
						multiline
						rows={7}
						size="small"
						onChange={e => setAirdropList(e.target.value)}
					/> */}


					{/* @TODO wiring solana */}

					{/* <Stack direction="row" gap={2}>
					<Button
						startIcon={<SwapVertIcon />}
						size="small"
						variant="contained"
						onClick={() => withdraw(wallet, env)}>
						Close smart contract &amp; withdraw rent
					</Button>

					{/* @TODO wiring */}
					{/* <Button
							startIcon={<PaymentIcon />}
							size="small"
							variant="contained"
							onClick={() => mint(1, wallet, env)}>
							Mint
						</Button>
				</Stack> */}
				
					<Stack direction="row" gap={2} mt={4}>
						<Button
							startIcon={<SwapVertIcon />}
							size="small"
							variant="contained"
							onClick={() => withdraw()}>
							Pay out to bank
						</Button>

						{contractState?.isPublicSaleOpen ? (
							<Button
								startIcon={<LockIcon />}
								size="small"
								variant="contained"
								onClick={() => setOpenSales(false)}
								color="error"
							>
								Close Public Sales
							</Button>
						) : (
							<Button
								startIcon={<LockOpenIcon />}
								size="small"
								variant="contained"
								onClick={() => setOpenSales(true)}
							>
								Open Public Sales
							</Button>
						)}

						{contractState?.isPresaleOpen ? (
							<Button
								startIcon={<LockIcon />}
								size="small"
								variant="contained"
								onClick={() => setOpenPresale(false)}
								color="error"
							>
								Close Pre-Sales
							</Button>
						) : (
							<Button
								startIcon={<LockOpenIcon />}
								size="small"
								variant="contained"
								onClick={() => setOpenPresale(true)}
							>
								Open Pre-Sales
							</Button>
						)}

						{/* @TODO wire minting 
						
						<Button
							startIcon={<PaymentIcon />}
							size="small"
							variant="contained"
							onClick={() => mint(1)}
							disabled={!isPublicSaleOpen}>
							Mint
						</Button>
						<Button
							startIcon={<PaymentIcon />}
							size="small"
							variant="contained"
							onClick={() =>
								presaleMint(
									contract.nftCollection.whitelist || ['']
								)
							}
							disabled={!isPresaleOpen}>
							Presale Mint
						</Button> */}
					</Stack>
				</Box>
			</Stack>
		</Box>
	);
};

export default Settings;
