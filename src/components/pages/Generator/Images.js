import React from 'react';
import Dropzone from 'react-dropzone'
import { Stack, Box, Grid, Fade, TextField, FormLabel, IconButton } from 'ds/components';
import { Chip } from '@mui/material';
import { useCollection } from 'libs/collection';
import { useTraitsManager } from './hooks/useTraitsManager';
import { CancelOutlined as CancelOutlinedIcon } from '@mui/icons-material';


const Images = () => {
	const { layers, setLayers, selected, selectedImage, setSelectedImage } = useCollection();
	const { deleteImage, addToLayers } = useTraitsManager();


	
	return (
	<Stack gap={2} sx={{px: 2}} >
		<Box sx={{mt: 2}}>
			<Chip sx={{opacity: .8, mb: 1}} label={"Step 2"} />
			{selected !== null ? (
				<Box>
					Add images to layer <Chip color="success" label={layers[selected]?.name} />
				</Box>
			) : (
				<Box>
					Select a layer in the left panel to get started
				</Box>
			)}
		</Box>

		<Stack direction="row">
			{layers[selected]?.images?.map((image, i) => (
				<Grid xs={3} item key={i} sx={{position: 'relative'}}>
					<Box sx={{border: selectedImage == i && '2px solid darkgrey', borderRadius: '6px', padding: '4px'}}>
						<img
							src={image.preview} 
							onClick={() => setSelectedImage(i)}
							style={{borderRadius: '4px'}}
						/>
					</Box>
					<IconButton 
						sx={{
							position: 'absolute',
							top: 0,
							right: 0,
							transform: 'translate(35%, -35%)',
							background: '#eee',
							padding: '1px',
							'&:hover': {
								background: '#eee',
							}
						}}
						onClick={() => deleteImage(i)}
					>
						<CancelOutlinedIcon />
					</IconButton>
				</Grid>
			))}
		</Stack>


		{selected !== null && (
			<div>
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
		)}
	</Stack>
	)
};

export default Images;
