import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getResolvedImageUrl } from '@ambition-blockchain/controllers';
import useMediaQuery from '@mui/material/useMediaQuery';

import {
	Box,
	IconButton,
	TextField,
	Divider,
	Fade,
	Grid,
	Stack,
	Container,
	Typography,
	Button,
	CircularProgress,
} from 'ds/components';
import { useDeployContractForm } from './hooks/useDeployContractForm';
import { AppBar, Radio, FormControlLabel, Switch } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import solanaLogo from 'assets/images/solana.png';
import etherLogo from 'assets/images/ether.png';
import polygonLogo from 'assets/images/polygon.png';

import { NFTStack } from '../../widgets';

import AppDialog from '../../widgets/AppDialog';
import IPFSModal from '../Contract/IPFSModal';

const RadioLabel = ({ type, isTestnetEnabled }) => {
	const content = { imgSrc: null, description: null };
	switch (type) {
		case 'ethereum':
			content.imgSrc = etherLogo;
			content.description = `Deploy on ${isTestnetEnabled && 'Ethereum Testnet (Rinkeby)' || 'Ethereum'}`;
			break;
		case 'polygon':
			content.imgSrc = polygonLogo;
			content.description = `Deploy on ${isTestnetEnabled && 'Polygon Testnet (Mumbai)' || 'Polygon'}`;
			break;
		case 'solana':
			content.imgSrc = solanaLogo;
			content.description = `Deploy on ${isTestnetEnabled && 'Solana Devnet' || 'Solana'}`;
			break;
		default:
			content.imgSrc = null;
			content.description = null;
	}

	if (!content.imgSrc || !content.description) {
		return null;
	}

	return (
		<Grid container={true} justifyContent="center" alignItems="center">
			<img style={{ height: 42, width: 'auto', marginRight: 16 }} src={content.imgSrc} />
			<Typography>{content.description}</Typography>
		</Grid>
	)
}

