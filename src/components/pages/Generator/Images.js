import React from 'react';
import Dropzone from 'react-dropzone'
import { Stack, Box, Grid, Fade, TextField, FormLabel } from 'ds/components';
import { useCollection } from 'libs/collection';
import { useTraitsManager } from './hooks/useTraitsManager';


const Images = () => {
	const { layers, setLayers, selected, selectedImage, setSelectedImage } = useCollection();
	const { deleteImage, addToLayers } = useTraitsManager();


	
	return (
	<Box sx={{px: 2}} >
		{selected !== null ? (
			<div>
				Add images to layer {layers[selected]?.name}
				<Dropzone onDrop={acceptedFiles => addToLayers(acceptedFiles)}>
					{({getRootProps, getInputProps}) => (

						<Box sx={{
							padding:"64px",
							alignItems:'center', 
							justifyContent: 'center',
							borderRadius: '4px',
							background: '#F8F8F8',
							border: '1px solid #C4C4C4',
							cursor: 'pointer',
							boxShadow: '0 0 10px rgba(0,0,0,.15)'
						}}>

							<div {...getRootProps()}>
								<input {...getInputProps()} />
								<p style={{opacity: .5, textAlign: 'center'}}>Drag 'n' drop some files here, or click to select files</p>
							</div>

						</Box>

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
				<Grid xs={2} item key={i}>
					<Box>
						<img
							src={image.preview} 
							onClick={() => setSelectedImage(i)}
							style={selectedImage == i ? {border: '1px solid blue'} : {}}
						/>
					</Box>
					<button onClick={() => deleteImage(i)}>Remove image</button>
				</Grid>
			))}
		</Stack>
	</Box>
	)
};

export default Images;
