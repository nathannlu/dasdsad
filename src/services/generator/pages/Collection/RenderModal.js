import React, { useState, useEffect } from 'react'
import { Box, Typography, Button, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle } from '@mui/material';
import { useGenerator } from 'services/generator/controllers/generator';
import { useLayerManager } from 'services/generator/controllers/manager';

const RenderModal = ({renderModalState, setRenderModalState}) => {
    const { canvasRef } = useGenerator();
    const { query: { layers }} = useLayerManager();

    useEffect(() => {
        console.log(layers);
    })

    return (
        <Dialog open={renderModalState} onClose={() => setRenderModalState(false)}>
            <DialogTitle>Subscribe</DialogTitle>
            <DialogContent>
                <canvas ref={canvasRef}></canvas>
            </DialogContent>
        </Dialog>
    )
}

export default RenderModal