import React, { useState, useEffect } from 'react';
import { Box, Stack, Button, Typography, Slider } from 'ds/components';
import { Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Content from './Content';

import { useCollection } from 'libs/collection';
import { useTraitsManager } from '../hooks/useTraitsManager'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LayersIcon from '@mui/icons-material/Layers';

const Rarity = props => {
	const {
		layers,
		setSelected,
	} = useCollection();
	const { onChange: onImageRarityChange } = useTraitsManager();
	const [expanded, setExpanded] = useState(0)

	
	return (
		<Stack gap={2}>
			<Box>
				<Chip sx={{opacity: .8, mb: 1}} label={"Step 4/4"} />
				<Typography variant="h2">
					Edit your rarity
				</Typography>
				<Typography variant="body">
					Give your NFT collection unique characteristics
				</Typography>
			</Box>


			<Box>
				{layers.map((layer, i) => (
					<Accordion expanded={expanded == i} onChange={e => { 
						setExpanded(i)
						setSelected(i);
					}}>
						<AccordionSummary id={i} expandIcon={<ExpandMoreIcon />}>
							<Stack gap={1} direction="row" sx={{opacity: .8}} alignItems="center">
								<LayersIcon />
								<Typography variant="h6">
									{layer.name}
								</Typography>
							</Stack>
						</AccordionSummary>

						<AccordionDetails>
							<Content layer={layer} />
						</AccordionDetails>
					</Accordion>
				))}
			</Box>
			
			<Stack direction="row">
				<Button onClick={() => props.previousStep()}>
					Prev
				</Button>
				<Button onClick={() => props.nextStep()}>
					Next
				</Button>
			</Stack>
		</Stack>
	)
};

export default Rarity;
