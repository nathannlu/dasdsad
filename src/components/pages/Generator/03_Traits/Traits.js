import React from 'react';
import { useLayerManager } from 'core/manager';
import { Stack, Box, Typography } from 'ds/components';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Layers as LayersIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { Content } from './Content';

const Traits = (props) => {
	const {
		query: { layers, selected },
		actions: { setSelected }
	} = useLayerManager();
	
	return (
		<Box>
			{layers.map((layer, i) => (
				<Accordion 
					key={i}
					expanded={selected == i} 
					onChange={e => { 
						setSelected(i)
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
						<Content editing={props.editing} index={i} />
					</AccordionDetails>
				</Accordion>
			))}
		</Box>
	)
};

export default Traits
