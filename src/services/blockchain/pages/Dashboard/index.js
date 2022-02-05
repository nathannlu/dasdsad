import React from 'react';
import { Container, Button, Link, Box, Typography, Stack, Card, Grid, Fade } from 'ds/components';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material'
import { useContract } from 'services/blockchain/provider';

const Dashboard = () => {
	const { contracts } = useContract();
	
	return (
		<Fade in>
			<Container sx={{pt: 4}}>
				{contracts.length > 0 ? (
					<Stack gap={2}>
						<Stack direction="row" alignItems="center">
							<Box>
								<Typography variant="h4">
									Your contracts
								</Typography>
								<Typography gutterBottom variant="body">
									A list of your deployed contracts
								</Typography>
							</Box>

							<Box sx={{ml:'auto'}}>
								<Link to="/smart-contracts/new">
									<Button
										size="small"
										startIcon={<AddIcon />}
										variant="contained"
									>
										Add contract
									</Button>
								</Link>
							</Box>
						</Stack>

						<Grid gap={2} container>
							{contracts.map((contract, i) => (
							<Grid key={i} item xs={3}>
								<Link to={`/smart-contracts/${contract.id}`}>
									<Card variant="outlined">
										<Box sx={{ bgcolor: 'grey.100', p:5}}>
											<img 
												style={{width: '100%'}}
												src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61f8e07dada6650c668f1147_smart-contract.png"
											/>
										</Box>
										<Box sx={{
											bgcolor: 'white',
											p: 2
										}}>
											<Stack direction="row" gap={2}>
												<Typography>
													{contract.name}
												</Typography>

												<Button
													size="small"
													variant="contained"
												>
													View Contract
												</Button>
											</Stack>
										</Box>
									</Card>
								</Link>
							</Grid>
							))}
						</Grid>
					</Stack>
				) : (
					<Grid item xs={4} sx={{margin: '0 auto'}}>
						<Stack mt={10} gap={2}>
							<Box>
								<img 
									style={{height: '40px'}}
									src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d2aac6943de77b8cf95ef1_deploy-to-blockchain-icon.png" 
								/>
							</Box>
							<Stack>
								<Typography gutterBottom variant="h6" sx={{fontWeight: 'bold'}}>
									Create your first smart contract
								</Typography>
								<Typography variant="body" sx={{opacity: .8}}>
									Deploy your NFT collection to ethereum with our no-code smart contracts
								</Typography>
							</Stack>
							<Box>
								<Link to="/smart-contracts/new">
									<Button startIcon={<AddIcon />} variant="contained" size="small">
										Create smart contract
									</Button>
								</Link>
							</Box>
						</Stack>
					</Grid>
				)}

			</Container>
		</Fade>
	)
};

export default Dashboard;


