import React from 'react';
import { Button, Container, Stack, Card, Typography, FormLabel, TextField, Box, Grid, Fade, MenuItem, LoadingButton } from 'ds/components';

const blockchains = [
	{ value: 'Ethereum', img: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'},
	{ value: 'Polygon', img: 'https://cryptologos.cc/logos/polygon-matic-logo.png'},
	{ value: 'Solana', img: 'https://www.pngall.com/wp-content/uploads/10/Solana-Crypto-Logo-PNG-File.png'},
];

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

					<Stack gap={2}>
						{blockchains.map((item, i) => (
							<Card p={2} key={i}>
								<img
									style={{width: '50px'}}
									src={item.img}
								/>
								Deploy on {item.value}
							</Card>
						))}
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
