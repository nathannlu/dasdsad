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
	CircularProgress
} from 'ds/components';
import { useDeployContractForm } from './hooks/useDeployContractForm';
import { AppBar, Radio, FormControlLabel, Switch } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
		},
		formValidationErrors,
		isLoading,
		activeFocusKey,
		activeBlockchain,
		isTestnetEnabled,
		setActiveFocusKey,
		setActiveBlockchain,
		setIsTestnetEnabled,
		deployContract
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
							sx={{ height: '20px', borderWidth: 0.5 }}
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
						<Grid item xs={7}>
							<Box
								sx={{
									borderRadius: '10px',
									border: 'solid 2px white',
									background: 'rgba(0,0,0,.2)',
									boxShadow: '0 4px 8px rgba(0,0,0,.1)',
									backdropFilter: 'blur(3px)',
									height: '850px',
								}}
								p={3}
							>
								<Stack sx={{ border: '1px solid black', height: '100%' }}>
									<Stack p={2} sx={{ borderBottom: '1px solid black' }}>
										<Typography variant="body" sx={{ fontWeight: 'bold' }}>
											Collection name
										</Typography>
										<TextField
											variant="standard"
											placeholder="E.g. Bored Ape Yacht Club"
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
											onFocus={e => setActiveFocusKey('NAME')}
											error={Boolean(formValidationErrors.name)}
										/>
									</Stack>
									<Stack direction="horizontal">
										<Stack p={2} sx={{ flex: 1, borderRight: '1px solid black', borderBottom: '1px solid black' }}>
											<Typography variant="body" sx={{ fontWeight: 'bold' }}>
												Symbol
											</Typography>
											<TextField
												variant="standard"
												sx={{ flex: 1 }}
												{...symbol}
												inputProps={{ maxLength: 5 }}
												onFocus={e => setActiveFocusKey('SYMBOL')}
												error={Boolean(formValidationErrors.symbol)}
											/>
										</Stack>
										<Stack p={2} sx={{ flex: 1, borderBottom: '1px solid black' }}>
											<Typography variant="body" sx={{ fontWeight: 'bold' }}>
												Collection size
											</Typography>
											<TextField
												variant="standard"
												{...maxSupply}
												type="number"
												onFocus={e => setActiveFocusKey('MAX_SUPPLY')}
												error={Boolean(formValidationErrors.maxSupply)}
											/>
										</Stack>

									</Stack>
								</Stack>
							</Box>
						</Grid>
						<Grid item sx={{ flex: 1, px: 4 }}>
							<Stack gap={2}>
								<Stack>

									{/* not required we'll always create a new contract on testnet by default */}

									{/* <Stack sx={{ mb: 2, width: 'max-content' }}>
										<FormControlLabel onChange={e => setIsTestnetEnabled(e.target.checked)} checked={isTestnetEnabled} control={<Switch />} label="Deploy To Testnet" />
									</Stack> */}

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

								<Box>
									<Button onClick={deployContract} variant="contained" size="small" disabled={isLoading}>
										{isLoading && <CircularProgress isButtonSpinner={true} /> || null}
										Create Contract
									</Button>
									{isLoading && <Typography sx={{ my: 1, fontStyle: 'italic', fontSize: 14 }} color="GrayText">
										Creating Contract! Please be patient it will take couple of seconds...
									</Typography>}
								</Box>

								<Stack gap={2} mt={6}>
									<Description activeFocusKey={activeFocusKey} />
								</Stack>
							</Stack>
						</Grid>
					</Grid>
				</Container>
			</Grid>
		</Fade>
	);
};

export default New;
