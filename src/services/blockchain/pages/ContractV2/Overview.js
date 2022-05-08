import React from 'react';

import {
	Container,
	Stack,
	Box,
	Grid,
	Typography,
} from 'ds/components';

import { Skeleton, Link, Chip } from '@mui/material';

import { NFTStack, ContractDetails } from '../../widgets';

const Details = ({ primary, secondary, isLoading }) => {
	return (
		<Typography sx={{ fontWeight: 'bold', display: 'flex', my: 1, gap: 1.5 }}>
			{primary}: {!isLoading && <Typography color="GrayText" sx={{ fontWeight: '400' }}>{secondary}</Typography> || <Skeleton sx={{ width: '50%' }} />}
		</Typography>
	);
}

const Overview = ({ contract, contractState }) => {
	console.log(contract);
	const isLoading = !contractState;

	return (
		<Box>
			<Stack mt={8}>
				<Container>
					<Grid container>
						<Grid item>
							<ContractDetails contract={contract} />

							<Stack gap={2} mt={4}>
								<Box>
									<Typography sx={{ fontWeight: '600' }} variant="h6">
										Details
									</Typography>
									<Stack>
										<Details
											primary="Collection size"
											secondary={contractState?.collectionSize}
											isLoading={isLoading}
										/>
										<Details
											primary="Balance"
											secondary={''} // @TODO wiring
											isLoading={isLoading}
										/>
										<Details
											primary="NFTs sold"
											secondary={contractState?.amountSold}
											isLoading={isLoading}
										/>
										<Details
											primary="Metadata URL"
											secondary={''} // @TODO wiring
											isLoading={isLoading}
										/>
										<Details
											primary="Max per mint"
											secondary={contractState?.maxPerMint}
											isLoading={isLoading}
										/>
										<Details
											primary="Max per wallet"
											secondary={contractState?.maxPerWallet}
											isLoading={isLoading}
										/>

										<Details
											primary="Pre sale status"
											secondary={<Chip label={contractState?.isPresaleOpen && 'OPEN' || 'CLOSED'} color={contractState?.isPresaleOpen && 'success' || 'error'} size="small" />}
											isLoading={isLoading}
										/>

										<Details
											primary="Public sale status"
											secondary={<Chip label={contractState?.isPublicSaleOpen && 'OPEN' || 'CLOSED'} color={contractState?.isPublicSaleOpen && 'success' || 'error'} size="small" />}
											isLoading={isLoading}
										/>
									</Stack>
								</Box>
							</Stack>
						</Grid>
						<Grid item ml="auto" xs={5}>
							<NFTStack contract={contract} />
						</Grid>
					</Grid>
				</Container>
			</Stack>
		</Box>
	);
};

export default Overview;
