import * as React from 'react';
import Button, { buttonClasses } from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
    [`&.${buttonClasses.root}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AppDialog = ({ open, handleClose, handleSave, heading, subHeading, submitButtonText, maxWidth, content }) => {
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="ambition-alert-dialog-description"
            maxWidth={maxWidth}
        >
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 500, fontSize: 32 }}>{heading}</DialogTitle>
            <DialogContent>
                <DialogContentText id="ambition-alert-dialog-description">
                    {subHeading}
                </DialogContentText>
                {content}
            </DialogContent>
            <DialogActions>
                <Button size="small" onClick={handleClose}>CANCEL</Button>
                <StyledButton size="small" variant="contained" color="success" onClick={handleSave}>{submitButtonText || 'SUBMIT'}</StyledButton>
            </DialogActions>
        </Dialog>
    );
};

export default AppDialog;
