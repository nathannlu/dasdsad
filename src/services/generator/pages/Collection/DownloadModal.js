import React from 'react';
import {
    Typography,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Stack,
} from '@mui/material';
import { useGenerator } from 'services/generator/controllers/generator';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const DownloadModal = ({ downloadModalState, setDownloadModalState }) => {
    const { isDownloading, autoSaveCount } = useGenerator();

    return (
        <Dialog
            open={downloadModalState}
            onClose={() => setDownloadModalState(false)}>
            <DialogTitle variant="h4">
                Downloading your collection... ✨
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    This may take awhile, please dont refresh the page.
                </DialogContentText>
                <Stack spacing={1}>
                    <Typography variant="h5">Progress Information</Typography>
                    {isDownloading && (
                        <Stack direction="row" spacing={2} alignItems="center">
                            <InfoOutlinedIcon
                                fontSize="10pt"
                                style={{ color: 'rgb(180, 180, 180)' }}
                            />
                            <Typography fontSize="12pt">
                                Saving {autoSaveCount}%
                            </Typography>
                        </Stack>
                    )}
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default DownloadModal;
