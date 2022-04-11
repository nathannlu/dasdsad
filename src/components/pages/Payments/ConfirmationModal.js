import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
    LoadingButton,
    Card,
    Typography,
    Divider,
    CardElement,
    Button,
    Select,
    MenuItem,
} from 'ds/components';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';

const ConfirmationModal = (props, ref) => {
    const { onConfirm } = props;
    const [cofirmationState, setConfirmationState] = useState(false);
    const [confirmationData, setConfirmationData] = useState(null);

    useImperativeHandle(
        ref,
        () => ({
            show(data) {
                setConfirmationData(data);
                setConfirmationState(true);
            },
        }),
        []
    );

    const handleConfirm = () => {
        onConfirm(confirmationData.data);
        setConfirmationState(false);
    };

    return (
        <Dialog
            open={cofirmationState}
            onClose={() => setConfirmationState(false)}>
            <DialogTitle>
                {confirmationData && confirmationData.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {confirmationData && confirmationData.description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => setConfirmationState(false)}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    size="small">
                    Proceed
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default forwardRef(ConfirmationModal);
