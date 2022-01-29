import React, {useEffect} from 'react';
import { useEditor } from '@craftjs/core';
import lz from 'lzutf8';

import { Button, IconButton, Stack, Box } from 'ds/components';
import { useToast } from 'ds/hooks/useToast';
import { useWebsite } from 'services/website/provider';
import { useUpdatePageData } from 'services/website/gql/hooks/website.hook';
import Navbar from '../Navbar';

import {
	Save as SaveIcon,
	FileUpload as FileUploadIcon,
	Undo as UndoIcon,
	Redo as RedoIcon
} from '@mui/icons-material'

import ComponentSelection from './ComponentSelection';
import { SettingsPanel } from './ComponentSettings';
import { ViewportProvider } from './context';

const Viewport = props => {
	const {
		query,
		canUndo,
		canRedo,
		connectors,
		actions: {history: {undo, redo}}
	} = useEditor();
	const [updatePageData, { data }] = useUpdatePageData({
		onCompleted: () => addToast({
			severity: 'success',
			message: "Progress saved!"
		}),
		onError: err => addToast({
			severity: 'error',
			message: err.message
		})
	})
	const { addToast } = useToast();

	const { getWebsitePage } = useWebsite();
	const { uid } = getWebsitePage(window.location.pathname.split("/").slice(-1).pop())

	return (
		<ViewportProvider>
			<Box
				sx={{
					display: 'flex',
					overflow: 'hidden',
					bgcolor: 'grey.200',
				}}
			>
				<SettingsPanel />
				<ComponentSelection />
				<Navbar />

				<div className="flex-1 h-full">
					<div className="w-full h-full">
						<div 
							id="craftjs-renderer" 
							className="w-full h-full"
							ref={ref => connectors.select(connectors.hover(ref, null), null)}
						>
							<div className="relative flex-col flex items-center pb-8 pt-24">
								<div className="rounded-md shadow-lg overflow-hidden" style={{width: '1200px'}}>
									{props.children}
								</div>
							</div>
							
							<div style={{opacity: .25}} className="pt-4 pb-24 text-center"> 
								<p>Designed for Degens</p>
							</div>
						</div>
					</div>
				</div>
			</Box>
		</ViewportProvider>
	)
};

export default Viewport
