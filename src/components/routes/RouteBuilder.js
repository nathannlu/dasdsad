import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

export const RouteBuilder = ({ routes }) => {
	const { path } = useRouteMatch();

	return (
		<Switch>
			{
				routes.map(route => {
					const TagName = route.private ? PrivateRoute : Route;

					return (
						<TagName
							key={route.path}
							path={path === '/' ? route.path : path + route.path}
							exact={!!route.exact}
							component={route.component}
						/>
					)
				})
			}
		</Switch>
	)
};

