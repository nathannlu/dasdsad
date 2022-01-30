//
// Rendering algorithm for settings inputs
//

import React, { useState, useEffect } from "react";
import { useNode, useEditor } from '@craftjs/core';
import { useToast } from 'ds/hooks/useToast';
import { Fade, Button, IconButton, Box, Stack, Typography, TextField } from "ds/components";
import { useForm } from 'ds/hooks/useForm';

import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { DeleteOutlineOutlined as DeleteIcon } from '@mui/icons-material'

import { Widget } from "@uploadcare/react-widget";
import { useWebsite } from "services/website/provider"

// Props object schema
// --
// const templateAProp = {							<-- props
//	title: {														<-- key
//		value: 'sample title',
//		_type: 'textfield',
//		description: 'Enter text below'
//	},
//	content: {...},
//	button: {...}
// }

const generateSettingFields = (props, onChange, addItem, deleteItem, flipBool, setImage, parentKey ) => {
    const { query } = useEditor();
    const { selected, connectors: {select} } = useEditor((state, query) => { // We should make a wrapper for craftJS
		const [currentNodeId] = state.events.selected.values();
        const selected = {
            name: state.nodes[currentNodeId].data.name
        }
		return { selected };
	})
    const { deleteImage, onSaveChanges, imagePlaceHolders } = useWebsite();

    const handleDeleteImage = async (parentKey, prop) => {
        let placeholderSrc = '';
        if (selected.name === 'Hero_A' || selected.name === 'Hero_B' || selected.name === 'Hero_C') placeholderSrc = 'https://dummyimage.com/720x600';
        else if (selected.name === 'Header_A' || selected.name === 'Footer_A') placeholderSrc = 'https://via.placeholder.com/50';
        else if (selected.name === 'Content_B') placeholderSrc = 'https://dummyimage.com/720x400';
        else if (selected.name === 'Feature_C') placeholderSrc = 'https://dummyimage.com/460x500';

        await deleteImage(prop.value.substring(prop.value.indexOf(".com/") + 5, prop.value.length - 1));
        setImage([parentKey], placeholderSrc);
        onSaveChanges(query, true);
    }

	return Object.keys(props).map(key => (
		<Box key={key} pb={3}>
			<Typography style={{fontWeight: 'bold', textTransform: 'capitalize'}} variant="h6">
				{key}
			</Typography>
			{props[key].description && (
				<Typography variant="body2" className="items-center">
					<InfoOutlinedIcon className="mr-1" />
					{props[key].description}
				</Typography>
			)}


			{{
				'textfield': (<TextField name={key} onChange={e => onChange(e, parentKey)} defaultValue={props[key].value} fullWidth />),
				'textarea': (<TextField name={key} onChange={e => onChange(e, parentKey)} defaultValue={props[key].value} fullWidth multiline minRows={3} />),
				'link': props[key]._type == 'link' && (
					<Box sx={{background: '#f0f2f5', p: 2, mb: 2, boxShadow: 1, borderRadius: 2}}>
						{generateSettingFields(props[key].value, onChange, addItem, deleteItem, flipBool, setImage, [key])}
					</Box>
				),
				'button': props[key]._type == 'button' && (
					<Box sx={{background: '#f0f2f5', p: 2, mb: 2, boxShadow: 1, borderRadius: 2}}>
						{generateSettingFields(props[key].value, onChange, addItem, deleteItem, flipBool, setImage, [key])}
					</Box>
				),
				'boolean': (
					<Button
						size="small"
						name={key}
						onClick={e => flipBool(e, [parentKey])}
					>
						{props[key].value ? "Turn into link" : "Turn into mint"}
					</Button>
				),
				'image': props[key]._type == 'image' && imagePlaceHolders.some(img => props[key].value.includes(img)) ? (
                    <Widget 
                        publicKey='dfeba611508a6f7760ca'
                        id={key}
                        onChange={info => setImage([parentKey], info.cdnUrl)}
                    />
                ) : (
                    <Button
                        variant='contained'
                        color='error'
                        size='small'
                        onClick={() => handleDeleteImage(parentKey, props[key])}
                    >
                        Delete
                    </Button>
                ),
				'array': props[key]._type == 'array' &&
					props[key].value.map((item, i) => (
						<Box key={i} sx={{background: '#f0f2f5', p: 2, mb: 2, boxShadow: 1, borderRadius: 2}}>
							{generateSettingFields(item, onChange, addItem, deleteItem, flipBool, setImage, [key,i])}
							<IconButton
								size="small"
								onClick={() => deleteItem(key, i)}
								color="error"
							>
								<DeleteIcon />
							</IconButton>
						</Box>
					))
			}[props[key]._type]}

			{
				props[key]._type == 'array' && (
					<Button onClick={() => addItem(key)} variant="contained">
						add item
					</Button>
				)
			}
		</Box>
    ))
}



export const Settings = () => {
	const { addToast } = useToast();
	const { props, actions: {setProp} } = useNode(node => ({
		props: node.data.props
	}));

	const onChange = (e, parentKey, i) => {
		const {name, value} = e.target;

		if(parentKey && parentKey.length > 0 && parentKey[0]) {
			const key = parentKey[0];			// e.g. features
			const index = parentKey[1];

			if(typeof index == 'number') {
				setProp(props => {
					props[key].value[index][name].value = value;
				});	
			} else {
				setProp(props => {
					props[key].value[name].value = value;
				});
			}
		} else {
			setProp(props => {
				props[name].value = value;
			});
		}
	}

	const setImage = (parentKey, fileUrl) => {
		if(parentKey && parentKey.length > 0 && parentKey[0]) {
			const key = parentKey[0];			// e.g. features
			const index = parentKey[1];

			if(index) {
				setProp(props => {
					props[key].value[index]["image"].value = fileUrl
				});
			} else {
				setProp(props => {
					props[key].value["image"].value = fileUrl
				});
			}
		} else {
			setProp(props => {
				props["image"].value = fileUrl
			});
		}	
	}

	const flipBool = (e, parentKey) => {
		const {name, value} = e.target;

		if(parentKey && parentKey.length > 0 && parentKey[0]) {
			const key = parentKey[0];			// e.g. features
			const index = parentKey[1];

			if(index) {
				setProp(props => {
					props[key].value[index][name].value = !props[key].value[index][name].value;
				});
			} else {
				setProp(props => {
					props[key].value[name].value = !props[key].value[name].value;

					if(props[key].value[name].value) {
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
		} else {
			setProp(props => {
				props[name].value = !props[name].value;
			});
		}
	}

	const addItem = key => {
		setProp(props => {
			props[key].value.push(props[key].value[0])
		});
	}

	const deleteItem = (key, i) => {
		if(props[key].value.length > 1) {
			setProp(props => {
				props[key].value.splice(i, 1)
			});		
		} else {
			addToast({
				severity: 'warning',
				message: 'Cannot delete last item'
			})
		}
	}

    return (
        <Box>
            {generateSettingFields(props, onChange, addItem, deleteItem, flipBool, setImage)}
        </Box>
    )
}

