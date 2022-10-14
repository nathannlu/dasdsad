import React, { useState } from 'react';
import {
	Box,
	Divider,
	Grid,
	Modal,
	Stack,
	Button,
	TextField,
	Typography,
	Container,
	CircularProgress,
} from 'ds/components';
import { useHistory } from 'react-router-dom';
import { useNewContractForm } from './hooks/useNewContractForm';
import { useWeb3 } from 'libs/web3'

import solanaLogo from 'assets/images/solana.png';
import etherLogo from 'assets/images/ether.png';
import polygonLogo from 'assets/images/polygon.png';

const contractTypes = [
	{
		title: 'Ethereum ERC-721a',
		key: 'goerli',
        standard: 'eth',
		imgSrc: etherLogo,
	},
	{
		title: 'Polygon ERC-721a',
		key: 'mumbai',
        standard: 'eth',
		imgSrc: polygonLogo,
	},
	{
		title: 'Solana Candy Machine',
		key: 'solanadevnet',
        standard: 'sol',
		imgSrc: solanaLogo,
	},
];

const NewV2 = () => {
	const history = useHistory();
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
    const { walletState } = useWeb3();

	return (
		<Box sx={{ background: '#f5f5f5', minHeight: '100vh' }}>
			<Container>
				<Stack pt={4} gap={2}>
					<Typography variant="h5">Set up your project</Typography>

					<Typography variant="body">
						Let's create a free testnet contract for your NFT
						collection. Don't worry about these values for testnet,
						but note that they can't be changed on mainnet.
					</Typography>
					<Grid container>
						{contractTypes.map((contract) => (
							<Grid p={1} xs={4} item>
                                <Stack
                                    key={contract.key}
                                    gap={1}
                                    sx={{
                                        borderRadius: '5px',
                                        p: 2,
                                        background: 'white',
                                        border: '1px solid rgba(0,0,0,.1)',
                                        transition: 'all .2s',
                                        '&:hover': {
                                            border: '1px solid #0B6DFF',
                                        },
                                    }}
                                >
                                    <Stack direction="row" alignItems="center" gap={1}>
                                        <img style={{height: '30px', objectFit: 'contain'}} src={contract.imgSrc} />
                                        <Typography>{contract.title}</Typography>
                                    </Stack>

                                    {/*
                                    <Typography>
                                        Deploy on Rinkeby
                                    </Typography>
                                    */}

                                    <Button
                                        variant="contained"
                                        size="small"
                                        disabled={
                                            (contract.standard === 'eth' && (walletState?.walletType === 'phantom' || !walletState?.walletType)) || 
                                            (contract.standard === 'sol' && walletState?.walletType !== 'phantom')
                                        }
                                        onClick={() => {
                                            if(contract.key == 'solanadevnet') {
                                                history.push("/smart-contracts/new")
                                            }
                                            setActiveBlockchain(contract.key);
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        Create contract
                                    </Button>
                                </Stack>
							</Grid>
						))}
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
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description">
						<Box
							sx={{
								background: 'white',
								width: '1200px',
								'&:focus-visible': { outline: 'none' },
								borderRadius: '5px',
							}}>
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
											<Typography
												variant="h6"
												sx={{ fontWeight: 'bold' }}>
												Name
											</Typography>
											<Typography variant="body">
												Project names need to be
												distinct
											</Typography>
										</Box>

										<TextField
											{...name}
											error={Boolean(
												formValidationErrors.name
											)}
										/>
										<TextField
											{...symbol}
											inputProps={{ maxLength: 5 }}
											error={Boolean(
												formValidationErrors.symbol
											)}
										/>
										<TextField
											{...maxSupply}
											type="number"
											error={Boolean(
												formValidationErrors.maxSupply
											)}
										/>
										<TextField
											{...price}
											type="number"
											error={Boolean(
												formValidationErrors.price
											)}
										/>

										<Box>
											<Button
												variant="contained"
												size="small"
												onClick={saveContract}
												disabled={isSaving}>
												{(isSaving && (
													<CircularProgress
														isButtonSpinner={true}
													/>
												)) ||
													null}
												Create Contract on{' '}
												{activeBlockchain}
											</Button>
										</Box>

										<Stack
											direction="row"
											py={1}
											gap={2}
											alignItems="center">
											{(isSaving && (
												<Typography
													sx={{
														fontStyle: 'italic',
														fontSize: 14,
													}}
													color="GrayText">
													{deployingMessage}
												</Typography>
											)) ||
												null}
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
