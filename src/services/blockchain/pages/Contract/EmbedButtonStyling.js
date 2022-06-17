import React, { useEffect } from 'react';

import { Box, Button, Stack, TextField, Typography } from 'ds/components';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useEmbedBttonStyling } from './hooks/useEmbedBttonStyling';
import { CircularProgress, Grid } from '@mui/material';

const EmbedButtonStyling = ({ contract, id }) => {
    const {
        cssContext,
        onChange,
        handleIframeOnLoad,
        save,
        setCssContext
    } = useEmbedBttonStyling(contract, id);

    const [expanded, setExpanded] = React.useState(false);
    const handleChange = (panel) => (event, isExpanded) => setExpanded(isExpanded ? panel : false);

    useEffect(() => {
        if (contract?.embed?.css) {
            setCssContext(JSON.parse(contract?.embed?.css));
            setTimeout(() => handleIframeOnLoad(), 500);
        }
    }, []);

    return (
        <Stack gap={2} alignItems="flex-start">
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Embed Button Styling
            </Typography>

            {contract && <iframe width="100%" id="embed-button-iframe" scrolling="no" frameBorder="0" onLoad={handleIframeOnLoad} /> || <CircularProgress />}

            {Object.keys(cssContext).map(key => {
                const accordionLabel = key.replace(/-/g, " ");

                return (
                    <Accordion key={key} expanded={expanded === key} onChange={handleChange(key)} sx={{ width: '100%' }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`${key}-content`}
                            id={`${key}-header`}
                        >
                            <Typography sx={{ textTransform: 'uppercase' }}>{accordionLabel}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {Object.keys(cssContext[key]).map(styleKey => {
                                return (
                                    <Stack key={`${key}-${styleKey}`}>
                                        <TextField
                                            label={cssContext[key][styleKey]['label']}
                                            value={cssContext[key][styleKey]['value'] || ''}
                                            type={cssContext[key][styleKey]['type']}
                                            onChange={e => onChange(e.target.value, key, styleKey)}
                                            margin="normal"
                                        />
                                    </Stack>
                                )
                            })}
                        </AccordionDetails>
                    </Accordion>
                )
            })}

            <Grid container={true} justifyContent="flex-end" gap={4}>
                <Button size="small" color="secondary" variant="contained" onClick={handleIframeOnLoad}>View Changes</Button>
                <Button size="small" color="primary" variant="contained" onClick={save}>Save</Button>
            </Grid>
        </Stack>
    );
};

export default EmbedButtonStyling;
