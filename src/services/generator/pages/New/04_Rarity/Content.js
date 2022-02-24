import React, { useEffect } from 'react';
import { Box, Stack, Slider } from 'ds/components';
import { Chip, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useTrait } from 'services/generator/controllers/traits';
import useMediaQuery from '@mui/material/useMediaQuery';

const Content = ({ layer }) => {
	const { updateTraitRarity } = useTrait();
	const smallerThanMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

	return (
		<Table aria-label="simple table">
			<TableHead>
				<TableRow>
					<TableCell sx={{fontWeight: 'bold', color: 'white', border: 'none'}}>
						Trait name
					</TableCell>
					<TableCell sx={{fontWeight: 'bold', color: 'white', border: 'none'}}>
						Percentage
					</TableCell>
					<TableCell sx={{fontWeight: 'bold', color: 'white', border: 'none'}}>
						Rarity
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{layer.images?.map((image,i) => (
					<TableRow key={i}>
						<TableCell 
							sx={smallerThanMobile ? {width:'50px'}: {}}
							style={{
								border: 'none'
							}}
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
								color='white'
							>
								{image.name}
							</Box>
						</TableCell>
						<TableCell
							style={{
								border: 'none',
								color: 'white'
							}}
						>
							{image.rarity.percentage.toFixed(2)}%
						</TableCell>
						<TableCell
							style={{
								border: 'none'
							}}
						>
							<Stack alignItems="center" direction="row">
								<Chip 
									sx={smallerThanMobile ? {fontSize:'10px'}: {}}
									label="Rare" 
									style={{
										color: 'white'
									}}
								/>
								<Slider
									name="weight"
									defaultValue={50}
									min={1}
									max={100}
									step={1}
									marks
									value={image.rarity.value}
									onChange={e => updateTraitRarity(i, e.target.value)}
								/>
								<Chip
									sx={smallerThanMobile ? {fontSize:'10px'}: {}}
									label="Common" 
									style={{
										color: 'white'
									}}
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
