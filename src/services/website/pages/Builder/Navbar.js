import React, {useState, useEffect} from 'react';
import { useEditor } from '@craftjs/core';
import lz from 'lzutf8';

import { Fade, Button, IconButton, Stack, Box } from 'ds/components';
import { useToast } from 'ds/hooks/useToast';
import { useWebsite } from 'services/website/provider';
import { useUpdatePageData } from 'services/website/gql/hooks/website.hook';
import { useGetWebsites } from 'services/website/gql/hooks/website.hook';

import { useAuth } from 'libs/auth';

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
	const [pageName, setPageName] = useState();
	const [websiteId, setWebsiteId] = useState();

	useGetWebsites()
	const { website } = useWebsite();
    const { user } =  useAuth();

	// Load website data on load
	useEffect(() => {
        if(!Object.keys(website).length > 0) return;
		setPageName(window.location.pathname.split("/").slice(-1).pop())
		setWebsiteId(window.location.pathname.split("/").slice(-2)[0])
	}, [website]);

    const onSaveChange = () => {
        try {
            const json = query.serialize();
            const pageData = (lz.encodeBase64(lz.compress(json)))
    
            if (website.author !== user.id) throw new Error("Failed to save, you do not own this website.");

            if (website.title !== websiteId) throw new Error("Failed to save, wrong website id.");

            // Change if we support multiple pages
            if (website.pages[0].name !== pageName) throw new Error("Failed to save, wrong page name.");

            updatePageData({ variables: { 
                websiteId,
                pageName,
                pageData
            }})
        }
        catch (e) {
            addToast({
                severity: 'error',
                message: e.message
            })
        }
    }

	return (
		<Fade in>
			<Box
				className="w-full flex z-10 fixed shadow-lg items-center"
				sx={{bgcolor: 'rgba(255, 255, 255, 0.9)', height: '64px'}}
			>
				<div className="container mx-auto flex flex-wrap items-center">
					<Box>
						<a href="/websites">
							<img style={{height: '25px'}} src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d34ab7c783ea4e08774112_combination-primary-logo.png" />
						</a>
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

						<a style={{display: 'flex'}} href={`https://${websiteId}.ambition.so/`} target="_blank">
                            <Button size="small">
                                View live
                            </Button>
						</a>

						<Button
							size="small"
							onClick={onSaveChange}
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
