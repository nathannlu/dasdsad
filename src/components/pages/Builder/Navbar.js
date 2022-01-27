import React, {useState, useEffect} from 'react';
import { useEditor } from '@craftjs/core';
import lz from 'lzutf8';
import { Fade, Button, IconButton, Stack, Box } from 'ds/components';
import { useToast } from 'ds/hooks/useToast';
import { useWebsite } from 'libs/website';
import { useUpdatePageData, useSetSubscription, useGetWebsites } from 'gql/hooks/website.hook';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutModal from 'components/pages/Payments/CheckoutModal';
import config from 'config';

const stripePromise = loadStripe(config.stripe.publicKey);

import {
	Save as SaveIcon,
	FileUpload as FileUploadIcon,
	Undo as UndoIcon,
	Redo as RedoIcon,
    Construction
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
	const [updatePageData] = useUpdatePageData({
		onCompleted: () => addToast({
			severity: 'success',
			message: "Progress saved!"
		}),
		onError: err => addToast({
			severity: 'error',
			message: err.message
		})
	})
    const [setWebsiteSubscription] = useSetSubscription({
		onCompleted: () => addToast({
			severity: 'success',
			message: "Subscribed Succesfully"
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
	const { website, setWebsite } = useWebsite();

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

	// Load website data on load
	useEffect(() => {
		setPageName(window.location.pathname.split("/").slice(-1).pop())
		setWebsiteId(window.location.pathname.split("/").slice(-2)[0])
	}, [website]);
    
    const onSave = () => {
        if (!website.isSubscribed) {
            setIsCheckoutOpen(true);
        } else {
            handleSave();
        }
    }

    const handleSave = () => {
        const json = query.serialize();
        const pageData = (lz.encodeBase64(lz.compress(json)))
        updatePageData({ variables: { 
            websiteId,
            pageName,
            pageData
        }})
    }

    const handleCheckoutSuccess = () => {
        setWebsiteSubscription({ variables: {
            isSubscribed: true
        }})
        console.log(website)
        handleSave();
    }

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

						<a style={{display: 'flex'}} href={`https://${websiteId}.ambition.so/home`} target="_blank">
                            <Button size="small">
                                View live
                            </Button>
						</a>

						<Button
							size="small"
							onClick={onSave}
							disabled={!canUndo}
						>
							Save
						</Button>

                        <Elements stripe={stripePromise}>
                            <CheckoutModal 
                                isModalOpen={isCheckoutOpen}
                                setIsModalOpen={setIsCheckoutOpen}
                                planId={config.stripe.products.website}
                                callback={handleCheckoutSuccess}
                            />
                        </Elements>
					</Stack>
				</div>
			</Box>
		</Fade>
	)
};

export default Navbar;
