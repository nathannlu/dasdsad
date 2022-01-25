import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Navbar, Box, Container, Tabs, Tab } from 'ds/components';

const Layout = ({ children }) => {
	const [selectedPage, setSelectedPage] = useState('collections');
	const history = useHistory();
	const { pathname } = useLocation();

	const onChange = (e, newValue) => {
		setSelectedPage(newValue);
		history.push('/' + newValue)
	}

	useEffect(() => setSelectedPage(pathname.split('/')[1]), [])

	return (
		<main style={{paddingTop: '107px'}}>
			<Navbar />
			<Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'fixed', background: 'white', zIndex: 10, top:'58px', width: '100%' }}>
				<Container>
					<Tabs value={selectedPage} onChange={onChange}>
						<Tab label="Collections" value="collections" />
						<Tab label="Blockchain" value="smart-contracts" />
						<Tab label="Website" value="websites" />
					</Tabs>
				</Container>
			</Box>
			{children}
		</main>
	)
};

export default Layout;
