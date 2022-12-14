import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from 'ds/components';
import { useLayerManager } from 'services/generator/controllers/manager';
import { defaultCss, baseCss, selectedCss, compiledImgCss } from './styles';

const Layer = ({ activeStep, index }) => {
    const {
        query: { layers, selected, selectedImage },
        actions: { setSelectedImage },
    } = useLayerManager();
    const isSelectedLayer = selected == index;
    const cssByStep = {
        1: baseCss,
        2: baseCss,
        3: selectedCss(isSelectedLayer),
        4: selectedCss(isSelectedLayer),
        5: compiledImgCss,
        6: compiledImgCss,
    }; //[activeStep]

    // Preview
    // useEffect(() => {
    //     if (activeStep == null) return;
    //     if (activeStep === 5) {
    //         const ChangeLayer = () => {
    //             const curLayer = layers[index];
    //             setSelectedImage(Math.floor(Math.random() * layers[index].images.length));
    //         }
    //         const id = setInterval(ChangeLayer, 1000);
    //         return () => clearInterval(id);
    //     }
    // }, [activeStep])

    return (
        <Box
            sx={{
                '&:not(:first-of-type)': {
                    marginTop:
                        activeStep == 5 || activeStep == 6
                            ? '-250px'
                            : '-300px',
                },
                transition: 'all .5s',
            }}>
            <motion.div
                transition={{ duration: 0.5 }}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}>
                <motion.div
                    transition={{ duration: 0.2 }}
                    animate={activeStep.toString()}
                    variants={cssByStep}
                    style={{
                        margin: '0 auto',
                        ...defaultCss,
                        //						...cssByStep
                    }}>
                    <AnimatePresence>
                        <motion.div
                            key={index}
                            transition={{ duration: 0.2 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}>
                            {
                                {
                                    'image/png': (
                                        <img
                                            src={
                                                layers[index]?.images[
                                                    activeStep != 5
                                                        ? selectedImage
                                                        : Math.floor(
                                                              Math.random() *
                                                                  layers[index]
                                                                      .images
                                                                      .length
                                                          )
                                                ]?.preview
                                            }
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    ),
                                    'video/mp4': (
                                        <video width="100%" loop autoPlay muted>
                                            <source
                                                src={
                                                    layers[index]?.images[
                                                        activeStep != 5
                                                            ? selectedImage
                                                            : Math.floor(
                                                                  Math.random() *
                                                                      layers[
                                                                          index
                                                                      ].images
                                                                          .length
                                                              )
                                                    ]?.preview
                                                }
                                                type="video/mp4"
                                            />
                                            Sorry, your browser doesn&apos;t
                                            support embedded videos.
                                        </video>
                                    ),
                                }[
                                    layers[index]?.images[
                                        activeStep != 5
                                            ? selectedImage
                                            : Math.floor(
                                                  Math.random() *
                                                      layers[index].images
                                                          .length
                                              )
                                    ]?.type
                                ]
                            }
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </Box>
    );
};

export default Layer;
