import React, { useState } from 'react';
import { useWebsite } from 'libs/website';
import { Fade, Button, Box, Drawer, Typography, List, ListItemButton, ListItemText, ListItemIcon } from 'ds/components';
import { ImageSearch as ImageSearchIcon, Settings as SettingsIcon, Web as WebIcon } from '@mui/icons-material';

// Pages
import Generator from '../Generator';
import Pages from './Pages';
import Settings from './Settings';
import Upload from 'components/pages/Upload';

const Dashboard = () => {
	const { website } = useWebsite();
	const [selectedPage, setSelectedPage] = useState('upload');

	return (
		<Fade in>
			<Box sx={{
				display: 'flex',
				bgcolor: 'grey.200',
				minHeight: '100vh',
				paddingTop: '64px'
			}}>
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
				{{
					'generator': <Generator />,
					'pages': <Pages />,
//					'settings': <Settings />,
					'upload': <Upload />
				}[selectedPage]}
			</Box>
		</Fade>
	)
};

export default Dashboard;
