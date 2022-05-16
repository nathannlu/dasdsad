import React from 'react';
import { useHistory } from 'react-router-dom';
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
import { AppBar, Radio, FormControlLabel, Switch, Card, CardContent, Zoom } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';

import solanaLogo from 'assets/images/solana.png';
import etherLogo from 'assets/images/ether.png';
import polygonLogo from 'assets/images/polygon.png';

const Description = ({ activeFocusKey }) => {
	switch (activeFocusKey) {
		default:
		case 'SYMBOL':
			return (
				<React.Fragment>
					<Typography sx={{ fontWeight: 'bold' }} variant="h4">
						Choosing a symbol
					</Typography>
					<Typography variant="body">
						The token symbol will be displayed on Etherscan when others come to view your smart contract. The symbol is also used when sharing links to your smart contracts, and platforms where NFT sales and transfer activity are displayed.
					</Typography>
					<Typography variant="body">
						This field accepts alpha numeric
						characters and spaces and can be any
						length.
					</Typography>
					<Typography variant="body">
						Input is limited here to 5 alphanumeric characters.
					</Typography>
				</React.Fragment>
			)
		case 'MAX_SUPPLY':
			return (
				<React.Fragment>
					<Typography sx={{ fontWeight: 'bold' }} variant="h4">
						Collection size
					</Typography>
					<Typography variant="body">
						Creating an NFT collection is fun, interesting and profitable.
					</Typography>
					<Typography variant="body">
						This field accepts numeric values and sky is the limit.
					</Typography>
				</React.Fragment>
			)
		case 'NAME':
			return (
				<React.Fragment>
					<Typography sx={{ fontWeight: 'bold' }} variant="h4">
						Your contract name
					</Typography>
					<Typography variant="body">
						The contract name is the main identifier
						for your contract and will appear
						anywhere your contract is mentioned.
						This is usually your artist name, brand,
						or identity.
					</Typography>
					<Typography variant="body">
						This field accepts alpha numeric
						characters and spaces and can be any
						length.
					</Typography>
					<Typography variant="body">
						We recommend less than 15 characters,
						however this is not a hard requirement.
					</Typography>
				</React.Fragment>
			);
	}
}

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
	const {
		deployContractForm: {
			name,
			symbol,
			maxSupply,
			price
		},
		formValidationErrors,
		isLoading,
		activeFocusKey,
		activeBlockchain,
		isTestnetEnabled,
		isNftRevealEnabled,
		setActiveFocusKey,
		setActiveBlockchain,
		setIsTestnetEnabled,
		setIsNftRevealEnabled,
		deployContract,
		saveContract
	} = useDeployContractForm();

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
					<Grid container mt={4}>
						<Grid container={true} flexDirection="column" sx={{ mb: 5 }}>
							<Stack>
								<Typography color="primary" component="h1" sx={{ fontWeight: 600, fontSize: 45 }}>
									Create your NFT collection
								</Typography>
							</Stack>
							<Stack>
								<Typography variant="body" sx={{ fontSize: 24 }}>
									ERC-721A smart contract
								</Typography>
							</Stack>
						</Grid>

						<Grid item xs={6}>
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
									<Typography sx={{ fontStyle: 'italic', fontSize: 13 }} color="GrayText">
										If this is your first time deploying a smart contract, we recommend you try it with testnet first.
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
								<Button onClick={deployContract} variant="contained" disabled={isLoading}>
									{isLoading && <CircularProgress isButtonSpinner={true} /> || null}
									Deploy Contract
								</Button>
								<Button onClick={saveContract} disabled={isLoading}>
									{isLoading && <CircularProgress isButtonSpinner={true} /> || null}
									Save Contract
								</Button>
								{isLoading && <Typography sx={{ my: 1, fontStyle: 'italic', fontSize: 14 }} color="GrayText">
									Creating Contract! Please be patient it will take couple of seconds...
								</Typography>}
							</Stack>
						</Grid>
						<Grid item sx={{ flex: 1, px: 4 }}>
							<Grid container={true} justifyContent="space-between" sx={{ padding: '0 16px 8px 0' }}>

								<Stack sx={{ width: 'max-content' }}>
									<FormControlLabel onChange={e => setIsNftRevealEnabled(e.target.checked)} checked={isNftRevealEnabled} control={<Switch />} label="Enable NFT reveal" />
								</Stack>

								<Button size="small">
									<AutorenewIcon />&nbsp;Toggle reveal state
								</Button>

							</Grid>
							<Card sx={{ width: '100%', maxWidth: 592, height: 742, borderRadius: 16 }} raised={true}>
								<CardContent sx={{ padding: '0 !important', height: '100%' }}>
									<Box
										sx={{
											backgroundColor: '#3C3C41',
											height: 'calc(100% - 152px)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											flexDirection: 'column'
										}}
									>
										<UploadFileRoundedIcon sx={{ fontSize: 136, color: '#fff' }} />
										<Typography sx={{ color: '#fff', fontStyle: 'italic', fontWeight: 600 }}>Click to add your collection here</Typography>
									</Box>
									<Box sx={{ height: 152 }}>
										<Typography color="GrayText">{name.value}</Typography>
										<Typography color="GrayText">Price</Typography>
										{/* TODO wire currency */}
									</Box>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Container>
			</Grid >
		</Fade>
	);
};

export default New;
