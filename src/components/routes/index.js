import React from 'react';
import { Redirect } from 'react-router-dom';
import { RouteBuilder } from './RouteBuilder';

// Authenticate Routes
import Signup from 'components/pages/Auth/Signup';
import Login from 'components/pages/Auth/Login';
import ForgotPassword from 'components/pages/Auth/ForgotPassword';
import Reset from 'components/pages/Auth/Reset';

import AppRoutes from 'services/routes';

// Published Website Route
import Published from 'components/Published'; 


const GlobalRoutes = () => {
	const routes = [

		// Auth routes
		{ path: '/login/forgot', component: ForgotPassword },
		{ path: '/login/reset', component: Reset },
		{ path: '/login', component: Login },
		{ path: '/signup', component: Signup },



		{ path: '/', component: () => <Redirect to="/login" />, exact: true},


		// Dashboard routes
		{ path: '/', component: AppRoutes, private: true },
	]

	return <RouteBuilder routes={routes} />
};

export default GlobalRoutes;


