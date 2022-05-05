import React from 'react';
import NFT from './NFT';
import {
	Fade,
	Container,
	Link,
	TextField,
	Stack,
	Box,
	Grid,
	Typography,
	Button,
	Divider,
} from 'ds/components';
import {
	Chip,
	Stepper,
	Step,
	StepLabel,
	StepContent,
	Skeleton
} from '@mui/material';
import { ContractController, isTestnetBlockchain } from 'controllers/contract/ContractController';

const Overview = ({ setIsModalOpen, contract, contractState }) => {
	console.log(contract);

	const isContractDeployedOnTestnet = isTestnetBlockchain(contract?.blockchain);

	return (
		<Box>
			<Stack mt={8}>
				<Container>
					<Grid container>
						<Grid item>
							<Box>
								<Stack
									gap={2}
									direction="horizontal"
									alignItems="center">
									<Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
										{contract?.name || <Skeleton />}
									</Typography>

									{contract?.blockchain && <Chip sx={{ textTransform: 'capitalize' }} label={contract?.blockchain} color={isContractDeployedOnTestnet && 'warning' || 'primary'} /> || null}
								</Stack>

								<Typography sx={{ textTransform: 'capitalize' }}>
									{contract?.type || <Skeleton />}
								</Typography>
							</Box>

							<Stack gap={2} mt={4}>
								<Box>
									<Typography
										sx={{ fontWeight: '600' }}
										variant="h6">
										Address
									</Typography>
									<Typography variant="body">
										{contract?.address || <Skeleton />}
									</Typography>
								</Box>

								<Box>
									<Typography sx={{ fontWeight: '600' }} variant="h6">
										Details
									</Typography>
									<Stack>
										<Typography variant="body">
											Collection size: {contractState?.collectionSize && <Typography color="GrayText" sx={{ fontWeight: '600' }}>{contractState?.collectionSize}</Typography> || <Skeleton />}
										</Typography>
										<Typography variant="body">
											Balance: {contractState?.a && <Typography color="GrayText" sx={{ fontWeight: '600' }}></Typography> || <Skeleton />}
										</Typography>
										<Typography variant="body">
											NFTs sold:{contractState?.amountSold && <Typography color="GrayText" sx={{ fontWeight: '600' }}>{contractState?.amountSold}</Typography> || <Skeleton />}
										</Typography>
										<Typography variant="body">
											Metadata URL: {contractState?.a && <Typography color="GrayText" sx={{ fontWeight: '600' }}></Typography> || <Skeleton />}
										</Typography>
										<Typography variant="body">
											Max per mint: {contractState?.maxPerMint && <Typography color="GrayText" sx={{ fontWeight: '600' }}>{contractState?.maxPerMint}</Typography> || <Skeleton />}
										</Typography>
										<Typography variant="body">
											Max per wallet: {contractState?.maxPerWallet && <Typography color="GrayText" sx={{ fontWeight: '600' }}>{contractState?.maxPerWallet}</Typography> || <Skeleton />}
										</Typography>
										<Typography variant="body">
											Pre sale status: {contractState?.isPresaleOpen !== null && <Typography color="GrayText" sx={{ fontWeight: '600' }}>{contractState?.isPresaleOpen && 'OPEN' || 'CLOSED'}</Typography> || <Skeleton />}
										</Typography>
										<Typography variant="body">
											Public sale status: {contractState?.isPublicSaleOpen !== null && <Typography color="GrayText" sx={{ fontWeight: '600' }}>{contractState?.isPublicSaleOpen && 'OPEN' || 'CLOSED'}</Typography> || <Skeleton />}
										</Typography>
									</Stack>
								</Box>
							</Stack>
						</Grid>
						<Grid sx={{ position: 'relative' }} item ml="auto" xs={5}>
							<Box sx={{ position: 'absolute', top: 0 }}>
								<NFT />
							</Box>
							<Box sx={{ position: 'absolute', top: 40, transform: 'scale(1.05)' }}>
								<NFT />
							</Box>
							<Box sx={{
								position: 'absolute',
								top: 80,
								transform: 'scale(1.1)'
							}}>
								<NFT />
							</Box>
						</Grid>
					</Grid>
				</Container>
			</Stack>
		</Box>
	);
};

export default Overview;
