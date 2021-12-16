import React from 'react';
import Dropzone from 'react-dropzone'
import { Stack, Box, Grid, Fade, TextField, FormLabel } from 'ds/components';
import { useCollection } from 'libs/collection';
import { useTraitsManager } from './hooks/useTraitsManager';

const Images = () => {
	const { layers, selected } = useCollection();
	const { deleteImage, addToLayers } = useTraitsManager();
	
	return (
	<div>
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
			<div style={{textAlign: 'center'}}>
				Click on a layer in the Layers panel to get started
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
	</div>
	)
};

export default Images;
