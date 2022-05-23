import React from 'react';

import {
	Container,
	Stack,
	Box,
	Grid,
	Typography,
} from 'ds/components';

import { Skeleton, Chip, Link } from '@mui/material';

import { NFTStack, ContractDetails } from '../../widgets';

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

const Overview = ({ contract, contractState, unRevealedtNftImage, revealedNftImage, nftPrice, setIsModalOpen }) => {
	console.log(contract);
	const isLoading = !contractState;
	const metadataUrl = contract?.nftCollection?.metadataUrl;

	return (
		<Box>
			<Stack mt={8}>
				<Container>
					<Grid container>
						<Grid item md={6} xs={12}>
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
											secondary={`${contractState?.balanceInEth} ${nftPrice.currency}` } 
											isLoading={isLoading}
										/>
										<Details
											primary="NFTs sold"
											secondary={contractState?.amountSold}
											isLoading={isLoading}
										/>

										{metadataUrl && <Details
											primary={<span style={{ minWidth: 110, marginRight: -12 }}>Metadata URL</span>}
											secondary={<Link target="_blank" href={metadataUrl}>{metadataUrl}</Link>}
											isLoading={isLoading}
										/> || null}

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

						<Grid item md={6} xs={12}>
							<NFTStack
								contract={contract}
								nftPrice={nftPrice}
								disabled={!contract?.id}
								unRevealedtNftImage={unRevealedtNftImage}
								revealedNftImage={revealedNftImage}
								setIsModalOpen={setIsModalOpen}
							/>
						</Grid>
					</Grid>
				</Container>
			</Stack>
		</Box>
	);
};

export default Overview;
