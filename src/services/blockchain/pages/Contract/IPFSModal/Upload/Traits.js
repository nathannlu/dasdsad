import React, { useState } from 'react';
import { Box, Button, LoadingButton, Stack } from 'ds/components';
import { LinearProgress } from '@mui/material';
import { useContract } from 'services/blockchain/provider';
import Folder from '@mui/icons-material/FolderOpenTwoTone';
import { useIPFS } from 'services/blockchain/blockchains/hooks/useIPFS';
import Dropzone from 'react-dropzone';

const Traits = (props) => {
    const { uploadedFiles, setUploadedFiles } = useContract();
    const { pinImages, loading } = useIPFS();
    const [percent, setPercent] = useState(0);

    const handleImagesUpload = (acceptedFiles) => {
        const formData = new FormData();
        for (const file of acceptedFiles) formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = event => {
            const percentage = parseInt((event.loaded / event.total) * 100);
            setPercent(percentage);
        };
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) return;
            if (xhr.status !== 200) return;
             setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
        };
        xhr.open('POST', 'https://httpbin.org/post', true);
        xhr.send(formData);
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
        props.setActiveStep(status ? props.step + 1 : props.step);
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
                    <LinearProgress variant="determinate" value={percent} />
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
                        onClick={() => pinImages(props.contract.blockchain, callback)}>
                        Upload
                    </LoadingButton>
                </Stack>
            )}
        </>
    );
};

export default Traits;
