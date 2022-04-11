import React from 'react';
import { Box, Grid, Stack } from 'ds/components';

import {
    Code as CodeIcon,
    QrCode as QrCodeIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
} from '@mui/icons-material';
import Skeleton from '@mui/material/Skeleton';

const Model = () => {
    return (
        <Stack
            sx={{
                height: '720px',
                width: '500px',
                border: '2px solid',
                borderImageSlice: 1,
                borderImageSource:
                    'linear-gradient(to bottom, #3885FF, #BFB9D2)',
                background: 'linear-gradient(to bottom,#090A18, #273A5B)',
            }}
            alignContent="space-between"
            p={6}
            gap={6}>
            <Stack
                alignItems="center"
                justifyContent="space-between"
                direction="row">
                <CodeIcon sx={{ color: 'white', fontSize: '100px' }} />
                <QrCodeIcon sx={{ color: '#3885FF', fontSize: '80px' }} />
            </Stack>

            <Stack gap={1}>
                <Skeleton height={40} sx={{ backgroundColor: '#3885FF' }} />
                <Skeleton sx={{ backgroundColor: '#273A5B' }} />
                <Skeleton sx={{ backgroundColor: '#273A5B' }} />
                <Skeleton sx={{ backgroundColor: '#273A5B' }} />
                <Skeleton width="80%" sx={{ backgroundColor: '#273A5B' }} />
            </Stack>
            <Stack gap={1}>
                <Skeleton height={40} sx={{ backgroundColor: '#3885FF' }} />
                <Skeleton sx={{ backgroundColor: '#273A5B' }} />
                <Skeleton width="80%" sx={{ backgroundColor: '#273A5B' }} />
            </Stack>

            <Stack>
                <CheckCircleOutlineIcon
                    sx={{ color: '#3885FF', fontSize: '80px', ml: 'auto' }}
                />
            </Stack>
        </Stack>
    );
};

export default Model;
