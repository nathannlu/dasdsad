import React, { useContext } from 'react'
import { Typography, Dialog, DialogContent, DialogContentText, DialogTitle, Stack, CircularProgress } from '@mui/material';
import { useGenerator } from 'services/generator/controllers/generator';
import { useLayerManager } from 'services/generator/controllers/manager';
import { useMetadata } from 'services/generator/controllers/metadata';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const RenderModal = ({renderModalState, setRenderModalState}) => {
    const { canvasRef, isDownloading, autoSaveCount, renderIndex } = useGenerator();
    const { query: { layers }} = useLayerManager();
    const { settingsForm: { size } } = useMetadata();

    return (
        <Dialog open={renderModalState} onClose={() => setRenderModalState(false)}>
            <DialogTitle variant='h4'>Your collection is rendering... 🚀</DialogTitle>
            <DialogContent>
                <DialogContentText>This may take awhile, please dont refresh the page.</DialogContentText>
                <Stack spacing={1}>
                    <Typography variant='h5'>
                        Progress Information
                    </Typography>
                    {size && (
                        <Stack direction='row' spacing={2} alignItems='center'>
                            <InfoOutlinedIcon fontSize='10pt' style={{ color: 'rgb(180, 180, 180)' }}/>
                            <Typography fontSize='12pt'>
                                Rendering {renderIndex}/{size.value}
                            </Typography>
                        </Stack>
                    )}
                    {isDownloading && (
                        <Stack direction='row' spacing={2} alignItems='center'>
                            <InfoOutlinedIcon fontSize='10pt' style={{ color: 'rgb(180, 180, 180)' }}/>
                            <Typography fontSize='12pt'>
                                Auto Save {autoSaveCount}%
                            </Typography>
                        </Stack>
                    )}
                </Stack>
                <Stack padding='1em' marginTop='1em'>
                    <canvas ref={canvasRef} width={layers[0]?.images[0]?.image?.naturalWidth} height={layers[0]?.images[0]?.image?.naturalHeight}></canvas>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}

export default RenderModal