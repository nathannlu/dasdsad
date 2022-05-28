import React, { useState } from 'react';
import { Box, Button, LoadingButton, Stack } from 'ds/components';
import { LinearProgress } from '@mui/material';
import { useContract } from 'services/blockchain/provider';
import Folder from '@mui/icons-material/FolderOpenTwoTone';
import { useIPFS } from 'services/blockchain/blockchains/hooks/useIPFS';
import Dropzone from 'react-dropzone';

const Traits = (props) => {
    const { uploadedUnRevealedImageFile, setUploadedUnRevealedImageFile } = useContract();
    const { pinUnrevealedImage, loading } = useIPFS();
    const [percent, setPercent] = useState(0);

    const handleImagesUpload = (acceptedFile) => {
        const formData = new FormData();
        formData.append('file', acceptedFile[0]);

        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = event => {
            const percentage = parseInt((event.loaded / event.total) * 100);
            setPercent(percentage);
        };
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) return;
            if (xhr.status !== 200) return;
            setUploadedUnRevealedImageFile(acceptedFile);
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
            setUploadedUnRevealedImageFile(null);
        }
        props.setActiveStep(status ? props.step + 1 : props.step);
    };

    return (
        <React.Fragment>
            {!uploadedUnRevealedImageFile ? (
                <Box>
                    <Dropzone
                        accept={['image/png', 'image/webp', 'video/mp4']}
                        multiple={false}
                        onDrop={(acceptedFiles) => handleImagesUpload(acceptedFiles)}
                    >
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
                                    <p style={{ opacity: 0.5, textAlign: 'center' }}>
                                        Drag &apos;n&apos; drop your Un revealed image here.
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
                        1 File added
                        <Button
                            onClick={() => setUploadedUnRevealedImageFile(null)}
                            type="small"
                            color="error"
                        >
                            Delete
                        </Button>
                    </Box>

                    <LoadingButton
                        variant="contained"
                        loading={loading}
                        onClick={() => pinUnrevealedImage(callback)}>
                        Upload
                    </LoadingButton>
                </Stack>
            )}
        </React.Fragment>
    );
};

export default Traits;
