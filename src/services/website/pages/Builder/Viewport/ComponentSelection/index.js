import React, { useEffect } from 'react';
import {
    Fade,
    Stack,
    Typography,
    Modal,
    Grid,
    Box,
    Button,
    Container,
} from 'ds/components';
import { useEditor, useNode } from '@craftjs/core';
import { useViewport } from '../context';
import templates from 'services/website/pages/Builder/blocks/main';
import getIcons from 'ds/components/icons';

const iconList = getIcons();

const ComponentSelection = (props) => {
    const { isComponentSelectionOpen, closeComponentSelection, addComponent } =
        useViewport();

    // messyTemplates is an array of item arrays
    // item arrays has template key & template component
    // e.g. ["Content_A", props => {...}]
    let messyTemplates = Object.entries(templates);
    let categorizedTemplates = [];
    messyTemplates.map((template) => {
        // Split up key (e.g. Content_A into ["Content", "A"])
        const groupKey = template[0].split('_')[0];
        const variant = template[0].replace('_', '');
        const templateFunc = template[1];

        //
        // TEMP FIX
        //
        //		if(groupKey !== "Container") {
        if (
            groupKey !== 'Container' &&
            groupKey !== 'Header' &&
            groupKey !== 'Footer'
        ) {
            // if groupkey exists, add to group object
            let groupKeyExists = categorizedTemplates.find(
                (item) => item.groupKey === groupKey
            );
            if (groupKeyExists) {
                let arrIndex = categorizedTemplates.findIndex(
                    (item) => item.groupKey === groupKey
                );
                categorizedTemplates[arrIndex].templates.push({
                    variant,
                    template: templateFunc,
                });
            }

            // if not make new group key and create the object
            else {
                let newGroup = {
                    groupKey,
                    templates: [{ variant, template: templateFunc }],
                };
                categorizedTemplates.push(newGroup);
            }
        }
    });

    return (
        <Modal
            style={{
                width: '1200px',
                margin: '96px auto',
                overflow: 'scroll',
            }}
            onBackdropClick={() => closeComponentSelection()}
            open={isComponentSelectionOpen}>
            <Fade in={isComponentSelectionOpen}>
                <Stack
                    direction="column"
                    sx={{
                        bgcolor: 'white',
                        minHeight: '240px',
                        minWidth: '540px',
                    }}>
                    <Box
                        sx={{
                            bgcolor: 'white',
                            borderBottom: 1,
                            borderColor: 'grey.300',
                            p: 4,
                        }}>
                        <Typography variant="h4">Add a component</Typography>
                    </Box>
                    <Stack gap={2} sx={{ bgcolor: 'grey.100', p: 4 }}>
                        {categorizedTemplates.map((group, idx) => (
                            <Stack key={idx} sx={{ paddingBottom: 3 }}>
                                <Typography gutterBottom variant="h5">
                                    {group.groupKey}
                                </Typography>
                                <Stack gap={2} direction="row">
                                    {group.templates.map((t, idx) => (
                                        <Grid
                                            key={idx}
                                            item
                                            xs={2}
                                            sx={{
                                                border: '1px solid #e8e8e8',
                                                boxShadow:
                                                    '0 3px 14px 0 rgb(0 0 0 / 5%)',
                                                borderRadius: '4px',
                                                overflow: 'hidden',
                                            }}
                                            onClick={() =>
                                                addComponent(t.template)
                                            }>
                                            {/*
                                                iconList[group.groupKey][
                                                    t.variant
                                                ]
																								*/}
                                        </Grid>
                                    ))}
                                </Stack>
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
            </Fade>
        </Modal>
    );
};

export default ComponentSelection;
