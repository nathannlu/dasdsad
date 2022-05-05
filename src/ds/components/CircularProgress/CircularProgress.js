import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const Spinner = ({ isButtonSpinner }) => {
    const buttonSpinnerStyles = {
        width: 20,
        height: 20,
        position: 'absolute',
        top: 'calc(50% - 10px)',
        left: 'calc(50% - 10px)'
    };
    return (
        <Box
            sx={{
                display: 'flex',
                alignItem: 'center',
                justifyContent: 'center',
            }}>
            <CircularProgress style={isButtonSpinner && buttonSpinnerStyles || undefined} />
        </Box>
    );
};

export default Spinner;
