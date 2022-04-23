import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, IconButton, Stack } from 'ds/components';
import { Stepper, Step, StepLabel, StepContent } from '@mui/material';
import StepWizard from 'react-step-wizard';
import CloseIcon from '@mui/icons-material/Close';


const CustomAddress = ({ isModalOpen, setIsModalOpen }) => {
    const [initialStep, setInitialStep] = useState(1);

    return (
        <Modal
            open={isModalOpen}
            onClose={()=>setIsModalOpen(false)}
            sx={{
                overflow: 'auto',
                alignItems: 'center',
                display: 'flex',
                zIndex: 5000,
            }}>
            <Box
                p={3}
                pt={1}
                sx={{
                    width: '1200px',
                    margin: '0 auto',
                    background: '#fff',
                }}>
                <Stack>
                    <IconButton sx={{ ml: 'auto' }}>
                        <CloseIcon onClick={() => setIsModalOpen(false)} />
                    </IconButton>
                </Stack>

                <StepWizard initialStep={initialStep} transitions={{}}>
                    <Upload id={id} setIsModalOpen={setIsModalOpen} />
                </StepWizard>
            </Box>
        </Modal>
    );
};

export default CustomAddress;
