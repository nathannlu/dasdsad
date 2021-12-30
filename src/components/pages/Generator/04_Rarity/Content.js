import React from 'react';
import { Box, Stack, Slider } from 'ds/components';
import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useTrait } from 'core/traits';

const Content = ({ layer }) => {
	const { updateTraitRarity } = useTrait();
	
	return (
		<Table sx={{ minWidth: 650 }} aria-label="simple table">
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
						<TableCell>
							<img style={{width: '50px', height: '50px', border: '1px solid rgba(0,0,0,.5)', borderRadius: '5px'}} src={image.preview} />
							<Box>
								{image.name}
							</Box>
						</TableCell>

						<TableCell>
							<Stack alignItems="center" direction="row">
								<Chip label="Rare" />
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
								<Chip label="Common" />
							</Stack>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
};

export default Content;
