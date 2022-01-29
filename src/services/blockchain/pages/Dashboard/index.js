import React from 'react';
import { Button, Link, Box, Typography, Stack, Card, Grid, Fade } from 'ds/components';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material'
import { useDeploy } from 'libs/deploy';

const Dashboard = () => {
	const { contracts } = useDeploy();
	
	return (
		<Fade in>
			<Box sx={{pt: 10}}>
				{contracts.length > 0 ? (
					<Box>
						<Box>
							<Typography gutterBottom variant="h4">
								Your contracts
							</Typography>
						</Box>

						<Grid container>
							{contracts.map((contract, i) => (
							<Grid item xs={4}>
								<Link to={`/contract/${contract.id}`}>
									<Card variant="outlined">
										<Box sx={{ bgcolor: 'grey.300', p:5}}>
											<img 
												style={{width: '100%'}}
												src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d2aac6943de77b8cf95ef1_deploy-to-blockchain-icon.png"
											/>
										</Box>
										<Box sx={{
											bgcolor: 'white',
											p: 2
										}}>
											<Stack direction="row" gap={2}>
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
					</Box>
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

			</Box>
		</Fade>
	)
};

export default Dashboard;


