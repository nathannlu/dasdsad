import React from 'react';
import { Stack, CircularProgress } from '../../ds/components';

const AppLoader = () => {
    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ height: '100vh' }}>
            <CircularProgress />
        </Stack>
    );
};

export default AppLoader;
