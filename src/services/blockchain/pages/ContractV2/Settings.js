import React, { useState, useEffect } from 'react';
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

import { useContractSettings } from './hooks/useContractSettings';

import { ContractDetails, EmptyAddressList, AddressList } from '../../widgets';
import AppDialog from '../../widgets/AppDialog';
import CSVWidget from '../../widgets/CSVWidget';

const actions = [
	{ title: 'Update metadata url', value: 'metadataUrl' },
	{ title: 'Airdrop addresses', value: 'airdrop' },
	{ title: 'Set whitelist', value: 'whitelist' },
];

const Settings = ({ contract, contractController, contractState, setContractState }) => {
	const {
		actionForm: { maxPerMint, maxPerWallet, newPrice, metadataUrl },
		withdraw,
		setPublicSales,
		setPresales,
		updateReveal,
		setMaxPerMint,
		setMaxPerWallet,
		setPrice,

		airdrop,
		setWhitelistAddresses,
		setAirdropAddresses,

		isSaving,
		whitelistAddresses,
		airdropAddresses
	} = useContractSettings();

	const [selectedUpdate, setSelectedUpdate] = useState('metadataUrl');

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

	const methodProps = { contractController, setContractState, walletAddress, contractId: id };

	useEffect(() => {
		setMaxPerMint(contractState?.maxPerMint || '1');
		setMaxPerWallet(contractState?.maxPerWallet || '1');
		setPrice(contractState?.price || '1');
		setWhitelistAddresses(contract?.nftCollection?.whitelist || []);
	}, []);

	const cardStyle = {
		maxWidth: 760,
		boxShadow: "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
		padding: 3,
		borderRadius: 4
	};

	const [state, setState] = React.useState({
		isWhitelistAddressDialogOpen: false,
		isAirdropDialogOpen: false
	});

	const toggleWhitelistAddressDialog = (isWhitelistAddressDialogOpen) => setState(prevState => ({ ...prevState, isWhitelistAddressDialogOpen }));
	const toggleAirdropDialog = (isAirdropDialogOpen) => setState(prevState => ({ ...prevState, isAirdropDialogOpen }));

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
									metadataUrl: (
										<Stack direction="column">
											<TextField
												{...metadataUrl}
												size="small"
												value={contractState?.metadataUrl}
											/>

											<Button
												sx={{ width: 'max-content', my: 2, ml: 'auto' }}
												size="small"
												variant="contained"
												onClick={() => updateReveal(methodProps)}
												disabled={isSaving}
											>
												{isSaving && <CircularProgress isButtonSpinner={true} /> || null}
												UPDATE
											</Button>

										</Stack>
									),
									// airdrop: (
									// 	<Stack direction="column">
									// 		<TextField
									// 			sx={{ maxWidth: '600px' }}
									// 			multiline
									// 			rows={7}
									// 			size="small"
									// 			value={contractState?.metadataUrl}
									// 			{...airdropList}
									// 		/>
									// 		<Button
									// 			sx={{ width: 'max-content', my: 2, ml: 'auto' }}
									// 			size="small"
									// 			variant="contained"
									// 			onClick={() => setAirdropList(methodProps)}
									// 			disabled={isSaving}
									// 		>
									// 			{isSaving && <CircularProgress isButtonSpinner={true} /> || null}
									// 			UPDATE
									// 		</Button>
									// 	</Stack>
									// ),
									// whitelist: (
									// 	<Stack direction="column">
									// 		<TextField
									// 			sx={{ maxWidth: '600px' }}
									// 			multiline
									// 			rows={7}
									// 			size="small"
									// 			value={contractState?.metadataUrl}
									// 			{...whitelistAddresses}
									// 		/>
									// 		<Button
									// 			sx={{ width: 'max-content', my: 2, ml: 'auto' }}
									// 			size="small"
									// 			variant="contained"
									// 			onClick={() => setMerkleRoot(id)}
									// 			disabled={isSaving}
									// 		>
									// 			{isSaving && <CircularProgress isButtonSpinner={true} /> || null}
									// 			UPDATE
									// 		</Button>
									// 	</Stack>
									// ),
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

					<Stack gap={2} mt={8} sx={cardStyle}>
						<Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
							Public Sale Settings
						</Typography>

						<Stack gap={2} direction="horizontal">
							<Stack direction="column">
								<TextField {...maxPerMint} size="small" label='Max per mint' />
							</Stack>

							<Stack direction="column">
								<TextField {...maxPerWallet} size="small" label='Max per wallet' />
							</Stack>

							<Stack direction="column">
								<TextField
									{...newPrice}
									label='Price'
									size="small"
									InputProps={{ endAdornment: contract.nftCollection.currency }}
								/>
							</Stack>
						</Stack>

						<Stack>
							{contractState?.isPublicSaleOpen ? (
								<Button
									startIcon={<LockIcon />}
									size="small"
									variant="contained"
									onClick={() => setPublicSales(methodProps, false)}
									color="error"
									sx={{ ml: 'auto' }}
								>
									Close Public Sales
								</Button>
							) : (
								<Button
									startIcon={<LockOpenIcon />}
									size="small"
									variant="contained"
									onClick={() => setPublicSales(methodProps, true)}
									sx={{ ml: 'auto' }}
								>
									Open Public Sales
								</Button>
							)}
						</Stack>
					</Stack>

					<Stack gap={2} mt={8} sx={cardStyle}>
						<Grid container={true} justifyContent="space-between">
							<Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
								Pre Sale Settings
							</Typography>

							<Button
								size="small"
								variant="contained"
								onClick={() => toggleWhitelistAddressDialog(true)}
								color="secondary"
								sx={{ margin: 'auto 0' }}
							>
								Set Whitelist
							</Button>
						</Grid>

						<Stack gap={2} direction="horizontal">
							{!whitelistAddresses.length && <EmptyAddressList message="Please add whitelist addresses to open pre-sales" /> || null}
							{whitelistAddresses.length && <AddressList addresses={whitelistAddresses} /> || null}
						</Stack>

						<Stack>
							{contractState?.isPresaleOpen ? (
								<Button
									startIcon={<LockIcon />}
									size="small"
									variant="contained"
									onClick={() => setPresales(methodProps, false)}
									color="error"
									sx={{ ml: 'auto' }}
								>
									Close Pre-Sales
								</Button>
							) : (
								<Button
									startIcon={<LockOpenIcon />}
									size="small"
									variant="contained"
									onClick={() => setPresales(methodProps, true)}
									sx={{ ml: 'auto' }}
									disabled={!whitelistAddresses.length}
								>
									Open Pre-Sales
								</Button>
							)}
						</Stack>
					</Stack>

					<Stack gap={2} mt={8} sx={cardStyle}>
						<Grid container={true} justifyContent="space-between">
							<Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
								Airdrop Settings
							</Typography>

							<Button
								size="small"
								variant="contained"
								onClick={() => toggleAirdropDialog(true)}
								color="secondary"
								sx={{ margin: 'auto 0' }}
							>
								Set Airdrop list
							</Button>
						</Grid>

						<Stack gap={2} direction="horizontal">
							{!airdropAddresses.length && <EmptyAddressList message="Please add airdrop addresses to Send NFTs to a list of beneficiaries." /> || null}
							{airdropAddresses.length && <AddressList addresses={airdropAddresses.map(({ address }) => address)} /> || null}
						</Stack>

						<Stack>
							<Button
								size="small"
								variant="contained"
								onClick={() => airdrop(methodProps)}
								sx={{ ml: 'auto' }}
							>
								Airdrop
							</Button>
						</Stack>
					</Stack>


					<Stack direction="row" gap={2} mt={4}>
						<Button
							startIcon={<SwapVertIcon />}
							size="small"
							variant="contained"
							onClick={() => withdraw()}>
							Pay out to bank
						</Button>



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

			<AppDialog
				maxWidth="xl"
				open={state.isWhitelistAddressDialogOpen}
				handleClose={() => toggleWhitelistAddressDialog(false)}
				heading="Whitelist"
				subHeading={
					<Grid container={true} flexDirection="column">
						<Typography color="black"><b>Who do you want to Whitelist to?</b></Typography>
						<Typography color="GrayText">To add a receiver put their wallet address below.</Typography>
					</Grid>
				}
				content={
					<CSVWidget
						count={1}
						addresses={whitelistAddresses.map(a => ({ address: a }))}
						onSave={addresses => {
							setWhitelistAddresses(addresses.map(({ address }) => address));
							toggleWhitelistAddressDialog(false);
						}}
					/>
				}
			/>

			<AppDialog
				maxWidth="xl"
				open={state.isAirdropDialogOpen}
				handleClose={() => toggleAirdropDialog(false)}
				heading="Airdrop"
				subHeading={
					<Grid container={true} flexDirection="column">
						<Typography color="black"><b>Who do you want to airdrop to?</b></Typography>
						<Typography color="GrayText">To add a receiver put their wallet address below.</Typography>
					</Grid>
				}
				content={
					<CSVWidget
						addresses={airdropAddresses}
						onSave={addresses => {
							setAirdropAddresses(addresses.map(({ address, count }) => ({ address, count })));
							toggleAirdropDialog(false);
						}}
					/>
				}
			/>

		</Box>
	);
};

export default Settings;
