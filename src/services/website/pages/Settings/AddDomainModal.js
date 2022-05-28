import React from 'react';
import { TextField, Button } from 'ds/components';
import {
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Typography,
    Stack,
    IconButton,
} from '@mui/material';
import { useToast } from 'ds/hooks/useToast';
import { useWebsite } from 'services/website/provider';
import InfoIcon from '@mui/icons-material/Info';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const AddDomainModal = ({
    showDomainModal,
    setShowDomainModal,
    onChange,
    domainName,
    onDomainNameChange,
    isAddingDomain
}) => {
    const { website } = useWebsite();
    const { addToast } = useToast();

    const handleClose = () => {
        setShowDomainModal(false);
    };

    const handleAdd = () => {
        if (domainName.length > 0 && domainName.indexOf('.') != -1) {
            onChange(domainName);
        } else {
            addToast({
                severity: 'error',
                message: 'Invalid domain name',
            });
        }
    };

    const handleCopy = (type) => {
        if (type === 0) {
            // Alias
            navigator.clipboard.writeText('3.17.229.36');
        } else if (type === 1) {
            // CName
            navigator.clipboard.writeText(`${website.title}.ambition.so`);
        }

        addToast({
            severity: 'success',
            message: 'Copied to clipboard',
        });
    };

    return (
        <Dialog open={showDomainModal} onClose={handleClose}>
            <DialogTitle>Add Custom Domain</DialogTitle>
            <DialogContent>
                <Typography fontSize="11pt" mb="1.5em">
                    Make sure your domain&apos;s CNAME or Alias is connected to
                    our website
                </Typography>
                <Stack direction="row" spacing={10}>
                    <Stack justifyContent="center">
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            mb=".25em">
                            <InfoIcon fontSize="14pt" />
                            <Typography fontSize="10pt">example.com</Typography>
                        </Stack>
                        <Stack
                            direction="row"
                            spacing={1}
                            mt=".5em"
                            alignItems="center"
                            mb="1em">
                            <InfoIcon fontSize="14pt" />
                            <Typography fontSize="10pt">
                                www.example.com
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack justifyContent="center">
                        <Typography fontSize="10pt" mb="1.25em">
                            ~~&gt;
                        </Typography>
                        <Typography fontSize="10pt" mb="1em">
                            ~~&gt;
                        </Typography>
                    </Stack>
                    <Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography fontSize="10pt">3.17.229.36</Typography>
                            <IconButton
                                onClick={() => handleCopy(0)}
                                size="small">
                                <ContentCopyIcon
                                    fontSize="14pt"
                                    style={{ color: 'rgb(160, 160, 160)' }}
                                />
                            </IconButton>
                        </Stack>
                        {website && (
                            <Stack
                                direction="row"
                                spacing={1}
                                mt=".5em"
                                alignItems="center"
                                mb="1em">
                                <Typography fontSize="10pt">
                                    {website.title}.ambition.so
                                </Typography>
                                <IconButton
                                    onClick={() => handleCopy(1)}
                                    size="small">
                                    <ContentCopyIcon
                                        fontSize="14pt"
                                        style={{ color: 'rgb(160, 160, 160)' }}
                                    />
                                </IconButton>
                            </Stack>
                        )}
                    </Stack>
                </Stack>
                <TextField
                    size="small"
                    label="Custom Domain"
                    variant="outlined"
                    helperText="Enter your existing domain name"
                    placeholder="example.com"
                    value={domainName}
                    onChange={onDomainNameChange}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="contained" size="small" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="contained" size="small" onClick={handleAdd} disabled={isAddingDomain}>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddDomainModal;
