import React, { useState, useEffect } from 'react';
import { useWebsite } from 'services/website/provider';
import {
    Box,
    Button,
    DialogTitle,
    Dialog,
    Typography,
    DialogActions,
    DialogContent,
    DialogContentText,
    Input
} from '@mui/material';
import Dropzone from 'react-dropzone';
import useSettings from './hooks/useSettings';
import useImportContract from './hooks/useImportContract'

const ImportModal = () => {
    const {
        isImportContractOpen,
        setIsImportContractOpen,
        importContractAddress, 
        setImportContractAddress,
        importABI
    } = useWebsite();

    const {
        onImportContract
    } = useSettings();

    const {
        stepCount,
        setStepCount,
        validate,
        handleABIupload
    } = useImportContract();

    return (
        <Dialog onClose={() => setIsImportContractOpen(false)} open={isImportContractOpen} fullWidth maxWidth="sm">
            <DialogTitle>Import Contract</DialogTitle>
            <DialogContent>
                {stepCount === 0 ? (
                    <>
                        <DialogContentText>Enter your contract address</DialogContentText>
                        <Input type='text' value={importContractAddress} onChange={(e) => setImportContractAddress(e.target.value)} fullWidth/>
                    </>
                ) : (
                    <>
                        <DialogContentText>Upload your ABI</DialogContentText>
                        {!importABI?.length ? (
                            <Dropzone
                                accept={['application/json']}
                                multiple
                                onDrop={(acceptedFiles) =>
                                    handleABIupload(acceptedFiles)
                                }>
                                {({ getRootProps, getInputProps }) => (
                                    <Box
                                        sx={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '4px',
                                            background: '#F8F8F8',
                                            border: '1px solid #C4C4C4',
                                            cursor: 'pointer',
                                            boxShadow: '0 0 10px rgba(0,0,0,.15)',
                                            position: 'relative',
                                        }}>
                                        <div
                                            style={{ padding: '64px' }}
                                            {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <p
                                                style={{
                                                    opacity: 0.5,
                                                    textAlign: 'center',
                                                }}>
                                                Drag &apos;n&apos; drop your contract ABI
                                                here.
                                            </p>
                                        </div>
                                    </Box>
                                )}
                            </Dropzone>
                        ) : (
                            <Typography color='green'>
                                ABI successfully uploaded ✅
                            </Typography>
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                {stepCount === 0 ? (
                    <>
                        <Button onClick={() => setIsImportContractOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={validate}>
                            Next
                        </Button>
                    </>
                ) : (
                    <>
                        <Button onClick={() => setStepCount(0)}>
                            Previous
                        </Button>
                        <Button onClick={onImportContract}>
                            Import
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    )
}

export default ImportModal