const New = () => {
	const history = useHistory();
	const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up('lg'));

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [unRevealedtNftImage, setUnRevealedtNftImage] = useState({ src: null, isLoading: false });
	const [revealedNftImage, setRevealedNftImage] = useState({ src: null, isLoading: false });
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const {
		deployContractForm: {
			name,
			symbol,
			maxSupply,
			price
		},
		contractState,
		formValidationErrors,
		isDeploying,
		isSaving,
		activeBlockchain,
		isTestnetEnabled,
		setActiveBlockchain,
		setIsTestnetEnabled,
		setIsNftRevealEnabled,
		deployContract,
		saveContract,
		updateContract
	} = useDeployContractForm();

	const nftPrice = { currency: contractState?.nftCollection?.currency, price: contractState?.nftCollection?.price };

	const fetchRevealedNftImage = async (metadataUrl) => {
		try {
			setRevealedNftImage(prevState => ({ ...prevState, isLoading: true }));
			const imageSrc = await getResolvedImageUrl(metadataUrl);
			setRevealedNftImage(prevState => ({ ...prevState, src: imageSrc, isLoading: false }));
		} catch (e) {
			console.log('Error fetchImageSrc:', e);
			setRevealedNftImage(prevState => ({ ...prevState, src: null, isLoading: false }));
		}
	}

	useEffect(() => {
		if (!contractState.nftCollection.baseUri) {
			return;
		}
		fetchRevealedNftImage(contractState.nftCollection.baseUri);
	}, [contractState.nftCollection.baseUri]);

	useEffect(() => {
		if (!contractState.nftCollection.unRevealedBaseUri) {
			return;
		}
		setRevealedNftImage(prevState => ({ ...prevState, src: contractState.nftCollection.unRevealedBaseUri, isLoading: false }));
	}, [contractState.nftCollection.unRevealedBaseUri]);

	useEffect(() => {
		if (activeBlockchain === 'solana') {
			setIsDialogOpen(true);
		}
	}, [activeBlockchain]);

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
					paddingTop: '67px',
				}}>
				<AppBar
					position="fixed"
					sx={{
						bgcolor: 'grey.100',
						py: 2,
						boxShadow: 'none',
						borderBottom: '1px solid rgba(0,0,0,.2)',
						color: '#000',
					}}
				>
					<Stack direction="row" px={2} gap={2} alignItems="center">
						<IconButton onClick={() => history.push('/smart-contracts')}>
							<CloseIcon sx={{ fontSize: '18px' }} />
						</IconButton>
						<Divider
							sx={{ height: '20px', borderWidth: 0.5, mt: 2 }}
							orientation="vertical"
						/>
						<Box>
							<Typography variant="body">
								Create a contract
							</Typography>
						</Box>
					</Stack>
				</AppBar>

				<Container>

					<Grid container={true} flexDirection="column" sx={{ mb: 5 }} mt={4}>
						<Stack>
							<Typography color="primary" component="h1" sx={{ fontWeight: 600, fontSize: 45 }}>
								Create your NFT collection
							</Typography>
						</Stack>
						{isLargeScreen && <Stack>
							<Typography variant="body" sx={{ fontSize: 24 }}>
								ERC-721A smart contract
							</Typography>
						</Stack> || null}
					</Grid>

					<Grid container direction={isLargeScreen && 'row' || 'column-reverse'}>
						<Grid item xs={12} lg={6}>

							{!isLargeScreen && <Stack sx={{ my: 8 }}>
								<Typography variant="body" sx={{ fontSize: 24 }}>
									ERC-721A smart contract
								</Typography>
							</Stack> || null}

							<Stack sx={{ mb: 4 }}>
								<TextField
									variant="outlined"
									{...name}
									sx={{
										'&.MuiInput-root': {
											fontSize: '30px',

											'&::before': {
												borderBottom: 'none'
											},
											'&::after': {
												borderBottom: 'none'
											}
										}
									}}
									error={Boolean(formValidationErrors.name)}
								/>
							</Stack>
							<Stack sx={{ mb: 4 }}>
								<TextField
									variant="outlined"
									sx={{ flex: 1 }}
									{...symbol}
									inputProps={{ maxLength: 5 }}
									error={Boolean(formValidationErrors.symbol)}
								/>
							</Stack>
							<Stack sx={{ mb: 4 }}>
								<TextField
									variant="outlined"
									{...maxSupply}
									type="number"
									error={Boolean(formValidationErrors.maxSupply)}
								/>
							</Stack>
							<Stack sx={{ mb: 4 }}>
								<TextField
									variant="outlined"
									{...price}
									type="number"
									error={Boolean(formValidationErrors.maxSupply)}
								/>
							</Stack>
							<Stack gap={2}>
								<Stack>
									<Typography sx={{}}>Select a blockchain to deploy</Typography>
									<Typography sx={{ fontStyle: 'italic', fontSize: 14 }} color="GrayText">
										**If this is your first time deploying a smart contract, we recommend you try it with testnet first.
									</Typography>

									<Stack sx={{ my: 2, width: 'max-content' }}>
										<FormControlLabel onChange={e => setIsTestnetEnabled(e.target.checked)} checked={isTestnetEnabled} control={<Switch />} label="Deploy To Testnet" />
									</Stack>

									<Stack sx={{ mb: 2, width: 'max-content' }}>
										<FormControlLabel
											name="blockchain-radio-buttons"
											value="ethereum"
											checked={activeBlockchain === 'ethereum'}
											onChange={e => setActiveBlockchain(e.target.value)}
											control={<Radio />}
											label={<RadioLabel type="ethereum" isTestnetEnabled={isTestnetEnabled} />}
											labelPlacement="end"
										/>
									</Stack>
									<Stack sx={{ mb: 2, width: 'max-content' }}>
										<FormControlLabel
											name="blockchain-radio-buttons"
											value="polygon"
											checked={activeBlockchain === 'polygon'}
											onChange={e => setActiveBlockchain(e.target.value)}
											control={<Radio />}
											label={<RadioLabel type="polygon" isTestnetEnabled={isTestnetEnabled} />}
											labelPlacement="end"
										/>
									</Stack>
									<Stack sx={{ mb: 2, width: 'max-content' }}>
										<FormControlLabel
											name="blockchain-radio-buttons"
											value="solana"
											checked={activeBlockchain === 'solana'}
											onChange={e => setActiveBlockchain(e.target.value)}
											control={<Radio />}
											label={<RadioLabel type="solana" isTestnetEnabled={isTestnetEnabled} />}
											labelPlacement="end"
										/>
									</Stack>
								</Stack>
							</Stack>

							<Stack direction="row" py={2} gap={2} alignItems="center">
								<Button
									onClick={() => {
										if (activeBlockchain === 'solana') {
											setIsDialogOpen(true);
											return;
										}
										deployContract();
									}}
									variant="contained"
									disabled={isDeploying}
								>
									{isDeploying && <CircularProgress isButtonSpinner={true} /> || null}
									Deploy Contract
								</Button>
								<Button
									onClick={() => {
										if (activeBlockchain === 'solana') {
											setIsDialogOpen(true);
											return;
										}
										if (contractState?.id) {
											updateContract();
											return;
										}
										saveContract();
									}}
									disabled={isSaving}
								>
									{isSaving && <CircularProgress isButtonSpinner={true} /> || null}
									Save Contract
								</Button>
								{isDeploying && <Typography sx={{ my: 1, fontStyle: 'italic', fontSize: 14 }} color="GrayText">
									Creating Contract! Please be patient it will take couple of seconds...
								</Typography>}
							</Stack>
						</Grid>

						<Grid item xs={12} lg={6} sx={{ flex: 1, px: 4 }}>
							<NFTStack
								disabled={!contractState?.id}
								contract={contractState}
								nftPrice={nftPrice}
								unRevealedtNftImage={unRevealedtNftImage}
								revealedNftImage={revealedNftImage}
								setIsModalOpen={setIsModalOpen}
								setIsNftRevealEnabled={setIsNftRevealEnabled}
							/>

							<Typography sx={{ fontStyle: 'italic', fontSize: 14, mt: 8 }} color="GrayText">
								**Deploy or save the contract to upload your collection.
							</Typography>
						</Grid>
					</Grid>

				</Container>

				{contractState?.id && <IPFSModal
					id={contractState?.id}
					contract={contractState}
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
				/>}

				<AppDialog
					open={isDialogOpen}
					handleClose={() => setIsDialogOpen(false)}
					heading="REDIRECT TO ERC-721 PAGE"
					subHeading={
						<Grid container={true} flexDirection="column">
							<Typography color="black" align='center'><b>ERC-721a contract are currently not supported for solana deployment.</b></Typography>
							<Typography color="black" align='center'>Please Redirect to ERC-721 version to deploy NFT's with Solana.</Typography>
						</Grid>
					}
					submitButtonText="redirect"
					handleSave={() => {
						history.push('/smart-contracts/new');
						setIsDialogOpen(false);
					}}
				/>

			</Grid>
		</Fade>
	);
};

export default New;
