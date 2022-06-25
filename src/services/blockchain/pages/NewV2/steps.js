import React, { useState } from 'react';
import { Box, Container, Divider, Grid, Modal, Stack, Button, TextField, Typography } from 'ds/components';
import { useNewContractForm } from './hooks/useNewContractForm';

const contractTypes = [
	{ title: "ERC-721a" },
	{ title: "Solana NFT (CandyMachine)" }
];

export const Step1 = ({ nextStep }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
		const {
		newContractForm: { name, symbol, maxSupply, price },
		saveContract,
	} = useNewContractForm();

	return (
		<Stack pt={4} gap={2}>
			<Typography variant="h5">
				Set up your project
			</Typography>
			<Grid container>
				<Grid xs={8} sx={{mx:'auto'}} item>
					<Stack gap={1}>
						{contractTypes.map((contract) => (
							<Box 
								key={contract.title} 
								onClick={() => setIsModalOpen(true)} 
								sx={{
									borderRadius: '5px',
									p: 2,
									background: 'white',
									border: '1px solid rgba(0,0,0,.1)', 
									transition: 'all .2s',
									cursor: 'pointer',
									'&:hover': {
										border: '1px solid #0B6DFF', 
								}
							}}>
								{contract.title}
							</Box>
						))}
					</Stack>
				</Grid>
			</Grid>

			<Modal
				open={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={{background: 'white', width: '1200px', '&:focus-visible': { outline: 'none' }, borderRadius: '5px'}}>

					<Box p={2}>
						<Typography  variant="h6">
							Create new NFT collection
						</Typography>
					</Box>

					<Divider />
				
					<Grid container>

						<Grid xs={5} item>
							<Stack p={4} gap={2}>
								<Box>
									<Typography variant="h6" sx={{fontWeight: 'bold'}}>
										Name
									</Typography>
									<Typography variant="body">
										Project names need to be distinct
									</Typography>
								</Box>

								<TextField {...name} />
								<TextField {...symbol} />
								<TextField {...maxSupply} />
								<TextField {...price} />

								<Box>
									<Button variant="contained" size="small" onClick={() => saveContract()}>
										Create
									</Button>
								</Box>
							</Stack>
						</Grid>
					</Grid>
				</Box>
			</Modal>


		</Stack>
	);
};

export const Step2 = ({ nextStep }) => {
	const {
		newContractForm: { name, symbol, maxSupply, price },
		saveContract,
	} = useNewContractForm();

	return (
		<Stack>
			<Typography>Fill in the description</Typography>

			<TextField {...name} />


		</Stack>
	);
};
