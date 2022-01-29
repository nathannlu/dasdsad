import React from 'react';
import { Button, Container, Stack, Card, Typography, FormLabel, TextField, Box, Grid, Fade, MenuItem, LoadingButton } from 'ds/components';

const Preview = props => {
	
	return (
		<Box sx={{mt: -10}}>
			<Container
				sx={{display: 'flex', minHeight: '100vh', alignItems: "center", justifyContent: "center"}}
			>
				<Stack gap={2}>
					<Stack>
						<Typography variant="h2">
							Get started
						</Typography>
						<Typography variant="body">
							Deploy your smart contract to the ethereum blockchain
						</Typography>
					</Stack>

					<Stack>
						<Typography variant="h5">
							Overview
						</Typography>
						<ol>
							<li>
								Configure smart contract
							</li>
							<li>
								Upload images to IPFS
							</li>
							<li>
								Upload metadata to IPFS
							</li>
							<li>
								Deploy contract
							</li>
						</ol>
					</Stack>

					<Stack>
						<Typography variant="h5">
							Payments
						</Typography>
						<ol>
							<li>
								Ethereum charge 1.3eth gas fees to deploy your contract
							</li>
							<li>
								Ambition charge $19.99/mo for hosting on our decentralized file storage node
							</li>
						</ol>
					</Stack>

					<Button onClick={() =>props.nextStep()} variant="contained">
						Let's get started
					</Button>
				</Stack>
			</Container>
		</Box>
	)
};

export default Preview;
