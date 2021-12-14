import React, { useState } from 'react';
import { Stack, Box, Grid, Fade, TextField, FormLabel } from 'ds/components';
import { useSettingsForm } from './hooks/useSettingsForm';

import Layers from './Layers';
import Dropzone from 'react-dropzone'




import { useArray } from './hooks/useArray';

const Generator = () => {
	const { list: layers, setList: setLayers, addToArray, selected, setSelected, onChange } = useArray();
	const { settingsForm: { collectionSize } } = useSettingsForm();

	const [newLayer, setNewLayer] = useState('');

	const addToLayers = (acceptedFiles) => {
		let file = acceptedFiles.map(file => Object.assign(file, {
			preview: URL.createObjectURL(file)
		}))

		setLayers(prevState => {
			prevState[selected].images.push(...file)
			return [...prevState]
		})
	}

	const deleteLayer = i => {
		setSelected(null);
		setLayers(prevState => {
			prevState.splice(i, 1);	
			return [...prevState]
		});
	}
	
	const deleteImage = (i) => {
		setLayers(prevState => {
			prevState[selected].images.splice(i, 1)
			console.log([...prevState])
			return [...prevState]
		})
	}
	
	return (
		<>

		<Fade in>
			<Box sx={{
				display: 'flex',
				bgcolor: 'grey.200',
				minHeight: '100vh',
				paddingTop: '64px'
			}}>
				<Grid container>
					<Grid xs={3}>
						<Layers 
							layers={layers} 
							addToArray={addToArray} 
							selected={selected} 
							setSelected={setSelected}
							onChange={onChange} 
							collectionSize={collectionSize}
							deleteLayer={deleteLayer}
						/>
					</Grid>
					<Grid xs={6}>
						{selected !== null ? (
							<div>
								Add images to layer {layers[selected]?.name}
								<Dropzone onDrop={acceptedFiles => addToLayers(acceptedFiles)}>
									{({getRootProps, getInputProps}) => (
										<section style={{padding:"24px 64px", background: 'grey', alignItems:'center', justifyContent: 'center'}}>
											<div {...getRootProps()}>
												<input {...getInputProps()} />
												<p>Drag 'n' drop some files here, or click to select files</p>
											</div>
										</section>
									)}
								</Dropzone>
							</div>
						) : (
							<div>
								select a layer to get started
							</div>
						)}

						<Stack direction="row">
							{layers[selected]?.images?.map((image, i) => (
								<Grid xs={2}>
									<img src={image.preview} />
									<button onClick={() => deleteImage(i)}>Remove image</button>
								</Grid>
							))}
						</Stack>
					</Grid>
					<Grid xs={3}>
						<Stack sx={{p: 2, background: 'white', borderRadius: 2}}>
							<FormLabel>Collection Size</FormLabel>
							<TextField {...collectionSize} />
						</Stack>
					</Grid>
				</Grid>
			</Box>
		</Fade>
		</>
	)
};

export default Generator;
