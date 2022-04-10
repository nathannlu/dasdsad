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
                    mt: '8em',
                }}>
                <Box
                    component="img"
                    sx={{
                        width: '70px',
                        objectFit: 'cover',
                        mb: 5,
                    }}
                    alt="Broken Route Icon"
                    src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61f1dc8561db0122a091c817_browser-error.png"
                />
                <Typography fontSize="125pt" lineHeight="145px">
                    404
                </Typography>
                <Typography fontSize="32pt">Page Not Found</Typography>
                <Typography
                    fontSize="14pt"
                    sx={{
                        mb: 10,
                    }}>
                    Woops, this page doesnt exists!! 🚀
                </Typography>
                <Link to="/dashboard">
                    <Button variant="contained" endIcon={<ArrowBackIcon />}>
                        Go back to dashboard
                    </Button>
                </Link>
            </Box>
        </Fade>
    );
};

export default Broken;
