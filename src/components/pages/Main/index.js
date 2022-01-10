import React from 'react';
import { Redirect } from 'react-router-dom';
import { Link, Container, Stack, Box, Card, Typography } from 'ds/components';

const Main = () => {
	
	return (
		<>
		<Redirect to="/generator" />
		{/*
		<Container>
			<Stack gap={2}>
				<Typography variant="h1">
					Get started
				</Typography>

				<Link to="/generator" style={{textDecoration: 'none'}}>
					<Card sx={{p:2}}>
						<Box>
							<Typography variant="h5">
								I want to generate an NFT collection like BAYC
							</Typography>
							<Typography variant="body">
								Generate up to 10,000 NFT avatar collection with traits and rarity.
							</Typography>
						</Box>
					</Card>
				</Link>

				<Link to="/upload" style={{textDecoration: 'none'}}>
					<Card sx={{p:2}}>
						<Box>
							<Typography variant="h5">
								I want to deploy my collection to the blockchain
							</Typography>
							<Typography variant="body">
								Deploy your generated collection to a blockchain of your choice.
								Generate up to 10,000 NFT avatar collection with traits and rarity.
							</Typography>
						</Box>
					</Card>
				</Link>

				<Card sx={{p:2}}>
					<Box>
						<Typography variant="h5">
							I want to build a minting website for my collection
						</Typography>
						<Typography variant="body">
							Build a website so users can mint an NFT off your collection.
						</Typography>
					</Box>
				</Card>
			</Stack>
		</Container>
		*/}
		</>
	)
};

export default Main;
