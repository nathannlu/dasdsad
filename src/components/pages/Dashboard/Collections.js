import React from 'react';
import { Button, Link, Box, TextField, Typography, Stack, Card, Grid, Modal, Fade } from 'ds/components';
import AddIcon from '@mui/icons-material/Add';
import { useGenerator } from 'core/generator';
import { useMetadata } from 'core/metadata';

const Collections = () => {

	const { settingsForm: { name }} = useMetadata();
	const { start, progress, save, done } = useGenerator();
	
	return (
		<Fade in>
			<Box sx={{mt: 10}}>
				{start ? (
					<Box>
						<Box>
							<Typography gutterBottom variant="h4">
								Your NFT collections
							</Typography>
						</Box>

						<Grid item xs={4}>
							<Card variant="outlined">
								<Box sx={{ bgcolor: 'grey.300', p:5}}>
									<img 
										style={{width: '100%'}}
										src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d2aac6d6d8ca05462d87fd_nft-generator-traits-icon.png" 
									/>
								</Box>
								<Box sx={{
									bgcolor: 'white',
									p: 2
								}}>
									<Typography gutterBottom variant="h6">
										{name.value}
									</Typography>

									<Stack direction="row" gap={2}>
										<Button
											size="small"
											variant="contained"
											disabled={!done}
											onClick={save}
										>
											Download collection
										</Button>
									</Stack>
								</Box>
							</Card>
						</Grid>
					</Box>
				) : (
					<Grid item xs={4} sx={{margin: '0 auto'}}>
						<Stack mt={10} gap={2}>
							<Box>
								<Stack gap={1} mb={1} direction="row" alignItems="center">
									<img 
										style={{height: '40px'}}
										src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d2aac6d6d8ca05462d87fd_nft-generator-traits-icon.png" 
									/>
									<Typography variant="body" sx={{fontWeight: 'bold', opacity: .8}}>
										Smart contracts
									</Typography>
								</Stack>
								<Typography gutterBottom variant="h6" sx={{fontWeight: 'bold'}}>
									Create your first NFT collection
								</Typography>
								<Typography variant="body" sx={{opacity: .8}}>
									Create your layers, drag and drop your traits, customize your rarity, to generate up to 10,000 NFTs.
								</Typography>
							</Box>
							<Box>
								<Link to="/generator">
									<Button startIcon={<AddIcon />} variant="contained" size="small">
										Create your collection
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

export default Collections;
