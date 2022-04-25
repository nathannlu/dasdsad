import React from 'react';
import { useHistory } from 'react-router-dom';
import {
	Box,
	LoadingButton,
	IconButton,
	FormLabel,
	TextField,
	Divider,
	Fade,
	Grid,
	Stack,
	Container,
	Typography,
	Card,
	Button,
} from 'ds/components';
import { useDeployContractForm } from './hooks/useDeployContractForm';
import { Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { AppBar, Toolbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const New = () => {
	const history = useHistory();
	const { 
		deployContractForm: {
			name,
			symbol,
			maxSupply,
		},
		deployOnRinkeby
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
						<IconButton onClick={() => history.goBack()}>
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
								<Stack sx={{border: '1px solid black', height: '100%'}}>
									<Stack p={2} sx={{borderBottom: '1px solid black'}}>
										<Typography variant="body" sx={{fontWeight: 'bold'}}>
											Collection name
										</Typography>
										<TextField 
											variant="standard"
											placeholder="E.g. Bored Ape Yacht Club"
											{...name}
											sx={{
												'&.MuiInput-root':{
													fontSize: '30px',

													'&::before': {
														borderBottom: 'none'
													},
													'&::after': {
														borderBottom: 'none'
													}
												}
											}}
										/>
									</Stack>
									<Stack direction="horizontal">
										<Stack p={2} sx={{ flex: 1,borderRight: '1px solid black', borderBottom: '1px solid black'}}>
											<Typography variant="body" sx={{fontWeight: 'bold'}}>
												Symbol
											</Typography>
											<TextField 
												variant="standard"
												sx={{ flex: 1 }}
												{...symbol}
											/>
										</Stack>
										<Stack p={2} sx={{ flex: 1, borderBottom: '1px solid black' }}>
											<Typography variant="body" sx={{fontWeight: 'bold'}}>
												Collection size
											</Typography>
											<TextField 
												variant="standard"
												{...maxSupply}
											/>
										</Stack>

									</Stack>
								</Stack>
							</Box>
						</Grid>
						<Grid item sx={{flex: 1, px:4}}>
							<Stack gap={2}>
								<Stack direction="horizontal">
									<Stack>
										<Radio />
										Ethereum
									</Stack>
									<Stack>
										<Radio />
										Polygon
									</Stack>
									<Stack>
										<Radio />
										Solana
									</Stack>
								</Stack>

								<Box>
									<Button onClick={deployOnRinkeby} variant="contained" size="small">
										Deploy to testnet
									</Button>
								</Box>

								<Stack gap={2} mt={6}>
									<Typography sx={{fontWeight: 'bold'}} variant="h4">
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
