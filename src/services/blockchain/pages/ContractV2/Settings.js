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

import { Skeleton, FormControlLabel, Switch } from '@mui/material';

import { useContractSettings } from './hooks/useContractSettings';
import { getNftStorageTypeLabel } from 'ambition-constants';

import { ContractDetails, ErrorMessage, AddressList } from '../../widgets';
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

const Settings = ({ contract, contractController, walletController, contractState, setContractState, setIsModalOpen }) => {
	const { id } = useParams();
	const {
		actionForm: { maxPerMint, maxPerWallet, price, metadataUrl },
		updateSales,
		setPresales,
		updateReveal,
		setWhitelistAddresses,
		setAirdropAddresses,
		setIsNftRevealEnabled,
		toggleWhitelistAddressDialog,
		toggleAirdropDialog,
		mint,
		withdraw,
		airdrop,
		isNftRevealEnabled,
		isSavingMetadatUrl,
		isSavingAirdrop,
		isSavingPublicSales,
		isSavingPreSales,
		isMinting,
		isWithdrawing,
		whitelistAddresses,
		airdropAddresses,
		isWhitelistAddressDialogOpen,
		isAirdropDialogOpen
	} = useContractSettings(contract, contractState);

	const walletAddress = walletController.state.address;
	const methodProps = { contractController, setContractState, walletAddress, contractId: id };

	const cardStyle = {
		maxWidth: 760,
		boxShadow: "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
		padding: 3,
		borderRadius: 4
	};

	const isBalanceToWithdrawAvailable = contractState?.balanceInEth && Number(contractState?.balanceInEth) > 0;

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

	const nftStorageType = getNftStorageTypeLabel(contract?.nftStorageType);

	return (
		<Box>
			<Stack mt={8}>
				<ContractDetails contract={contract} />

				{/* @TODO wiring solana */}

				<Stack gap={2} mt={8} sx={cardStyle}>
					<Grid container={true} justifyContent="space-between">
						<Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
							Metadata url
						</Typography>

						<Button
							sx={{ margin: 'auto 0' }}
							size="small"
							variant="contained"
							onClick={() => setIsModalOpen(true)}
						>
							Deploy new token images &amp; metadata
						</Button>
					</Grid>

					<Stack gap={2} direction="column">
						{/* <TextField {...metadataUrl} size="small" fullWidth={true} label='Metadata Url' /> */}

						<Stack gap={1}>
							<Box>
								<Typography sx={{ fontWeight: 'bold' }}>Pre-reveal metadata</Typography>
								<Typography>Below is the {nftStorageType} url pointing to the metadata that was generated to support the pre-reveal image you uploaded.</Typography>
							</Box>

							<Typography sx={{ fontWeight: 'bold', color: '#006aff', wordBreak: 'break-all' }}>{contract?.nftCollection?.unRevealedBaseUri}</Typography>
						</Stack>

						<Stack gap={1}>
							<Box>
								<Typography sx={{ fontWeight: 'bold' }}>Reveal metadata</Typography>
								<Typography>Below is the {nftStorageType} url pointing to the metadata of your NFT collection. This metadata has been automatically linked with your images on {nftStorageType}</Typography>
							</Box>

							<Typography sx={{ fontWeight: 'bold', color: '#006aff', wordBreak: 'break-all' }}>{contract?.nftCollection?.baseUri}</Typography>
						</Stack>

					</Stack>

					<Stack gap={2} direction="horizontal">
						<Stack sx={{ width: 'max-content' }}>
							<FormControlLabel
								onChange={e => setIsNftRevealEnabled(e.target.checked)}
								checked={isNftRevealEnabled}
								control={<Switch />}
								label="Enable NFT reveal"
							/>
						</Stack>
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
					<Grid container={true} justifyContent="space-between">
						<Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
							Public Sale Settings
						</Typography>

						{contractState?.isPublicSaleOpen ? (
							<Button
								startIcon={<LockIcon />}
								size="small"
								variant="contained"
								onClick={() => updateSales(methodProps, false)}
								color="error"
								sx={{ margin: 'auto 0' }}
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
								onClick={() => updateSales(methodProps, true)}
								sx={{ margin: 'auto 0' }}
								disabled={isSavingPublicSales}
							>
								{isSavingPublicSales && <CircularProgress isButtonSpinner={true} /> || null}
								Open Public Sales
							</Button>
						)}
					</Grid>

					<Stack gap={2} direction="horizontal">
						<Stack direction="column">
							<TextField {...maxPerMint} size="small" label='Max per mint' />
						</Stack>

						<Stack direction="column">
							<TextField {...maxPerWallet} size="small" label='Max per wallet' />
						</Stack>

						<Stack direction="column">
							<TextField
								{...price}
								label='Price'
								size="small"
								InputProps={{ endAdornment: contract.nftCollection.currency }}
							/>
						</Stack>
					</Stack>

					<Stack>
						<Button
							size="small"
							variant="contained"
							onClick={() => updateSales(methodProps, contractState?.isPublicSaleOpen)}
							color="secondary"
							sx={{ ml: 'auto' }}
							disabled={isSavingPublicSales}
						>
							{isSavingPublicSales && <CircularProgress isButtonSpinner={true} /> || null}
							UPDATE
						</Button>
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
						{!whitelistAddresses.length && <ErrorMessage message="Please add whitelist addresses to open pre-sales" /> || null}
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
						{!airdropAddresses.length && <ErrorMessage message="Please add airdrop addresses to Send NFTs to a list of beneficiaries." /> || null}
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
							sx={{ margin: 'auto 0' }}
							startIcon={<PaymentIcon />}
							size="small"
							variant="contained"
							onClick={() => mint(methodProps, 1)}
							disabled={!contractState?.isPublicSaleOpen || isMinting}
						>
							{isMinting && <CircularProgress isButtonSpinner={true} /> || null}
							Mint to {contract.blockchain}
						</Button>
					</Grid>

					{!contractState?.isPublicSaleOpen && <Stack gap={2} direction="horizontal">
						<ErrorMessage message="Enable public sale to start minting!" />
					</Stack> || null}

				</Stack>

				<Stack gap={2} mt={8} sx={cardStyle}>
					<Grid container={true} justifyContent="space-between">
						<Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
							Withdraw
						</Typography>

						<Button
							sx={{ margin: 'auto 0' }}
							startIcon={<SwapVertIcon />}
							size="small"
							variant="contained"
							onClick={() => withdraw(methodProps)}
							disabled={!isBalanceToWithdrawAvailable || isWithdrawing}
						>
							{isWithdrawing && <CircularProgress isButtonSpinner={true} /> || null}
							Pay out to bank
						</Button>
					</Grid>

					{!isBalanceToWithdrawAvailable && <Stack gap={2} direction="horizontal">
						<ErrorMessage message="There is no balance on this contract to be withdrawn!" />
					</Stack> || null}

				</Stack>
			</Stack>

			<AppDialog
				maxWidth="xl"
				open={isWhitelistAddressDialogOpen}
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
				open={isAirdropDialogOpen}
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
