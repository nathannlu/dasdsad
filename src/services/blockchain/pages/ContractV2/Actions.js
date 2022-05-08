import * as React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import NotComplete from './NotComplete';

const Actions = ({ id, contract }) => {
    return (
        <Box>
            <Stack mt={8}>
                <NotComplete id={id} contract={contract} />
            </Stack>
        </Box>
    )
}

export default Actions;