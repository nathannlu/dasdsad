import React, { useState, useEffect } from "react";
import { useNode, useEditor } from '@craftjs/core';
import { useToast } from 'ds/hooks/useToast';
import { Fade, Button, IconButton, Box, Stack, Typography, TextField } from "ds/components";
import { useForm } from 'ds/hooks/useForm';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { DeleteOutlineOutlined as DeleteIcon } from '@mui/icons-material'
import { Widget } from "@uploadcare/react-widget";
import { useWebsite } from "services/website/provider"

export const Settings = () => {
	const { addToast } = useToast();
	const { props, actions: {setProp} } = useNode(node => ({
		props: node.data.props
	}));
    const { query, selected, connectors: {select} } = useEditor((state, query) => {
		const [currentNodeId] = state.events.selected.values();
        const selected = {
            name: state.nodes[currentNodeId].data.name
        }
		return { selected };
	})
    const { deleteImage, onSaveChanges, imagePlaceHolders, addImageToLocal } = useWebsite();

    useEffect(() => {
        console.log(props);
    }, [])

    const onChangeItem = (e, key, parentKey = '', componentIdx = -1) => {
        const {name, value} = e.target;

        if (parentKey.length && componentIdx != -1) { // If inside array (Ex: features)
            setProp(props => {
                props[parentKey].value[componentIdx][name].value = value;
            });	
        }
        else if (parentKey.length && componentIdx == -1) { // If value is an object (Ex. button)
            setProp(props => {
                props[parentKey].value[name].value = value;
            });	
        }
        else {
            setProp(props => {
                props[name].value = value;
            });
        }
    }

    const onSwitchItem = (e, key, parentKey = '', componentIdx = -1) => {
        const {name, value} = e.target;

        if (parentKey.length && componentIdx != -1) { // If inside array (Ex: features)
            setProp(props => {
                props[parentKey].value[componentIdx][name].value = !props[parentKey].value[componentIdx][name].value;
            });	
        }
        else if (parentKey.length && componentIdx == -1) { // If value is an object (Ex. button)
            setProp(props => {
                props[parentKey].value[name].value = !props[parentKey].value[name].value;
                if(props[parentKey].value[name].value) {
                    addToast({
                        severity: 'success',
                        message: 'The button is now a minting button'
                    })
                } else {
                    addToast({
                        severity: 'success',
                        message: 'The button is now a link button'
                    })
                }
            });	
        }
        else {
            setProp(props => {
                props[name].value = !props[name].value;
            });
        }
    }

    const addItem = (key) => {
        let newObj;
        if (key === 'features') {
            newObj = {
                title: {
                    value: `SubHeading`,
                    _type: 'textfield'
                },
                content: {
                    value: 'Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug VHS try-hard ugh iceland kickstarter tumblr live-edge tilde.',
                    _type: 'textarea'
                }
            }
        }
        else if (key === 'content') {
            newObj = {
                content: {
                    value: 'Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug VHS try-hard ugh iceland kickstarter tumblr live-edge tilde.',
                    _type: 'textarea'
                },
                image: {
                    value: 'https://dummyimage.com/720x400',
                    _type: 'image'
                },
                subtitle: {
                    value: 'SubTitle',
                    _type: 'textfield'
                },
                title: {
                    value: 'Title',
                    _type: 'textfield'
                },
            }
        }

        setProp(props => {
			props[key].value = [...props[key].value, newObj];
		});
    }

    const deleteItem = (key, idx) => {
        if(props[key].value.length > 1) {
			setProp(props => {
				props[key].value.splice(idx, 1)
			});		
		} else {
			addToast({
				severity: 'warning',
				message: 'Cannot delete last item'
			})
		}
    }

    const onSetImage = (src, key, parentKey = '', componentIdx = -1) => {
        if (parentKey.length && componentIdx != -1) { // If inside array (Ex: content)
            setProp(props => {
                props[parentKey].value[componentIdx][key].value = src;
            });	
        }
        else if (parentKey.length && componentIdx == -1) { // If value is an object
            setProp(props => {
                props[parentKey].value[key].value = src;
            });	
        }
        else {
            setProp(props => {
                props[key].value = src;
            });
        }
    }

    const onChangeImage = (info, key, parentKey = '', componentIdx = -1) => {
        onSetImage(info.cdnUrl, key, parentKey, componentIdx);
        addImageToLocal(info.uuid);
    }

    const onDeleteImage = async (key, parentKey = '', componentIdx = -1) => {
        let placeholderSrc = '';
        if (selected.name === 'Hero_A' || selected.name === 'Hero_B' || selected.name === 'Hero_C') placeholderSrc = 'https://dummyimage.com/720x600';
        else if (selected.name === 'Header_A' || selected.name === 'Footer_A') placeholderSrc = 'https://via.placeholder.com/50';
        else if (selected.name === 'Content_B') placeholderSrc = 'https://dummyimage.com/720x400';
        else if (selected.name === 'Feature_C') placeholderSrc = 'https://dummyimage.com/460x500';

        let urlValue;
        if (parentKey.length && componentIdx != -1) { 
            urlValue = props[parentKey].value[componentIdx][key].value;
        }
        else if (parentKey.length && componentIdx == -1) { 
            urlValue = props[parentKey].value[key].value;
        }
        else {
            urlValue = props[key].value;
        }

        const uuid = urlValue.substring(urlValue.indexOf(".com/") + 5, urlValue.length - 1);

        onSetImage(placeholderSrc, key, parentKey, componentIdx);
        await deleteImage(uuid);
        await onSaveChanges(query);
    }

    // I just did conditions instead of mapping because mapping will trigger all the keys for some reason
    const generateField = (component, key, type, parentKey = '', componentIdx = -1) => {
        return (
            <Box width='100%'>
                {type === 'textfield' && (
                    <TextField name={key} onChange={(e) => onChangeItem(e, key, parentKey, componentIdx)} value={component[key].value} fullWidth size='small' />
                )}
                {type === 'textarea' && (
                    <TextField name={key} onChange={(e) => onChangeItem(e, key, parentKey, componentIdx)} value={component[key].value} fullWidth size='small' multiline row={4}/>
                )}
                {type === 'array' && (
                    <>
                        {component[key].value.map((item, idx) => (
                            <Box 
                                key={idx} 
                                sx={{background: '#f0f2f5', p: 2, mb: 2, boxShadow: 1, borderRadius: 2}}
                                display='flex'
                                flexDirection='column'
                                width='100%'
                            >
                                {generateSettings(item, key, idx)}
                                <Box>
                                    <IconButton
                                        size="small"
                                        onClick={() => deleteItem(key, idx)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        ))}
                        <Button onClick={() => addItem(key)} variant="contained" size='small'>
                            Add Item
                        </Button>
                    </>
                )}
                {type === 'image' && (           
                   <>
                        {imagePlaceHolders.some(img => component[key].value.includes(img)) ? (
                            <Widget 
                                publicKey="dfeba611508a6f7760ca"
                                id={key}
                                onChange={info => onChangeImage(info, key, parentKey, componentIdx)}
                            />
                        ) : (
                            <Button
                                variant='contained'
                                color='error'
                                size='small'
                                onClick={() => onDeleteImage(key, parentKey, componentIdx)}
                            >
                                Delete
                            </Button>
                        )}
                   </>
                )}
                {type === 'button' && (
                    <Box 
                        sx={{background: '#f0f2f5', p: 2, mb: 2, boxShadow: 1, borderRadius: 2}}
                        display='flex'
                        flexDirection='column'
                        width='100%'
                    >
                        {generateSettings(component[key].value, key)}
                    </Box>
                )}
                {type === 'boolean' && (
                    <Button
                        size="small"
                        name={key}
                        onClick={e => onSwitchItem(e, key, parentKey, componentIdx)}
                        variant='contained'
                    >
                        {component[key].value ? "Toggle Link" : "Toggle Mint"}
                    </Button>
                )}
            </Box>
        )
    }
    
    const generateSettings = (component, parentKey = '', componentIdx = -1) => {
        return Object.keys(component).map((key, idx) => (
            <Box 
                key={idx}
                display='flex'
                flexDirection='column'
                alignItems='flex-start'
                sx={{
                    mb: '2em'
                }}
            >
                <Typography style={{fontWeight: 'bold', textTransform: 'capitalize', mb: '1em'}} variant="h6">
                    {key}
                </Typography>
                <Stack direction='row' spacing={1} alignItems='center' marginBottom='.5em'>
                    {key !== 'features' && key !== 'button' && key !== 'isMint' && <InfoOutlinedIcon sx={{ color: 'rgba(0,0,0,.65)', fontSize: 18 }} />}
                    {{
                        'title': (
                            <Typography sx={{ color: 'rgba(0,0,0,.65)', fontSize: '10pt', my: '.5em' }}>
                                Enter a title:
                            </Typography>
                        ),
                        'content': (
                            <Typography sx={{ color: 'rgba(0,0,0,.65)', fontSize: '10pt', my: '.5em' }}>
                                Enter a content:
                            </Typography>
                        ),
                        'image': (
                            <Typography sx={{ color: 'rgba(0,0,0,.65)', fontSize: '10pt', my: '.5em' }}>
                                Upload your image:
                            </Typography>
                        ),
                        'background': (
                            <Typography sx={{ color: 'rgba(0,0,0,.65)', fontSize: '10pt', my: '.5em' }}>
                                Enter a background color:
                            </Typography>
                        ),
                        'text': (
                            <Typography sx={{ color: 'rgba(0,0,0,.65)', fontSize: '10pt', my: '.5em' }}>
                                Enter a label:
                            </Typography>
                        ),
                        'link': (
                            <Typography sx={{ color: 'rgba(0,0,0,.65)', fontSize: '10pt', my: '.5em' }}>
                                Enter a link:
                            </Typography>
                        ),
                    }[key]}
                </Stack>
                {generateField(component, key, component[key]._type, parentKey, componentIdx)}
            </Box>
        ))
    }

    return (
        <Box>
            {generateSettings(props)}
        </Box>
    )
}
