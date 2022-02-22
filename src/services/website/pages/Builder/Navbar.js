import React, { useState, useEffect } from 'react';
import { useEditor } from '@craftjs/core';
import { Fade, Button, IconButton, Stack, Box } from 'ds/components';
import { Menu, MenuItem, FormGroup, FormControlLabel, Checkbox, Typography, Divider } from '@mui/material';
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
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import useBuilderNavbar from './hooks/useBuilderNavbar';
import WarningIcon from '@mui/icons-material/Warning';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

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
	const { website, onSaveChanges, onSave, isCheckoutModalOpen, setIsCheckoutModalOpen, goToSettings } = useWebsite();
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

    const { openAnchor, menuAnchor, isPublishing, onCloseAnchor, onPublish, onPublishToDomain, isPagePublished } = useBuilderNavbar();

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
							Save Draft
						</Button>

                        <Button
							size="small"
							endIcon={<ArrowDropDownIcon />}
                            onClick={onPublish}
						>
							Publish
						</Button>

                        <Menu
                            anchorEl={menuAnchor}
                            open={openAnchor}
                            onClose={onCloseAnchor}
                        >
                            <MenuItem disableRipple={true}>
                                <Box
                                    display='flex'
                                    flexDirection='column'
                                >
                                    {website && (
                                        <Stack direction='row' alignItems='center'>
                                            <Typography fontSize='9pt'>
                                                This page is {isPagePublished() ? 'published' : 'not published'}.
                                            </Typography>
                                            {isPagePublished() ? (
                                                <RadioButtonCheckedIcon ml='.5em' fontSize='10pt' style={{ color: 'lime' }} />
                                            ) : (
                                                <RadioButtonCheckedIcon ml='.5em' fontSize='10pt' style={{ color: 'red' }} />
                                            )}
                                        </Stack>
                                    )}
                                    <Typography fontSize='12pt' mt='.5em'>
                                        Choose Publish Destination
                                    </Typography>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox defaultChecked disabled size='small'/>} label="All domains" />
                                    </FormGroup>
                                </Box>
                            </MenuItem>
                            <Divider />
                            <MenuItem disableRipple={true}>
                                <Box
                                    display='flex'
                                    justifyContent='flex-start'
                                >
                                    <Button
                                        variant='contained'
                                        size='small'
                                        style={{textTransform: 'none'}}
                                        onClick={onPublishToDomain}
                                        disabled={isPublishing}
                                    >
                                        Publish to Selected Domains
                                    </Button>
                                    <Button
                                        variant='contained'
                                        onClick={onCloseAnchor}
                                        size='small' 
                                        sx={{
                                            bgcolor: 'rgba(0,0,0,0.2)',
                                            ml: '1em'
                                        }}
                                        color='black'
                                        style={{textTransform: 'none'}}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </MenuItem>
                        </Menu>

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
