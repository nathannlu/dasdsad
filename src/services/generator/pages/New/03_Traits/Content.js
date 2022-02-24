import React, { useState } from 'react';
import Dropzone from 'react-dropzone'
import { Stack, Box } from 'ds/components';
import TraitsDisplay from './TraitsDisplay';
import { useTrait } from 'services/generator/controllers/traits';

export function Content({index, editing}) {
	const { addTrait } = useTrait();

  return (
		<Stack gap={2}>
			<TraitsDisplay editing={editing} index={index} />
			{editing ? (
				<Dropzone multiple onDrop={acceptedFiles => addTrait(acceptedFiles)}>
					{({getRootProps, getInputProps}) => (
						<Box sx={{
							alignItems:'center', 
							justifyContent: 'center',
							background: 'rgb(43, 45, 61)',
							cursor: 'pointer',
							boxShadow: '0 0 10px rgba(0,0,0,.15)',
							position: 'relative',
						}}>
							<div style={{padding: '64px'}} {...getRootProps()} >
								<input {...getInputProps()} />
								<p style={{opacity: .5, textAlign: 'center', color: 'white'}}>
									Drag 'n' drop files here. This layer supports image/png.
									{/* {index == 0 ? ", video/mp4" : ""} */}
								</p>
							</div>
						</Box>
					)}
				</Dropzone>
			): null}
		</Stack>
  );
}


export default Content;
