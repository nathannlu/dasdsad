import React, { useState } from 'react';
import { Stack, Button, Box, Typography } from 'ds/components';
import { Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Layers as LayersIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useCollection } from 'libs/collection';

import { Content } from './Content';

const Traits = props => {
	const { layers, setSelected } = useCollection();
	const [expanded, setExpanded] = useState(0);
	
	return (
		<Stack gap={2}>
			<Box>
				<Chip sx={{opacity: .8, mb: 1}} label={"Step 3/4"} />
				<Typography variant="h2">
					Add traits
				</Typography>
				<Typography variant="body">
					Give your NFT collection unique characteristics
				</Typography>
			</Box>

			<Box>
				{layers.map((layer, i) => (
					<Accordion 
						key={i}
						expanded={expanded == i} 
						onChange={e => { 
							setSelected(i)
							setExpanded(i)
						}}
					>
						<AccordionSummary id={i} expandIcon={<ExpandMoreIcon />}>
							<Stack gap={1} direction="row" sx={{opacity: .8}} alignItems="center">
								<LayersIcon />
								<Typography variant="h6">
									{layer.name}
								</Typography>
							</Stack>
						</AccordionSummary>

						<AccordionDetails>
							<Content index={i} />
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

export default Traits;
