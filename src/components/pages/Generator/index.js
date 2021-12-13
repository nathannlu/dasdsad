import React, { useState } from 'react';
import { Stack, Box, Grid, Fade } from 'ds/components';

import Layers from './Layers';
import ProjectSettings from './ProjectSettings';
import LayerSettings from './LayerSettings'
import Dropzone from 'react-dropzone'


import { useArray } from './hooks/useArray';

const Generator = () => {
	const { list: layers, setList: setLayers, addToArray, selected, setSelected, onChange } = useArray();
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
	
	return (
		<Fade in>
			<Box sx={{
				display: 'flex',
				bgcolor: 'grey.200',
				minHeight: '100vh',
				paddingTop: '64px'
			}}>
				<Grid container>
					<Grid xs={3}>
						<Layers layers={layers} addToArray={addToArray} selected={selected} setSelected={setSelected} onChange={onChange} />
					</Grid>
					<Grid xs={6}>
						<Dropzone onDrop={acceptedFiles => addToLayers(acceptedFiles)}>
							{({getRootProps, getInputProps}) => (
								<section>
									<div {...getRootProps()}>
										<input {...getInputProps()} />
										<p>Drag 'n' drop some files here, or click to select files</p>
									</div>
								</section>
							)}
						</Dropzone>
						<Stack direction="row">
							{layers[selected]?.images?.map((image, i) => (
								<Grid xs={2} onClick={() => setSelected(i)}>
									<img src={image.preview} />
								</Grid>
							))}
						</Stack>
					</Grid>
					<Grid xs={3}>
						<ProjectSettings />
					</Grid>
				</Grid>
			</Box>
		</Fade>
	)
};

export default Generator;
