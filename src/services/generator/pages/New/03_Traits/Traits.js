import React from 'react';
import { useLayerManager } from 'services/generator/controllers/manager';
import { Stack, Box, Typography } from 'ds/components';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import {
    Layers as LayersIcon,
    ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { Content } from './Content';

const Traits = (props) => {
    const {
        query: { layers, selected },
        actions: { setSelected },
    } = useLayerManager();

    return (
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
                                <ExpandMoreIcon style={{ color: 'white' }} />
                            }>
                            <Stack
                                gap={1}
                                direction="row"
                                sx={{ opacity: 0.8 }}
                                alignItems="center">
                                <LayersIcon style={{ color: 'white' }} />
                                <Typography variant="h6" color="white">
                                    {layer.name}
                                </Typography>
                            </Stack>
                        </AccordionSummary>

                        <AccordionDetails>
                            <Content editing={props.editing} index={i} />
                        </AccordionDetails>
                    </Accordion>
                ))
                .reverse()}
        </Box>
    );
};

export default Traits;
