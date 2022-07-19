import React, { useState } from 'react';
import AppModal from 'components/common/appModal';

import {
    Typography,
    Stack,
    Grid,
    CircularProgress
} from 'ds/components';

const ActionCard = React.forwardRef((props, ref) => {
    const { icon, title, description, modal, key, action, isLoading, isDisabled, helperText } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const disabledStyles = (isLoading || isDisabled) && {
        pointerEvents: 'none',
        color: 'rgba(0, 0, 0, 0.26)',
        boxShadow: 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
        opacity: 0.8
    } || {};

    React.useImperativeHandle(ref, () => ({ closeModal: () => setIsModalOpen(false) }));

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

            <AppModal
                content={modal?.modal || null}
                fullScreen={modal?.fullScreen}
                title={modal?.title}
                isModalOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

        </Grid>
    );
});

export default ActionCard;