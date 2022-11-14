import React from 'react';
import { Redirect } from 'react-router-dom';
import { RouteBuilder } from './RouteBuilder';

// Authenticate Routes
import Signup from 'components/pages/Auth/Signup';
import Login from 'components/pages/Auth/Login';
import ForgotPassword from 'components/pages/Auth/ForgotPassword';
import Reset from 'components/pages/Auth/Reset';
//import Generator from 'services/generator';

import Dashboard from 'components/pages/Dashboard';
import New from 'services/generator/pages/New';
import Collection from 'services/generator/pages/Collection';

import AppRoutes from 'services/routes';

// Published Website Route
import Published from 'components/Published';

import Embed from 'services/blockchain/pages/Embed';

const GlobalRoutes = () => {
    const routes = [
        // Auth routes
        { path: '/login/forgot', component: ForgotPassword },
        { path: '/login/reset', component: Reset },
        { path: '/login', component: Login },
        { path: '/signup', component: Signup },

        //		{ path: '/generator', component: Generator },

        {
            path: '/generator',
            component: New,
            exact: true,
        },
        {
            path: '/dashboard',
            component: Dashboard,
            exact: true,
					private: true,
        },
        {
            path: '/generator/download',
            component: Collection,
            private: true,
        },
        {
            path: '/smart-contracts/embed',
            component: Embed,
            exact: true,
        },
        {
            path: '/smart-contracts/embed/v1',
            component: Embed,
            exact: true,
        },

        { path: '/', component: () => <Redirect to="/dashboard" />, exact: true },

        /**
         * if none of the above routes match, load dashboard routes
         * the broken routes (aka not-found-404) will be handled in <AppRoutes />
         */
        { path: '*', component: AppRoutes, private: true },
    ];

    return <RouteBuilder routes={routes} />;
};

export default GlobalRoutes;
