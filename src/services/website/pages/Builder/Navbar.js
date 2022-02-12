import React, { useState, useEffect } from 'react';
import { useEditor } from '@craftjs/core';
import { Fade, Button, IconButton, Stack, Box } from 'ds/components';
import { useWebsite } from 'services/website/provider';
import { useGetWebsites, useSetWebsiteSubscription } from 'services/website/gql/hooks/website.hook';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutModal from 'components/pages/Payments/CheckoutModal';
import config from 'config'
import {
	Save as SaveIcon,
	FileUpload as FileUploadIcon,
	Undo as UndoIcon,
	Redo as RedoIcon
} from '@mui/icons-material'
import SettingsIcon from '@mui/icons-material/Settings';

const stripePromise = loadStripe(config.stripe.publicKey);

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
	const { onSaveChanges, onSave, isCheckoutModalOpen, setIsCheckoutModalOpen, goToSettings } = useWebsite();
    const [setWebsiteSubscription] = useSetWebsiteSubscription({
        onError: err => addToast({
			severity: 'error',
			message: err.message
		})
    });

    useGetWebsites();

    const onSuccessPayment = async (data) => {
        await setWebsiteSubscription({ variables: { isSubscribed: true } });
        await onSaveChanges(query);
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

                        <IconButton onClick={goToSettings}>
                            <SettingsIcon />
                        </IconButton>

						<a style={{display: 'flex'}} href={`https://${window.location.pathname.split("/").slice(-2)[0]}.ambition.so/`} target="_blank">
                            <Button size="small">
                                View live
                            </Button>
						</a>

						<Button
							size="small"
							onClick={() => onSave(query)}
							disabled={!canUndo}
						>
							Save
						</Button>

                        <Elements stripe={stripePromise}>
                            <CheckoutModal
                                isModalOpen={isCheckoutModalOpen}
                                callback={onSuccessPayment}
                                planId={config.stripe.products.website}
                                setIsModalOpen={setIsCheckoutModalOpen}
                            />
                        </Elements>
					</Stack>
				</div>
			</Box>
		</Fade>
	)
};

export default Navbar;
