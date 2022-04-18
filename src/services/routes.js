import React, { lazy, Suspense } from 'react';
import { Redirect } from 'react-router-dom';
import { RouteBuilder } from 'components/routes/RouteBuilder';
import { CircularProgress, Stack } from 'ds/components';
import Layout from 'components/layout/Layout';

//import Generator from 'services/generator';
import Blockchain from 'services/blockchain';
import Website from 'services/website';

import Payment from 'components/pages/Payments';

// Broken Route
const BrokenRoutes = lazy(() => import('components/pages/Broken'));

const AppRoutes = () => {
    const routes = [
        {
            path: '/dashboard',
            component: () => <Redirect to="/smart-contracts" />,
            private: true,
            exact: true,
        },

        { path: '/smart-contracts', component: Blockchain },
        { path: '/websites', component: Website },
        /*
        {
            path: '/dashboard/settings',
            component: Settings,
            private: true,
            exact: true
        },
        */
        {
            path: '/billing',
            component: Payment,
            private: true,
            exact: true,
        },
        {
            path: '/',
            component: () => <Redirect to="/dashboard" />,
            exact: true,
        },
        {
            path: '*',
            component: BrokenRoutes,
        },
    ];

    return (
        <Layout>
            <Suspense
                fallback={
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{ height: '100vh' }}>
                        <CircularProgress />
                    </Stack>
                }>
                <RouteBuilder routes={routes} />
            </Suspense>
        </Layout>
    );
};

export default AppRoutes;
