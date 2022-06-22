import React, { useEffect } from 'react';

import { Box, Button, Stack, TextField, Typography } from 'ds/components';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useEmbedBttonStyling } from './hooks/useEmbedBttonStyling';
import { CircularProgress, Grid } from '@mui/material';
import { FaSave, FaBold, FaUnderline, FaItalic } from 'react-icons/fa'
import { AiOutlineBold, AiOutlineUnderline, AiOutlineItalic } from 'react-icons/ai'
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

    const renderInput = (styleKey, key) => {
        const styleKeyArr = Object.keys(cssContext[key]).map((_styleKey) => _styleKey);   
        const isStyle = styleKeyArr.includes(styleKey);

        if (!isStyle) return null;

        const { label, value, type } = cssContext[key][styleKey];

        const variants = () => {
            switch(type) {
                case 'color':
                    return (
                        <Button 
                            variant='outlined' 
                            size='small' 
                            style={{ maxWidth: '65px', borderColor: '#e2e8f0' }}
                        >
                            <input
                                value={value}
                                type={type}
                                name={label}
                                onChange={e => onChange(e.target.value, key, styleKey)}
                            />
                        </Button>
                    )
                case 'number':
                    return (
                        <TextField                    
                            value={value}
                            type={type}
                            variant='outlined'
                            onChange={e => onChange(e.target.value, key, styleKey)}
                            size='small'
                        />
                    )
                case 'toggle':
                    return (
                        <Button 
                            variant='outlined'
                            size='small'
                            style={{ maxWidth: '30px', borderColor: '#e2e8f0', backgroundColor: value ? 'rgb(180,180,180)' : 'transparent' }}
                            onClick={e => onChange(!value, key, styleKey)}
                        >
                            {{
                                fontWeight: <AiOutlineBold color='black' fontWeight='normal' />,
                                textDecoration: <AiOutlineUnderline color='black' fontWeight='normal' />,
                                fontStyle: <AiOutlineItalic color='black' fontWeight='normal' />
                            }[styleKey]}
                        </Button>
                    )
                case 'direction':
                    return (
                        <Stack direction='row' justifyContent='space-between' gap={2}>
                            {value.map((val, idx) => (
                                <TextField           
                                    value={val}
                                    type='number'
                                    label={['Top', 'Right', 'Bottom', 'Left'][idx]}
                                    variant='outlined'
                                    onChange={e => onChange(e.target.value, key, styleKey, {
                                        type,
                                        index: idx,
                                        valueArray: value
                                    })}
                                    size='small'
                                    key={idx}
                                />
                            ))}
                        </Stack>
                    )
                default:
                    return null;
            }
        }

        return (
            <Stack gap={1}>
                <Typography fontSize='9pt'>
                    {label}
                </Typography>
                {variants()}
            </Stack>
        )
    }

    const renderInputContainer = (key) => {
        return (
            <Stack gap={2} backgroundColor='rgb(253,253,253)' padding='1em'>
                <Stack direction='row' gap={2} alignItems='flex-start' justifyContent='space-between'>
                    <Stack direction='row' gap={3}>
                        {renderInput('backgroundColor', key)}
                        {renderInput('color', key)}
                    </Stack>
                    <Stack direction='row' alignItems='flex-end' gap={1}>
                        {renderInput('fontWeight', key)}
                        {renderInput('textDecoration', key)}
                        {renderInput('fontStyle', key)}
                    </Stack>
                </Stack>
                <Stack direction='row' gap={2}>
                    {renderInput('fontSize', key)}
                    {renderInput('lineHeight', key)}
                    {renderInput('letterSpacing', key)}
                </Stack>
                {renderInput('borderRadius', key)}
                {renderInput('margin', key)}
                {renderInput('padding', key)}
            </Stack>
        )
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
                                {renderInputContainer(key)}
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
