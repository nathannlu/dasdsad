import React from 'react';
import { Fade, Button, IconButton, Stack, Box } from 'ds/components';
import HandymanIcon from '@mui/icons-material/Handyman';
import { useWebsite } from 'services/website/provider';

const Navbar = () => {
    const { goToBuilder } = useWebsite();

    return (
        <Fade in>
            <Box
				className="w-full flex z-10 fixed shadow-lg items-center"
				sx={{bgcolor: 'rgba(255, 255, 255, 0.9)', height: '64px'}}
			>
				<div className="container mx-auto flex flex-wrap items-center">
					<Box>
						<a href="/websites">
							<img style={{height: '25px'}} src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d34ab7c783ea4e08774112_combination-primary-logo.png" />
						</a>
					</Box>

					<Stack gap={2} direction="row" className="ml-auto">
						<Button
							size="small"
                            variant='contained'
                            endIcon={<HandymanIcon />}
                            onClick={goToBuilder}
						>
							Back to builder
						</Button>
					</Stack>
				</div>
			</Box>
        </Fade>
    )
}

export default Navbar