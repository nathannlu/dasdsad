import React, { useState, useEffect } from 'react';
import { Stack, Box, Button, Grid, Card, Typography, TextField, IconButton, Divider } from 'ds/components';
import { Add as AddIcon } from '@mui/icons-material'
import JSZip from 'jszip';

import { useArray } from './hooks/useArray';
import { generateImages } from './scripts/generate';


const Layers = ({ layers, addToArray, selected, setSelected, onChange }) => {
	const [newLayer, setNewLayer] = useState('');
	const [generatedImage, setGeneratedImage] = useState('');
	const [generatedZip, setGeneratedZip] = useState('');

	const onSubmit = e => {
		e.preventDefault();

		if(newLayer.length > 0) {
			let obj = {
				name: newLayer,
				rarity: 1,
				images: []
			}

			/*
			setLayers(prevState => {
				let newState = [...prevState, obj]
				return newState;
			})
			*/
			addToArray(obj)
		}
	}

	const ok = async () => {
		// currently in b64
		// turn this into png
		let newImage = await generateImages(layers)	
		setGeneratedImage(newImage);
		console.log(newImage)

		const zip = new JSZip();
		
		// loop over and zip
			zip.file('image.png', newImage);
	
		zip.generateAsync({type: 'base64'}).then(content => {
			//saveAs(content, "example.zip")
			setGeneratedZip(content)
		})

	}



	return (
		<Stack gap={2}>
			<Stack gap={2} sx={{p: 2, background: 'white', borderRadius: 2}}>
				<Typography variant="h3">
					Layers
				</Typography>


				<Stack gap={2}>
					{layers.map((item, i) => (
						<Card sx={{p: 2}} onClick={() => setSelected(i)}>
							<Stack direction="row" alignItems="center">
								{item.name}
							</Stack>
						</Card>
					))}
					<Card sx={{p: 2}}>
						<form onSubmit={onSubmit}>
							<Stack direction="row" alignItems="center">

								<TextField fullWidth placeholder="New layer" onChange={e => setNewLayer(e.target.value)} />
								<IconButton type="submit">
									<AddIcon />

								</IconButton>
							</Stack>
						</form>
					</Card>
				</Stack>

				<Divider />

				<Stack direction="column" gap={2}>
					<Button variant="outlined">
						Preview
					</Button>
					<Button variant="contained" onClick={() => ok()}>
						Generate Collection
					</Button>
				</Stack>
			</Stack>


			{selected !== null ? (
				<Stack gap={2} sx={{p: 2, background: 'white', borderRadius: 2}}>
					<Box>
						Layer Name
						<TextField name="name" value={layers[selected]?.name} onChange={onChange} />
					</Box>
					<Box>
						Rarity
						<TextField type="number" name="rarity" value={layers[selected]?.rarity} onChange={onChange} />
					</Box>
				</Stack>
				) : null}
			<a href={"data:application/zip;base64,"+generatedZip} >download zip</a>

			{/*generatedImage && (<img src={generatedImage} />)*/}
		</Stack>
	)
};

export default Layers;
