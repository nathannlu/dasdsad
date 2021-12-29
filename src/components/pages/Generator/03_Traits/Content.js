import React, { useState } from 'react';
import Dropzone from 'react-dropzone'
import { Stack, Box } from 'ds/components';
import { useCollection } from 'libs/collection';
import { useTraitsManager } from '../hooks/useTraitsManager';

import TraitsDisplay from './TraitsDisplay';


export function Content({index}) {
	const { layers, setLayers, selected, selectedImage, setSelectedImage } = useCollection();
	const { addToLayers } = useTraitsManager();

  return (
		<>
			<TraitsDisplay index={index} />
			<Dropzone multiple onDrop={acceptedFiles => addToLayers(acceptedFiles)}>
				{({getRootProps, getInputProps}) => (
					<Box sx={{
						alignItems:'center', 
						justifyContent: 'center',
						borderRadius: '4px',
						background: '#F8F8F8',
						border: '1px solid #C4C4C4',
						cursor: 'pointer',
						boxShadow: '0 0 10px rgba(0,0,0,.15)',
						position: 'relative',
					}}>
						<div style={{padding: '64px'}} {...getRootProps()}>
							<input {...getInputProps()} />
							<p style={{opacity: .5, textAlign: 'center'}}>Drag 'n' drop some files here, or click to select files</p>
						</div>
					</Box>
				)}
			</Dropzone>
		</>
  );
}


export default Content;
