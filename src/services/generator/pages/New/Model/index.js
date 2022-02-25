import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Stack, Typography, Box } from 'ds/components';
import { AnimatePresence } from "framer-motion"
import { useLayerManager } from 'services/generator/controllers/manager';
import useMediaQuery from '@mui/material/useMediaQuery';
import Layer from './Layer';
import GradientBackground from './GradientBackground';

const Model = ({activeStep, isLastStep}) => {
	const { query: {layers, selected}} = useLayerManager();
	const smallerThanTablet = useMediaQuery(theme => theme.breakpoints.down('md'));

	const controls = useAnimation();
	useEffect(() => {
		if(isLastStep) {
			controls.start(i => ({
				opacity: 1,
				transition: { delay: i * 0.5 },
			}))
		} else {
			controls.start(i => ({
				opacity: 0,
			}))
		}
	}, [isLastStep])


	return (
		<Stack
			alignItems="center"
			justifyContent="center"
			sx={{minHeight: '100vh', position: 'relative', background: '#191A24', transition: 'all .5s'}}
		>
			<AnimatePresence>
				{isLastStep ? (
					<motion.div
						transition={{ duration: .5 }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<GradientBackground />
					</motion.div>
				):null}
			</AnimatePresence>

			<Box sx={{position: smallerThanTablet ? 'static' : 'fixed'}}>
                {activeStep === 5 && (
                    <Stack gap={50} alignItems="center" direction="row" sx={{zIndex: 10}}>
                        <motion.div 
                            custom={1}
                            initial={{opacity: 0}} 
                            animate={controls}
                            style={{
                                background: 'white',
                                borderRadius: '7px',
                            }}
                        >
                            <AnimatePresence>
                                {layers.map((layer, i) => (
                                    <Layer
                                        activeStep={activeStep}
                                        index={i}
                                        key={i}
                                    />
                                ))}
                            </AnimatePresence>
                            {/* <img
                                style={{
                                    width: '200px',
                                    height: '200px',
                                    borderRadius: '7px'
                                }}
                                src="https://www.larvalabs.com/cryptopunks/cryptopunk3100.png"
                            />
                            <Stack alignItems="center" p={1} gap={1} direction="row">
                                <img style={{height: '25px'}} src="https://storage.opensea.io/files/accae6b6fb3888cbff27a013729c22dc.svg" />
                                <Typography sx={{fontWeight: 'bold'}} variant="h5">
                                    78
                                </Typography>
                                <Typography sx={{opacity: .7}} variant="body">
                                    ($297,223.68)
                                </Typography>
                            </Stack> */}
                        </motion.div>
                        <motion.div 
                            custom={2}
                            initial={{opacity: 0}} 
                            animate={controls}
                            style={{
                                background: 'white',
                                borderRadius: '7px',
                            }}
                        >
                            <AnimatePresence>
                                {layers.map((layer, i) => (
                                    <Layer
                                        activeStep={activeStep}
                                        index={i}
                                        key={i}
                                    />
                                ))}
                            </AnimatePresence>
                            {/* <img
                                style={{
                                    width: '200px',
                                    height: '200px',
                                    borderRadius: '7px'
                                }}
                                src="https://www.thestreet.com/.image/t_share/MTgyMDU5NDcwMTc4NzU1NzE1/boredape1.jpg"
                            />
                            <Stack alignItems="center" p={1} gap={1} direction="row">
                                <img style={{height: '25px'}} src="https://storage.opensea.io/files/accae6b6fb3888cbff27a013729c22dc.svg" />
                                <Typography sx={{fontWeight: 'bold'}} variant="h5">
                                    68	
                                </Typography>
                                <Typography sx={{opacity: .7}} variant="body">
                                    ($197,223.68)
                                </Typography>
                            </Stack> */}
                        </motion.div>
                    </Stack>
                )}

				<AnimatePresence>
					{layers.map((layer, i) => (
						<Layer
							activeStep={activeStep}
							index={i}
							key={i}
						/>
					))}
				</AnimatePresence>
			</Box>
		</Stack>
	)
};

export default Model;
