import React, { lazy, Suspense } from 'react';
import { RouteBuilder } from 'components/routes/RouteBuilder';
import { CircularProgress, Stack } from 'ds/components';

const Dashboard = lazy(() => import('services/website/pages/Dashboard'));
const Builder = lazy(() => import('services/website/pages/Builder'));
const New = lazy(() => import('services/website/pages/New'));
const Settings = lazy(() => import('services/website/pages/Settings'));

const WebsiteRoutes = () => {
    const routes = [
        {
            path: '/websites',
            component: Dashboard,
            private: true,
            exact: true,
        },
        {
            path: '/websites/new',
            component: New,
            private: true,
            exact: true,
        },
        {
            path: '/websites/:title/:pageName',
            component: Builder,
            private: true,
            exact: true,
        },
        {
            path: '/websites/:title/:pageName/settings',
            component: Settings,
            private: true,
            exact: true,
        },
    ];

    return (
        <Suspense fallback={<Loading />}>
            <RouteBuilder routes={routes} />
        </Suspense>
    );
};

const Loading = () => (
    <Stack alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
        <CircularProgress />
    </Stack>
);

export default WebsiteRoutes;
