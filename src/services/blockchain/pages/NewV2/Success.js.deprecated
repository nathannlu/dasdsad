import React from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { Container, Box, Typography, Button, Link as RouterLink } from 'ds/components';
import { Link } from '@mui/material';
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
					<RouterLink to={`/smart-contracts/v2/${id}`} >
						<Button variant="contained" size="small" color="black" sx={{ color: 'white' }}>
							Go to Dashboard
						</Button>
					</RouterLink>
				</Box>

				<Link target="_blank" sx={{ my: 2 }} href={`https://etherscan.io/address/${contract.address}`}>
					View on Etherscan
				</Link>
			</Container>
		</Box>
	)
};

export default Success;
