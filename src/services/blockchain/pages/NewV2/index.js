import React, { useState } from 'react';
import { Box, Divider, Grid, Modal, Stack, Button, TextField, Typography, Container, CircularProgress } from 'ds/components';
import { useNewContractForm } from './hooks/useNewContractForm';

import solanaLogo from 'assets/images/solana.png';
import etherLogo from 'assets/images/ether.png';
import polygonLogo from 'assets/images/polygon.png';

const contractTypes = [
	{ title: 'Deploy ERC-721a contract on Ethereum Testnet (Rinkeby)', key: 'rinkeby', imgSrc: etherLogo },
	{ title: 'Deploy ERC-721a on Polygon Testnet (Mumbai)', key: 'mumbai', imgSrc: polygonLogo },
	{ title: 'Deploy on Solana Devnet (CandyMachine)', key: 'solanadevnet', imgSrc: solanaLogo }
];

const NewV2 = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const {
		newContractForm: { name, symbol, maxSupply, price },
		isSaving,
		activeBlockchain,
		formValidationErrors,
		deployingMessage,
		setActiveBlockchain,
		saveContract,
	} = useNewContractForm();

	return (
		<Box sx={{ background: '#f5f5f5', minHeight: '100vh' }}>
			<Container>
				<Stack pt={4} gap={2}>
					<Typography variant="h5">
						Set up your project
					</Typography>

					<Typography variant="body">
						Let's create a free testnet contract for your NFT collection.
						Don't worry about these values for testnet, but note that they can't be changed on mainnet.
					</Typography>
					<Grid container>
						<Grid xs={8} sx={{ mx: 'auto' }} item>
							<Stack gap={1}>
								{contractTypes.map((contract) => (
									<Box
										key={contract.key}
										onClick={() => {
											setActiveBlockchain(contract.key);
											setIsModalOpen(true);
										}}
										sx={{
											borderRadius: '5px',
											p: 2,
											background: 'white',
											border: '1px solid rgba(0,0,0,.1)',
											transition: 'all .2s',
											cursor: 'pointer',
											'&:hover': {
												border: '1px solid #0B6DFF',
											}
										}}
									>
										<Grid container={true} alignItems="center">
											<img style={{ height: 36, width: 'auto', marginRight: 16 }} src={contract.imgSrc} />
											<Typography>{contract.title}</Typography>
										</Grid>
									</Box>
								))}
							</Stack>
						</Grid>
					</Grid>

					<Modal
						open={isModalOpen}
						onClose={() => {
							if (isSaving) {
								return;
							}
							setActiveBlockchain(null);
							setIsModalOpen(false);
						}}
						sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={{ background: 'white', width: '1200px', '&:focus-visible': { outline: 'none' }, borderRadius: '5px' }}>

							<Box p={2}>
								<Typography variant="h6">
									Create new NFT collection
								</Typography>
							</Box>

							<Divider />

							<Grid container>

								<Grid xs={5} item>
									<Stack p={4} gap={2}>
										<Box>
											<Typography variant="h6" sx={{ fontWeight: 'bold' }}>
												Name
											</Typography>
											<Typography variant="body">
												Project names need to be distinct
											</Typography>
										</Box>

										<TextField
											{...name}
											error={Boolean(formValidationErrors.name)}
										/>
										<TextField
											{...symbol}
											inputProps={{ maxLength: 5 }}
											error={Boolean(formValidationErrors.symbol)}
										/>
										<TextField
											{...maxSupply}
											type="number"
											error={Boolean(formValidationErrors.maxSupply)}
										/>
										<TextField
											{...price}
											type="number"
											error={Boolean(formValidationErrors.price)}
										/>

										<Box>
											<Button
												variant="contained"
												size="small"
												onClick={saveContract}
												disabled={isSaving}
											>
												{isSaving && <CircularProgress isButtonSpinner={true} /> || null}
												Create Contract on {activeBlockchain}
											</Button>
										</Box>

										<Stack direction="row" py={1} gap={2} alignItems="center">
											{isSaving && <Typography sx={{ fontStyle: 'italic', fontSize: 14 }} color="GrayText">
												{deployingMessage}
											</Typography> || null}
										</Stack>

									</Stack>
								</Grid>
							</Grid>
						</Box>
					</Modal>
				</Stack>
			</Container>
		</Box>
	);
};


export default NewV2;