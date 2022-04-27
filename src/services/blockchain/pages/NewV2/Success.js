import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Stack, Button, Link } from 'ds/components';

const Success = () => {
	const { id } = useParams();

	return (
		<Box mt={4}>
			<Container>
				<Typography variant="h4">
					Deployed on Rinkeby 🎉
				</Typography>
				<Typography variant="body">
					Congrats! Explore what you can do with your contract or deploy on mainnet directly from your dashboard.
				</Typography>
				<Box>
					<Link to={`/smart-contracts/v2/${id}`} >
						<Button variant="contained" size="small" color="black" sx={{color: 'white'}}>
							Go to Dashboard
						</Button>
					</Link>
				</Box>

				<Link>
					View on Etherscan
				</Link>
			</Container>
		</Box>
	)
};

export default Success;
