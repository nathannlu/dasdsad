import React from 'react';
import { Stack } from 'ds/components';
import { AnimatePresence } from "framer-motion"
import { useCollection } from 'libs/collection';
import Layer from './Layer';

const Model = props => {
	const { layers, selected } = useCollection();

	return (
		<Stack alignItems="center" sx={{height: '100%', paddingTop: '250px'}}>
			<AnimatePresence>
				{layers.map((layer, i) => (
					<Layer 
						activeStep={props.activeStep}
						index={i}
						key={i}
					/>
				))}
			</AnimatePresence>
		</Stack>
	)
};

export default Model;
