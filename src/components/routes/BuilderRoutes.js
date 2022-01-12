import React, { lazy, Suspense } from 'react';
import { Redirect } from 'react-router-dom';
import { RouteBuilder } from './RouteBuilder';
import { CircularProgress, Stack } from 'ds/components'


// Website Builder Routes
const Builder = lazy(() => import("components/pages/Builder"))

const BuilderRoutes = () => {
	const routes = [
		{
			path: '/',
			component: Builder,
			private: true,
			exact: true
		},
	];

	return (
			<Suspense fallback={
				<Stack alignItems="center" justifyContent="center" sx={{height: '100vh'}}>
					<CircularProgress />
				</Stack>
			}>
				<RouteBuilder routes={routes} />
			</Suspense>
	)
};

export default BuilderRoutes;
