import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import StepWizard from "react-step-wizard";

import {
    Fade,
    Container,
    Button,
    Divider,
    Typography,
    Stack,
    Grid,
    Box,
    Link,
    CircularProgress
} from 'ds/components';
import { useModal } from 'ds/hooks/useModal';

const ActionCard = React.forwardRef((props, ref) => {
    const { icon, title, description, modal, key, action, isLoading, isDisabled, helperText } = props;
    const { createModal } = useModal();
    const [, setIsModalOpen, closeModal] = createModal(modal?.modal || null, { fullScreen: modal?.fullScreen, title: modal?.title });

    const disabledStyles = (isLoading || isDisabled) && {
        pointerEvents: 'none',
        color: 'rgba(0, 0, 0, 0.26)',
        boxShadow: 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
        opacity: 0.8
    } || {};

    React.useImperativeHandle(ref, () => ({ closeModal }));

    return (
        <Grid key={key} item xs={4}>
            <Stack
                onClick={() => {
                    if (modal?.modal) {
                        setIsModalOpen(true);
                        return;
                    }
                    action();
                }}
                gap={1}
                p={2.5}
                mr={1}
                mb={1}
                sx={{
                    position: 'relative',
                    height: '160px',
                    border: '1px solid rgba(0,0,0,.15)',
                    borderRadius: '5px',
                    transition: 'all .2s',
                    cursor: 'pointer',
                    '&:hover': {
                        boxShadow: '0 0 8px rgba(0,0,0,.15)',
                    },
                    ...disabledStyles
                }}
            >
                {isLoading && <CircularProgress isButtonSpinner={true} size={72} /> || null}

                <Stack alignItems="center" gap={1} direction="row">
                    {icon}
                    <Typography
                        variant="body"
                        sx={{
                            color: '#404452',
                            fontSize: '18px',
                        }}
                    >
                        {title}
                    </Typography>
                </Stack>
                <Typography
                    variant="body"
                    sx={{ color: '#6a7383', fontSize: '14px' }}
                >
                    {description}
                </Typography>
                {helperText && <Stack gap={2} direction="horizontal">
                    <Typography color="error" sx={{ my: 1, fontStyle: 'italic', fontSize: 14 }}>** {helperText}</Typography>
                </Stack> || null}
            </Stack>
        </Grid>
    );
});

export default ActionCard;