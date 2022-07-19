import React from 'react';

import { Modal, Box, Button, Stack, IconButton, Typography, Divider } from 'ds/components';
import { AppBar, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ModalAppbar = ({ onClose, variant, title }) => {
    if (variant === 'contained') {
        return (
            <AppBar
                position="fixed"
                sx={{
                    bgcolor: 'grey.100',
                    py: 2,
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(0,0,0,.2)',
                    color: '#000',
                }}
            >
                <Stack direction="row" px={2} gap={2} alignItems="center">
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>

                    {title && <React.Fragment>
                        <Divider
                            sx={{ height: '20px', borderWidth: 0.5 }}
                            orientation="vertical"
                        />
                        <Box>
                            <Typography variant="body">
                                {title}
                            </Typography>
                        </Box>
                    </React.Fragment> || null}
                </Stack>
            </AppBar>
        );
    }

    return (
        <Stack>
            <IconButton sx={{ ml: 'auto' }}>
                <CloseIcon onClick={onClose} />
            </IconButton>
        </Stack>
    )
}

/**
 * props
 * 
 * content?: JSX.Element;
 * isLoading?: boolean;
 * fullScreen?: boolean;
 * styles?: cssStyles;
 * title?: string;
 * isModalOpen: boolean;
 * onClose: () => void;
 */

const AppModal = (props) => {
    const { content, isLoading, fullScreen, styles, title, isModalOpen, onClose } = props;

    const fullScreenStyles = fullScreen && {
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        borderRadius: 0
    } || {};

    return (
        <Modal
            open={isModalOpen}
            onClose={() => {
                if (isLoading) {
                    return;
                }
                onClose();
            }}
            sx={{
                overflow: 'auto',
                alignItems: 'center',
                display: 'flex',
                zIndex: 5000,
                ...fullScreenStyles
            }}
            keepMounted={true}
        >
            <Fade in={isModalOpen} timeout={600}>
                <Box
                    p={3}
                    pt={1}
                    sx={{
                        width: '1200px',
                        margin: '0 auto',
                        background: '#fff',
                        borderRadius: '10px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        '&:focus-visible': { outline: 'none' },
                        ...fullScreenStyles,
                        ...styles
                    }}
                >
                    <ModalAppbar
                        onClose={onClose}
                        variant={fullScreen && 'contained' || null}
                        title={title || null}
                    />

                    {/* assign Top margin */}
                    <Box sx={{ marginTop: fullScreen ? '84px' : undefined }}>
                        {content || null}
                    </Box>

                </Box>
            </Fade>
        </Modal>
    )
};

export default AppModal;
