import React from 'react';
import { Button } from 'ds/components';
import { Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material';

const ConfirmationDialog = ({confirmationState, onProceed, confirmationData, setConfirmationState}) => {
    return (
        <Dialog
            open={confirmationState}
            onClose={() => setConfirmationState(false)}
        >
            {confirmationData && (
                <>
                    <DialogTitle>
                        {confirmationData.title}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {confirmationData.description}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant='contained'
                            size='small'
                            onClick={() => setConfirmationState(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='contained'
                            size='small'
                            color='error'
                            onClick={() => {
                                onProceed();
                                setConfirmationState(false);
                            }}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    )
}

export default ConfirmationDialog