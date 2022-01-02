import React from 'react';
import { Box, Stack, Slider } from 'ds/components';
import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useTrait } from 'core/traits';
import useMediaQuery from '@mui/material/useMediaQuery';

const Content = ({ layer }) => {
	const { updateTraitRarity } = useTrait();
	const smallerThanMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));
	
	return (
		<Table aria-label="simple table">
			<TableHead>
				<TableRow>
					<TableCell sx={{fontWeight: 'bold'}}>
						Trait name
					</TableCell>
					<TableCell sx={{fontWeight: 'bold'}}>
						Rarity
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{layer.images?.map((image,i) => (
					<TableRow>
						<TableCell 
							sx={smallerThanMobile ? {width:'50px'}: {}}
						>
							{image.type == 'image/png' ? (
								<img 
									style={{width: '50px', height: '50px', border: '1px solid rgba(0,0,0,.5)', borderRadius: '4px'}} 
									src={image.preview}
								/>
							): null}
							{image.type == 'video/mp4' ? (
								<video width="50px" height="50px" loop autoPlay muted>
									<source src={image.preview} type="video/mp4" />
										Sorry, your browser doesn't support embedded videos.
								</video>
							): null}
							<Box
								sx={smallerThanMobile ? {fontSize:'10px'}: {}}
							>
								{image.name}
							</Box>
						</TableCell>

						<TableCell>
							<Stack alignItems="center" direction="row">
								<Chip 
									sx={smallerThanMobile ? {fontSize:'10px'}: {}}
									label="Rare" 
								/>
								<Slider
									name="weight"
									defaultValue={30}
									min={10}
									max={50}
									step={10}
									marks
									value={image.weight}
									onChange={e => updateTraitRarity(i, e.target.value)}
								/>
								<Chip
									sx={smallerThanMobile ? {fontSize:'10px'}: {}}
									label="Common" 
								/>
							</Stack>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
};

export default Content;
