import React from 'react';
import { Redirect } from 'react-router-dom';
import { RouteBuilder } from './RouteBuilder';

// Authenticate Routes
import Signup from 'components/pages/Auth/Signup';
import Login from 'components/pages/Auth/Login';
import ForgotPassword from 'components/pages/Auth/ForgotPassword';
import Reset from 'components/pages/Auth/Reset';

// Generator
//import Generator from 'components/pages/Generator';

import AppRoutes from './AppRoutes';
import BuilderRoutes from './BuilderRoutes';

// Published Website Route
import Published from 'components/Published'; 


const GlobalRoutes = () => {
	const routes = [

		// Auth routes
		{ path: '/login/forgot', component: ForgotPassword },
		{ path: '/login/reset', component: Reset },
		{ path: '/login', component: Login },
		{ path: '/signup', component: Signup },

		// Generator
//		{ path: '/generator', component: Generator },

		// Published routes
		{ path: '/published/:title/:pageName', component: Published },

		// Builder routes
		{ path: '/builder/:title/:pageName', component: BuilderRoutes, private: true },

		// Dashboard routes
		{ path: '/', component: AppRoutes, private: true },



		{ path: '/', component: () => <Redirect to="/dashboard" /> },
	]

	return <RouteBuilder routes={routes} />
};

export default GlobalRoutes;
