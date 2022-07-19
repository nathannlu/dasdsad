import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const Spinner = ({ isButtonSpinner, style, size = 20 }) => {
    const buttonSpinnerStyles = {
        width: size,
        height: size,
        position: 'absolute',
        top: `calc(50% - ${size / 2}px)`,
        left: `calc(50% - ${size / 2}px)`
    };
    return (
        <Box
            sx={{
                display: 'flex',
                alignItem: 'center',
                justifyContent: 'center',
                ...style
            }}>
            <CircularProgress style={isButtonSpinner && buttonSpinnerStyles || undefined} />
        </Box>
    );
};

export default Spinner;
