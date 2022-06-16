import * as React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import NotComplete from './NotComplete';

const Actions = (props) => {
    return (
        <Box>
            <Stack mt={8}>
                <NotComplete {...props} />
            </Stack>
        </Box>
    )
}

export default Actions;
