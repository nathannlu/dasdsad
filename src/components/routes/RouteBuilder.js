import React from 'react';
import { Switch, Route, useRouteMatch, useLocation } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

export const RouteBuilder = ({ routes }) => {
    const { path } = useRouteMatch();
    //	const { pathname: path } = useLocation();

    return (
        <Switch>
            {routes.map((route) => {
                const TagName = route.private ? PrivateRoute : Route;

                return (
                    <TagName
                        key={route.path}
                        path={path === '/' ? route.path : path + route.path}
                        exact={!!route.exact}
                        component={route.component}
                    />
                );
            })}
        </Switch>
    );
};
