import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const Spinner = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItem: 'center',
                justifyContent: 'center',
            }}>
            <CircularProgress />
        </Box>
    );
};

export default Spinner;
