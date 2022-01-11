import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Generator from 'components/pages/Generator';
import Upload from 'components/pages/Upload';
import Main from 'components/pages/Main';
import Login from 'components/pages/Auth/Login';

const GlobalRoutes = () => {
	return (
		<Router>
			<Route path="/generator" exact component={Generator} />
			<Route path="/upload" exact component={Upload} />
			<Route path="/login" exact component={Login} />
			<Route path="/" exact component={Main} />
		</Router>
	)
};

export default GlobalRoutes;
