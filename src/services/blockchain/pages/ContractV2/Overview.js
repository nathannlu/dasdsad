import React from 'react';
import { Link } from 'react-router-dom';

import {
	Container,
	Stack,
	Box,
	Grid,
	Typography,
} from 'ds/components';

import { Skeleton, Chip } from '@mui/material';

import { NFTStack, ContractDetails } from '../../widgets';
import { getIpfsUrl } from '@yaman-apple-frog/controllers';

const Details = ({ primary, secondary, isLoading }) => {
	return (
		<Typography sx={{ fontWeight: 'bold', display: 'flex', my: 1, gap: 1.5, maxWidth: 600 }}>
			{primary}: {!isLoading && <Typography color="GrayText" sx={{
				fontWeight: '400',
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				paddingRight: 4
			}}>{secondary}</Typography> || <Skeleton sx={{ width: '50%' }} />}
		</Typography>
	);
}

const Overview = ({ contract, contractState }) => {
	console.log(contract);
	const isLoading = !contractState;

	const ipfsUrl = contract?.blockchain && getIpfsUrl(contract.blockchain);
	const baseUri = contract?.nftCollection?.baseUri.indexOf('ipfs://') !== -1 ? contract?.nftCollection?.baseUri.split('ipfs://') : null;
	const metadataUrl = baseUri && ipfsUrl && `${ipfsUrl}${baseUri[1]}` || contract?.nftCollection?.baseUri;

	return (
		<Box>
			<Stack mt={8}>
				<Container>
					<Grid container>
						<Grid item md={7} xs={12}>
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

										{baseUri && <Details
											primary={<span style={{ minWidth: 110, marginRight: -12 }}>Metadata URL</span>}
											secondary={
												<Link
													target="_blank"
													to={metadataUrl}
												>
													{metadataUrl}
												</Link>
											}
											isLoading={isLoading}
										/>}

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

						<Grid item md={5} xs={12}>
							<NFTStack contract={contract} />
						</Grid>
					</Grid>
				</Container>
			</Stack >
		</Box>
	);
};

export default Overview;
