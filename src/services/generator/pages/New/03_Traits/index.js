import React, { useState } from 'react';
import { Stack, Button, Box, Typography } from 'ds/components';
import { useValidateForm } from '../hooks/useValidateForm';
import { Chip } from '@mui/material';
import T from './Traits';
import { useTrait } from 'services/generator/controllers/traits';

const Traits = (props) => {
    const { validateLayerTraits } = useValidateForm();
    const { updateTraitRarityMax } = useTrait();

    return (
        <Stack
            gap={2}
            justifyContent="space-between"
            sx={{ minHeight: '90vh', paddingTop: '120px' }}>
            <Stack gap={2}>
                <Box>
                    <Chip sx={{ opacity: 0.8, mb: 1 }} label={'Step 3/5'} />
                    <Typography variant="h2">Add traits</Typography>
                    <Typography variant="body">
                        Give your NFT collection unique characteristics. Please
                        make sure all your images have the same dimensions.
                    </Typography>
                </Box>
                <T editing={true} />
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
                    onClick={() =>
                        validateLayerTraits() &&
                        updateTraitRarityMax() &&
                        props.nextStep()
                    }
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

export default Traits;
