import React, { useState, useEffect } from 'react';
import { Stack, Box, Button, Grid, Card, Typography, TextField, IconButton, Divider } from 'ds/components';
import { Add as AddIcon } from '@mui/icons-material'
import { Delete as DeleteIcon } from '@mui/icons-material'

import { useToast } from 'ds/hooks/useToast'
import JSZip from 'jszip';

import { useArray } from './hooks/useArray';
import { generateImages } from './scripts/generate';


const Layers = ({ layers, deleteLayer, addToArray, selected, setSelected, onChange, collectionSize}) => {
	const [newLayer, setNewLayer] = useState('');
	const { addToast } = useToast()
	const [generatedImage, setGeneratedImage] = useState('');
	const [generatedZip, setGeneratedZip] = useState('');
	const [done, setDone] = useState(false);

	const onSubmit = e => {
		e.preventDefault();

		if(newLayer.length > 0) {
			let obj = {
				name: newLayer,
				rarity: 1,
				images: []
			}

			addToArray(obj)
		} else {
			addToast({
				severity: 'error',
				message: 'Cannot create layer with empty name. Try "background"'
			})
		}
	}

	const ok = async () => {
		if (collectionSize.value > 100) {
			addToast({
				severity: 'error',
				message: 'This value must be 100 or under'
			})
			return;
		}
		if (collectionSize.value.length < 1) {
			addToast({
				severity: 'error',
				message: 'This value cannot be left empty'
			})
			return;
		}

		addToast({
			severity: 'info',
			message: 'Generating collection. This will take a minute...'
		})
		return;
		setDone(false);
		let generatedImages = await generateImages(layers, collectionSize.value)

		// loop over and zip
		const zip = new JSZip();
		generatedImages.forEach((image, i) => {
			zip.file(`images/${i}.png`, image);
		})
		zip.generateAsync({type: 'base64'}).then(content => {
			setGeneratedZip(content)
			setDone(true);
			addToast({
				severity: 'success',
				message: 'Finished compiling!'
			})
		})
	}



	return (
		<Stack gap={2}>
			<Stack gap={2} sx={{p: 2, background: 'white', borderRadius: 2}}>
				<Typography variant="h4">
					Layers
				</Typography>
				<Typography variant="body">
					Add a layer here to get started.
				</Typography>

				<Stack gap={2}>
					{layers.map((item, i) => (
						<Card sx={{p: 2, cursor: 'pointer'}} style={selected == i ? {border: '1px solid blue'} : {}}>
							<Stack direction="row" alignItems="center">
								<Box sx={{flex: 1}} onClick={() => setSelected(i)}>
									{item.name}
								</Box>
								<IconButton onClick={() => deleteLayer(i)}>
									<DeleteIcon />
								</IconButton>
							</Stack>
						</Card>
					))}

					<Card sx={{p: 2}}>
						<form onSubmit={onSubmit}>
							<Stack direction="row" alignItems="center">
								<TextField fullWidth placeholder="e.g. background" onChange={e => setNewLayer(e.target.value)} />
								<IconButton type="submit">
									<AddIcon />
								</IconButton>
							</Stack>
						</form>
					</Card>
				</Stack>

				<Divider />

				<Stack direction="column" gap={2}>
					<Button variant="outlined" onClick={() => ok()}>
						Generate Collection
					</Button>
				</Stack>
			</Stack>


			{selected !== null ? (
				<Stack sx={{p: 2, background: 'white', borderRadius: 2}}>
						<Typography variant="h6">
						Edit Layer Name
						</Typography>
						<TextField name="name" value={layers[selected]?.name} onChange={onChange} />
				</Stack>
				) : null}

			{done && (
				<a href={"data:application/zip;base64,"+generatedZip} >
					<Button variant="contained">
						Download collection
					</Button>
				</a>
			)}
		</Stack>
	)
};

export default Layers;
