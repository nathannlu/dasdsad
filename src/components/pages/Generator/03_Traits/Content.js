import React, { useState } from 'react';
import Dropzone from 'react-dropzone'
import { Stack, Box } from 'ds/components';
import TraitsDisplay from './TraitsDisplay';
import { useTrait } from 'core/traits';

export function Content({index}) {
	const { addTrait } = useTrait();

  return (
		<Stack gap={2}>
			<TraitsDisplay index={index} />
			<Dropzone multiple onDrop={acceptedFiles => addTrait(acceptedFiles)}>
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
		</Stack>
  );
}


export default Content;
