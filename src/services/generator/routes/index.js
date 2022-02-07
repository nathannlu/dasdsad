import React, { lazy, Suspense } from 'react';
import { RouteBuilder } from 'components/routes/RouteBuilder';
import { CircularProgress, Stack } from 'ds/components'

//const Dashboard = lazy(() => import("services/generator/pages/Dashboard"))
const New = lazy(() => import("services/generator/pages/New"))
//const Collection = lazy(() => import("services/generator/pages/Collection"))


const GeneratorRoutes = () => {
	const routes = [
		/*	
		{
			path: '/collections',
			component: Dashboard,
			private: true,
			exact: true 
		},
		*/
		{
			path: '/collections/new',
			component: New,
			exact: true
		},
		/*
		{
			path: '/collections/:id',
			component: Collection,
			private: true,
		},
		*/
	];

	return (
		<Suspense fallback={<Loading />}>
			<RouteBuilder routes={routes} />
		</Suspense>
	)
};

const Loading = () => (
	<Stack alignItems="center" justifyContent="center" sx={{height: '100vh'}}>
		<CircularProgress />
	</Stack>
)


export default GeneratorRoutes;
