import React, { useState } from 'react';
import { Stack, Button, Box, Typography } from 'ds/components';
import { useValidateForm } from '../hooks/useValidateForm'
import { Chip } from '@mui/material';
import T from './Traits';


const Traits = props => {
	/*
	const {
		query: { layers, selected },
		actions: { setSelected }
	} = useLayerManager();
	*/
	const { validateLayerTraits } = useValidateForm();

	return (
		<Stack gap={2} justifyContent="space-between" sx={{minHeight: '90vh', paddingTop: '120px'}}>
			<Stack gap={2}>
				<Box>
					<Chip sx={{opacity: .8, mb: 1}} label={"Step 3/4"} />
					<Typography variant="h2">
						Add traits
					</Typography>
					<Typography variant="body">
						Give your NFT collection unique characteristics. Please make sure all your images have the same dimensions.
					</Typography>
				</Box>

				{/*
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
								<Content index={i} />
							</AccordionDetails>
						</Accordion>
					))}
				</Box>
				*/}
				<T editing={true} />
			</Stack>

			<Stack justifyContent="space-between" direction="row">
				<Button onClick={() => props.previousStep()}>
					Prev
				</Button>
				<Button onClick={() => validateLayerTraits() && props.nextStep()}>
					Next
				</Button>
			</Stack>
		</Stack>
	)
};

export default Traits;
