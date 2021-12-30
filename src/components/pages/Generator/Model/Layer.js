import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion"
import { Box } from 'ds/components';
import { useLayerManager } from 'core/manager';
import { useTrait } from 'core/traits'

import { defaultCss, baseCss, selectedCss, compiledImgCss } from './styles';

const Layer = ({activeStep, index}) => {
	const {query: { layers, selected }} = useLayerManager();

	const { selectedImage } = useTrait();

	const isSelectedLayer = selected == index;
	const cssByStep = {
		1: baseCss,
		2: baseCss,
		3: selectedCss(isSelectedLayer),
		4: selectedCss(isSelectedLayer),
		5: compiledImgCss,
		6: compiledImgCss
	}//[activeStep]


	return (
		<Box sx={{
			'&:not(:first-of-type)': {
				marginTop: activeStep == 5 || activeStep == 6 ? '-250px' : '-300px'
			},
			transition: 'all .5s',
		}}>
			<motion.div
				transition={{ duration: .5 }}
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: 50, opacity: 0 }}
			>
				<motion.div 
					transition={{ duration: .2 }}
					animate={activeStep.toString()}
					variants={cssByStep}
					style={{
						margin: '0 auto',
						...defaultCss,
//						...cssByStep
					}}
				>
					<AnimatePresence>
						<motion.img
							key={index}
							transition={{ duration: .2 }}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							src={layers[index]?.images[selectedImage]?.preview}
							style={{width: '100%', height: '100%', objectFit: 'cover'}}
						/>
					</AnimatePresence>
				</motion.div>
			</motion.div>
		</Box>
	)
};

export default Layer;
