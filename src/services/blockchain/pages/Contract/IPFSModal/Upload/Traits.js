import React from 'react';
import { Box, Button, LoadingButton, Stack } from 'ds/components';
import { useContract } from 'services/blockchain/provider';
import Dropzone from 'react-dropzone';
import Folder from '@mui/icons-material/FolderOpenTwoTone';
import { useIPFS } from 'services/blockchain/blockchains/hooks/useIPFS';

const Traits = (props) => {
    const { uploadedFiles, setUploadedFiles } = useContract();
    const { pinImages, loading } = useIPFS();

    const handleImagesUpload = (acceptedFiles) => {
        setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
    };

    /**
     * status marks if images were successfully pinned on pinata.cloud
     * 
     * if status === true, move to next step
     * else
     * user can try uploading the images again
     */
    const callback = (status) => {
        if (!status) {
            setUploadedFiles([]);
        }
        props.setActiveStep(status && 1 || 0);
    };

    return (
        <>
            {uploadedFiles.length < 1 ? (
                <Box>
                    <Dropzone
                        accept={['image/png', 'image/webp', 'video/mp4']}
                        multiple
                        onDrop={(acceptedFiles) =>
                            handleImagesUpload(acceptedFiles)
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
                                        Drag &apos;n&apos; drop your collection
                                        here.
                                    </p>
                                </div>
                            </Box>
                        )}
                    </Dropzone>
                </Box>
            ) : (
                <Stack>
                    <Box>
                        <Folder />
                        {uploadedFiles.length} Files added
                        <Button
                            onClick={() => setUploadedFiles([])}
                            type="small"
                            color="error">
                            Delete
                        </Button>
                    </Box>

                    <LoadingButton
                        variant="contained"
                        loading={loading}
                        onClick={() => pinImages(callback)}>
                        Upload
                    </LoadingButton>
                </Stack>
            )}
        </>
    );
};

export default Traits;
