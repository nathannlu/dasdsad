import React from 'react';
import { Navbar } from 'ds/components';

const Layout = ({ children }) => {
	return (
		<main style={{paddingTop: '58px'}}>
			<Navbar />
			{children}
		</main>
	)
};

export default Layout;
