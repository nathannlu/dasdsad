import React, {useEffect} from 'react';
import { useEditor } from '@craftjs/core';
import lz from 'lzutf8';

import { Fade, Button, IconButton, Stack, Box } from 'ds/components';
import { useToast } from 'ds/hooks/useToast';
import { useWebsite } from 'libs/website';
import { useUpdatePageData } from 'gql/hooks/website.hook';

import {
	Save as SaveIcon,
	FileUpload as FileUploadIcon,
	Undo as UndoIcon,
	Redo as RedoIcon
} from '@mui/icons-material'

const Navbar = () => {
	const {
		query,
		canUndo,
		canRedo,
		connectors,
		actions: {history: {undo, redo}}
	} = useEditor((state, query) => ({
		canUndo: state.options.enabled && query.history.canUndo(),
		canRedo: state.options.enabled && query.history.canRedo(),
	}));
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
		<Fade in>
			<Box
				className="w-full flex z-10 fixed shadow-lg items-center"
				sx={{bgcolor: 'rgba(255, 255, 255, 0.9)', height: '64px'}}
			>
				<div className="container mx-auto flex flex-wrap items-center">
					<Box>
						<a href="/dashboard">Web3</a>
					</Box>

					<Stack gap={2} direction="row" className="ml-auto">
						<Box>
							<IconButton disabled={!canUndo} onClick={undo}>
								<UndoIcon />
							</IconButton>
							<IconButton disabled={!canRedo} onClick={redo}>
								<RedoIcon />
							</IconButton>
						</Box>


						<Button
							size="small"
							onClick={() => {
								const json = query.serialize();
								const pageData = (lz.encodeBase64(lz.compress(json)))
								//console.log(pageData)
								updatePageData({ variables: { uid, pageData}})
							}}
							disabled={!canUndo}
						>
							Save
						</Button>
					</Stack>
				</div>
			</Box>
		</Fade>
	)
};

export default Navbar;
