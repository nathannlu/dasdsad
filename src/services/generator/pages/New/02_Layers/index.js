import React from 'react';
import { Stack, Button, Box, Typography } from 'ds/components';
import { Chip } from '@mui/material';
import L from './Layers';
import { useValidateForm } from '../hooks/useValidateForm';

const Layers = (props) => {
    const { validateLayers } = useValidateForm();

    return (
        <Stack
            gap={2}
            justifyContent="space-between"
            sx={{ minHeight: '90vh', paddingTop: '120px' }}>
            <Stack gap={2}>
                <Box>
                    <Chip sx={{ opacity: 0.8, mb: 1 }} label={'Step 2/5'} />
                    <Typography variant="h2">Create layers</Typography>
                    <Typography variant="body">
                        Add a layer here to get started.
                    </Typography>
                </Box>
                <L />
            </Stack>
            <Stack justifyContent="space-between" direction="row">
                <Button
                    onClick={() => props.previousStep()}
                    variant="contained"
                    style={{
                        backgroundColor: 'rgb(25,26,36)',
                        color: 'white',
                    }}>
                    Prev
                </Button>
                <Button
                    onClick={() => validateLayers() && props.nextStep()}
                    style={{
                        backgroundColor: 'rgb(25,26,36)',
                        color: 'white',
                    }}>
                    Next
                </Button>
            </Stack>
        </Stack>
    );
};

export default Layers;
