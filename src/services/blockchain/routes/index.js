import React, { lazy, Suspense } from 'react';
import { RouteBuilder } from 'components/routes/RouteBuilder';
import { CircularProgress, Stack } from 'ds/components';

// Dashboard Routes
const Dashboard = lazy(() => import('services/blockchain/pages/Dashboard'));
const New = lazy(() => import('services/blockchain/pages/New'));
const Contract = lazy(() => import('services/blockchain/pages/Contract'));
const Embed = lazy(() => import('services/blockchain/pages/Embed'));

const BlockchainRoutes = () => {
    const routes = [
        /*
        {
            path: '/smart-contracts/embed',
            component: Embed,
            private: false,
            exact: true 
        },
        */
        {
            path: '/smart-contracts/new',
            component: New,
            private: true,
            exact: true,
        },
        {
            path: '/smart-contracts',
            component: Dashboard,
            private: true,
            exact: true,
        },
        {
            path: '/smart-contracts/:id',
            component: Contract,
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

export default BlockchainRoutes;
