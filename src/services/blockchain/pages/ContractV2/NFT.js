import React from 'react';
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

const NFT = () => {
	return (
		<Box
			sx={{
				borderRadius: '10px',
				border: 'solid 2px white',
				background: 'rgba(0,0,0,.5)',
				boxShadow: '0 4px 8px rgba(0,0,0,.1)',
				backdropFilter: 'blur(3px)',
				color: 'white',
			}}
			p={3}>
			<Stack
				sx={{
					border: '1px solid white',
					height: '100%',
				}}>
				<Box sx={{ height: '400px' }}>
					<img
						style={{
							height: '100%',
							width: '100%',
							objectFit: 'cover',
						}}
						src="https://lucky-trader-cms-prod.s3.us-east-2.amazonaws.com/Moonbirds_6a578f3f94.webp"
					/>
				</Box>
				<Stack p={2} sx={{ borderTop: '1px solid black' }}>
					<Typography variant="body" sx={{ fontWeight: 'bold' }}>
						Collection name
					</Typography>
				</Stack>
				<Stack direction="horizontal">
					<Stack
						p={2}
						sx={{
							flex: 1,
							borderRight: '1px solid white',
							borderTop: '1px solid white',
						}}>
						<Typography variant="body" sx={{ fontWeight: 'bold' }}>
							Symbol
						</Typography>
					</Stack>
					<Stack
						p={2}
						sx={{
							flex: 1,
							borderTop: '1px solid white',
						}}>
						<Typography variant="body" sx={{ fontWeight: 'bold' }}>
							Price
						</Typography>
					</Stack>
				</Stack>
			</Stack>
		</Box>
	);
};

export default NFT;
