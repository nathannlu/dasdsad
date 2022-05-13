import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
	TextField,
	Stack,
	Box,
	Grid,
	Typography,
	Button,
	CircularProgress
} from 'ds/components';
import {
	LockOpen as LockOpenIcon,
	Lock as LockIcon,
	SwapVert as SwapVertIcon,
	Payment as PaymentIcon
} from '@mui/icons-material';

import { Skeleton } from '@mui/material';

import { useContractSettings } from './hooks/useContractSettings';

import { ContractDetails, EmptyAddressList, AddressList } from '../../widgets';
import AppDialog from '../../widgets/AppDialog';
import CSVWidget from '../../widgets/CSVWidget';

const cards = [
	{ title: 'Update metadata url' },
	{ title: 'Public Sale Settings' },
	{ title: 'Pre Sale Settings' },
	{ title: 'Airdrop Settings' },
	{ title: 'Mint' },
	{ title: 'Withdraw' },
];

const Settings = ({ contract, contractController, contractState, setContractState }) => {
	const {
		actionForm: { maxPerMint, maxPerWallet, newPrice, metadataUrl },
		setPublicSales,
		setPresales,
		updateReveal,
		setMaxPerMint,
		setMaxPerWallet,
		setPrice,
		setWhitelistAddresses,
		setAirdropAddresses,

		mint,
		withdraw,
		airdrop,

		isSavingMetadatUrl,
		isSavingAirdrop,
		isSavingPublicSales,
		isSavingPreSales,
		isMinting,
		isWithdrawing,

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
						{cards.map((c, i) => (
							<Stack gap={2} mt={8} sx={cardStyle}>
								<Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
									{c.title}
								</Typography>

								<Stack gap={2}>
									<Skeleton />
									<Skeleton />
									<Skeleton />
								</Stack>
							</Stack>
						))}
					</Grid>
				</Stack>
			</Box>
		);
	}

	return (
		<Box>
			<Stack mt={8}>
				<ContractDetails contract={contract} />

				{/* <button onClick={() => setMetadataUrl()}>
					Set metadata URL
				</button> */}

				{/* @TODO wiring solana */}

				<Stack gap={2} mt={8} sx={cardStyle}>
					<Grid container={true} justifyContent="space-between">
						<Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
							Metadata url
						</Typography>
					</Grid>

					<Stack gap={2} direction="horizontal">
						<TextField
							{...metadataUrl}
							size="small"
							value={contractState?.metadataUrl}
						/>

					</Stack>

					<Stack>
						<Button
							size="small"
							variant="contained"
							onClick={() => updateReveal(methodProps)}
							disabled={isSavingMetadatUrl}
							sx={{ ml: 'auto' }}
						>
							{isSavingMetadatUrl && <CircularProgress isButtonSpinner={true} /> || null}
							update
						</Button>
					</Stack>
				</Stack>

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
								disabled={isSavingPublicSales}
							>
								{isSavingPublicSales && <CircularProgress isButtonSpinner={true} /> || null}
								Close Public Sales
							</Button>
						) : (
							<Button
								startIcon={<LockOpenIcon />}
								size="small"
								variant="contained"
								onClick={() => setPublicSales(methodProps, true)}
								sx={{ ml: 'auto' }}
								disabled={isSavingPublicSales}
							>
								{isSavingPublicSales && <CircularProgress isButtonSpinner={true} /> || null}
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
								disabled={isSavingPreSales}
							>
								{isSavingPreSales && <CircularProgress isButtonSpinner={true} /> || null}
								Close Pre-Sales
							</Button>
						) : (
							<Button
								startIcon={<LockOpenIcon />}
								size="small"
								variant="contained"
								onClick={() => setPresales(methodProps, true)}
								sx={{ ml: 'auto' }}
								disabled={!whitelistAddresses.length || isSavingPreSales}
							>
								{isSavingPreSales && <CircularProgress isButtonSpinner={true} /> || null}
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
							disabled={isSavingAirdrop}
						>
							{isSavingAirdrop && <CircularProgress isButtonSpinner={true} /> || null}
							Airdrop
						</Button>
					</Stack>
				</Stack>

				<Stack gap={2} mt={8} sx={cardStyle}>
					<Grid container={true} justifyContent="space-between">
						<Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
							Mint
						</Typography>

						<Button
							startIcon={<PaymentIcon />}
							size="small"
							variant="contained"
							onClick={() => mint(methodProps, 1)}
							disabled={!contractState?.isPublicSaleOpen || isMinting}
						>
							{isMinting && <CircularProgress isButtonSpinner={true} /> || null}
							Mint to {contract.blockchain}
						</Button>

						{!contractState?.isPublicSaleOpen && <Stack gap={2} direction="horizontal">
							<Typography color="error" sx={{ my: 4 }}>Enable public sale to start minting!</Typography>
						</Stack>}

					</Grid>
				</Stack>

				<Stack gap={2} mt={8} sx={cardStyle}>
					<Grid container={true} justifyContent="space-between">
						<Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
							Withdraw
						</Typography>

						<Button
							startIcon={<SwapVertIcon />}
							size="small"
							variant="contained"
							onClick={() => withdraw(methodProps)}
							disabled={isWithdrawing}
						>
							{isWithdrawing && <CircularProgress isButtonSpinner={true} /> || null}
							Pay out to bank
						</Button>

						{/* <Button
							startIcon={<SwapVertIcon />}
							size="small"
							variant="contained"
							onClick={() => withdraw(wallet, env)}>
							Close smart contract &amp; withdraw rent
						</Button> */}

					</Grid>
				</Stack>
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
