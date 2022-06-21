import React, { useEffect } from 'react';

import { Box, Button, Stack, TextField, Typography } from 'ds/components';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useEmbedBttonStyling } from './hooks/useEmbedBttonStyling';
import { CircularProgress, Grid } from '@mui/material';
import { FaSave } from 'react-icons/fa'
import { IoMdRefresh } from 'react-icons/io'

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

    const renderInput = (key, styleKey) => {
        const label = cssContext[key][styleKey]['label'];
        const value = cssContext[key][styleKey]['value'] || '';
        const type = cssContext[key][styleKey]['type'];
        const props = { label, value, type };

        switch(type) {
            case 'color':
                return (
                    <TextField
                        {...props}
                        onChange={e => onChange(e.target.value, key, styleKey)}
                        margin="normal"
                    />
                )
            case 'number':
                return (
                    <TextField
                        {...props}
                        onChange={e => onChange(e.target.value, key, styleKey)}
                        margin="normal"
                    />
                )
            default:
                return null;
        }
    }

    return (
        <Grid direction='row' container={true} gap={2} alignItems="flex-start" wrap='wrap' columns={2} marginTop='1em'>
            <Stack flex='1'>
                {Object.keys(cssContext).map(key => {
                    const accordionLabel = key.replace(/-/g, " ");

                    return (
                        <Accordion key={key} expanded={expanded === key} onChange={handleChange(key)} sx={{ width: '100%' }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`${key}-content`}
                                id={`${key}-header`}
                            >
                                <Typography sx={{ textTransform: 'uppercase' }} fontSize='10pt' color='#707070'>{accordionLabel}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {Object.keys(cssContext[key]).map(styleKey => {
                                    return (
                                        <Stack key={`${key}-${styleKey}`}>
                                            {renderInput(key, styleKey)}
                                        </Stack>
                                    )
                                })}
                            </AccordionDetails>
                        </Accordion>
                    )
                })}
            </Stack>
            <Stack flex='1' gap={2}>
                <Box p='2em' backgroundColor='rgb(245,245,245)' border='1px solid #e2e8f0'>
                    {contract && <iframe width="100%" id="embed-button-iframe" scrolling="no" frameBorder="0" onLoad={handleIframeOnLoad} /> || <CircularProgress />}
                </Box>
                <Grid container={true} justifyContent="flex-end" gap={2}>
                    <Button size="small" color="secondary" variant="contained" onClick={handleIframeOnLoad} startIcon={<IoMdRefresh />}>View Changes</Button>
                    <Button size="small" color="primary" variant="contained" onClick={save} startIcon={<FaSave />}>Save</Button>
                </Grid>
            </Stack>
        </Grid>
    );
};

export default EmbedButtonStyling;
