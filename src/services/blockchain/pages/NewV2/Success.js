import React, { useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { Container, Box, Typography, Stack, Button, Link } from 'ds/components';
import { ContractController, getBlockchainType, blockchainCurrencyMap } from 'controllers/contract/ContractController';
import { useContract } from 'services/blockchain/provider';

const Success = () => {
	const { id } = useParams();
	const { contract } = useContract();

	if (!Object.keys(contract).length) {
		return <Redirect to="/smart-contracts" />;
	}

	return (
		<Box mt={4}>
			<Container>
				<Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
					{contract.name} Deployed on {contract.blockchain} 🎉
				</Typography>

				<Typography variant="body" >
					Congrats! Explore what you can do with your contract or deploy on mainnet directly from your dashboard.
				</Typography>

				<Box sx={{ my: 2 }}>
					<Link to={`/smart-contracts/v2/${id}`} >
						<Button variant="contained" size="small" color="black" sx={{ color: 'white' }}>
							Go to Dashboard
						</Button>
					</Link>
				</Box>

				<Link sx={{ my: 2 }} to={`https://etherscan.io/address/${contract.address}`}>
					View on Etherscan
				</Link>
			</Container>
		</Box>
	)
};

export default Success;
