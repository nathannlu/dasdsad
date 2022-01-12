import React, { lazy, Suspense } from 'react';
import { Redirect } from 'react-router-dom';
import { RouteBuilder } from './RouteBuilder';
import { CircularProgress, Stack } from 'ds/components'
import Layout from 'components/layout/Layout';

// Dashboard Routes
const Dashboard = lazy(() => import("components/pages/Dashboard"))
const Welcome = lazy(() => import("components/pages/Dashboard/Welcome"))
const Settings = lazy(() => import("components/pages/Dashboard/Settings"))

// Website Builder Routes
const Builder = lazy(() => import("components/pages/Builder"))

// Payment Website Route
const Payment = lazy(() => import("components/pages/Payments"))


const AppRoutes = () => {
	const routes = [
		{
			path: '/dashboard',
			component: Dashboard,
			private: true,
			exact: true 
		},
		{
			path: '/dashboard/welcome',
			component: Welcome,
			private: true,
			exact: true
		},
		{
			path: '/dashboard/settings',
			component: Settings,
			private: true,
			exact: true
		},
		/*
		{
			path: '/builder/:title/:pageName',
			component: Builder,
			private: true,
			exact: true
		},
		*/
		{
			path: '/billing',
			component: Payment,
			private: true,
			exact: true
		},
		{
			path: "/",
			component: () => <Redirect to="/dashboard" />,
			exact: true
		}
	];

	return (
		<Layout>
			<Suspense fallback={
				<Stack alignItems="center" justifyContent="center" sx={{height: '100vh'}}>
					<CircularProgress />
				</Stack>
			}>
				<RouteBuilder routes={routes} />
			</Suspense>
		</Layout>
	)
};

export default AppRoutes;
