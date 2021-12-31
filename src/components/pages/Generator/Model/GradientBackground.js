import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Typography } from 'ds/components';
import { Gradient } from '../scripts/gradient';

const GradientBackground = () => {
	useEffect(() => {
		var gradient = new Gradient();
		gradient.initGradient("#gradient-canvas");
	}, [])

	return (
		<>
			<canvas id="gradient-canvas" data-js-darken-top data-transition-in style={{position:'absolute',zIndex: 0, top: 0, left: 0, background: '#191A24'}}></canvas>


			<motion.div
				transition={{ delay: 2, duration: .5 }}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
			>
				<Typography 
					variant="h1" 
					sx={{
						position: 'absolute', 
						bottom: '10%',
						width: '100%',
						textAlign: 'center',
						mixBlendMode: 'color-burn',
						color: '#2b044d',
						left: 0
					}}
				>
					Be the next BAYC
				</Typography>
			</motion.div>
		</>
	)
};

export default GradientBackground;
