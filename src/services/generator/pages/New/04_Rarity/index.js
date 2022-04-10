import React from 'react';
import { Box, Stack, Button, Typography, Slider } from 'ds/components';
import {
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Layers as LayersIcon,
} from '@mui/icons-material';
import { useLayerManager } from 'services/generator/controllers/manager';
import Content from './Content';

const Rarity = (props) => {
    const {
        query: { layers, selected },
        actions: { setSelected },
    } = useLayerManager();

    return (
        <Stack
            gap={2}
            justifyContent="space-between"
            sx={{ minHeight: '90vh', paddingTop: '120px' }}>
            <Stack gap={2}>
                <Box>
                    <Chip sx={{ opacity: 0.8, mb: 1 }} label={'Step 4/5'} />
                    <Typography variant="h2">Edit your rarity</Typography>
                    <Typography variant="body">
                        Give your NFT collection unique characteristics
                    </Typography>
                </Box>

                <Box>
                    {layers
                        .map((layer, i) => (
                            <Accordion
                                key={i}
                                expanded={selected == i}
                                onChange={(e) => {
                                    setSelected(i);
                                }}
                                sx={{
                                    backgroundColor: 'rgb(25,26,36)',
                                }}>
                                <AccordionSummary
                                    id={i}
                                    expandIcon={
                                        <ExpandMoreIcon
                                            style={{ color: 'white' }}
                                        />
                                    }>
                                    <Stack
                                        gap={1}
                                        direction="row"
                                        sx={{ opacity: 0.8 }}
                                        alignItems="center">
                                        <LayersIcon
                                            style={{ color: 'white' }}
                                        />
                                        <Typography variant="h6" color="white">
                                            {layer.name}
                                        </Typography>
                                    </Stack>
                                </AccordionSummary>

                                <AccordionDetails>
                                    <Content layer={layer} />
                                </AccordionDetails>
                            </Accordion>
                        ))
                        .reverse()}
                </Box>
            </Stack>
            <Stack justifyContent="space-between" direction="row">
                <Button
                    onClick={() => props.previousStep()}
                    variant="contained"
                    style={{
                        backgroundColor: 'rgb(25,26,36)',
                        color: 'white',
                    }}>
                    Prev
                </Button>
                <Button
                    onClick={() => props.nextStep()}
                    style={{
                        backgroundColor: 'rgb(25,26,36)',
                        color: 'white',
                    }}>
                    Next
                </Button>
            </Stack>
        </Stack>
    );
};

export default Rarity;
