import React from 'react';
import { Fade, Box, Link, Button, Typography } from 'ds/components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Broken = () => {
    return (
        <Fade in>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    mt: '62px'
                }}
            >
                <Box
                    component='img'
                    sx={{
                        width: '70px',
                        objectFit: 'cover',
                        mb: 5
                    }}
                    alt='Broken Route Icon'
                    src='/assets/images/browser-error.png'
                />
                <Typography 
                    fontSize='125pt'
                    lineHeight='145px'
                >
                    404
                </Typography>
                <Typography 
                    fontSize='32pt'
                >
                    Page Not Found
                </Typography>
                <Typography 
                    fontSize='14pt'
                    sx={{
                        mb: 10
                    }}
                >
                    Woops, this page doesnt exists!! 🚀
                </Typography>
                <Link to="/dashboard">
                    <Button
                        variant='contained'
                        endIcon={<ArrowBackIcon />}
                    >
                        Go back to dashboard
                    </Button>
                </Link>
            </Box>
        </Fade>
    )
}

export default Broken