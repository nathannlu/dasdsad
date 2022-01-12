import React, { useState } from 'react';
import { Stack, Container, Fade, Button, Box, Typography, List, Tab, Tabs } from 'ds/components';
import { ImageSearch as ImageSearchIcon, Settings as SettingsIcon, Web as WebIcon } from '@mui/icons-material';

// Pages
import Collections from './Collections';
import Generator from '../Generator';
import Pages from './Pages';
import Settings from './Settings';
import Upload from './Upload';


const Dashboard = () => {
	const [selectedPage, setSelectedPage] = useState('collections');

	return (
		<Fade in>
			<Stack sx={{
				display: 'flex',
				backgroundColor: 'white',
				transition: '.2s all',
				marginTop: '65px',
				minHeight: '100vh',
			}}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'fixed', background: 'white', zIndex: 10, width: '100%' }}>
					<Container>
					<Tabs value={selectedPage} onChange={(_, newValue) => setSelectedPage(newValue)} aria-label="basic tabs example">
						<Tab label="Collections" value="collections" />
						<Tab label="Blockchain" value="upload" />
						<Tab label="Website" value="pages" />
					</Tabs>
					</Container>
				</Box>

				<Container sx={{marginTop: '45px'}}>
					{{
						'collections': <Collections />,
						'pages': <Pages />,
	//					'settings': <Settings />,
						'upload': <Upload />
					}[selectedPage]}
				</Container>
			</Stack>
		</Fade>
	)
};

export default Dashboard;
/*
				<Drawer 
					sx={{
						width: '240px',
						flexShrink: 0,
						'& .MuiDrawer-paper':{
							width: '240px',
							flexShrink: 0,
							py: 2,
							top: '64px'
						}
					}}
					variant="permanent"
					anchor="left"
				>
					<List sx={{
						'& .MuiListItemIcon-root': {
							minWidth: 0,
							marginRight: 1
						}
					}}>

						<ListItemButton 
							selected={selectedPage == 'upload'}
							onClick={() => setSelectedPage('upload')}
						>
							<ListItemIcon>
								<SettingsIcon />
							</ListItemIcon>
							<ListItemText primary="Set up NFT collection" />
						</ListItemButton>

						<ListItemButton 
							selected={selectedPage == 'pages'}
							onClick={() => setSelectedPage('pages')}
						>
							<ListItemIcon>
								<WebIcon />
							</ListItemIcon>
							<ListItemText primary="Build your website" />
						</ListItemButton>


					</List>
				</Drawer>
			*/
