import React from 'react';
import { Navbar } from 'ds/components';

const Layout = ({ children }) => {
	return (
		<main>
			<Navbar />
			{children}
		</main>
	)
};

export default Layout;