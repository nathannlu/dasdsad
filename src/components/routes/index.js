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
//import Uploads from 'components/pages/Dashboard/Upload';

// Published Website Route
import Published from 'components/Published'; 

// Website
import Website from 'components/pages/Website';


const GlobalRoutes = () => {
	const routes = [

		// Auth routes
		{ path: '/login/forgot', component: ForgotPassword },
		{ path: '/login/reset', component: Reset },
		{ path: '/login', component: Login },
		{ path: '/signup', component: Signup },

		/*
		// Generator
		{ path: '/generator', component: Generator },

		// Smart contract
		{ path: '/upload', component: Upload, private: true },
		{ path: '/collection/:id', component:Collection, private: true },
		{ path: '/contract/:id', component: Uploads, private: true },
		{ path: '/website', component: Website, private: true },

		// Published routes
		/*
		{ path: '/published/:title/:pageName', component: Published },
		{ path: '/builder/:title/:pageName', component: BuilderRoutes, private: true },
		*/
		{ path: '/', component: () => <Redirect to="/login" />, exact: true},

		// Dashboard routes
		{ path: '/', component: AppRoutes, private: true },
	]

	return <RouteBuilder routes={routes} />
};

export default GlobalRoutes;


