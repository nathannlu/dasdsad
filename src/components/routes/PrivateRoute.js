import React, { useEffect } from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from 'libs/auth';

const PrivateRoute = ({ component: Component, history, auth, ...rest}) => {
	const { loading, isAuthenticated } = useAuth();


	useEffect(() => {
		if (loading || isAuthenticated) {
			return;
		}

//	loginWithRedirect();
		history.push('/login');
	}, [loading, isAuthenticated])
	
	const render = props => isAuthenticated === true ? <Component {...props} /> : null 

	return <Route render={render} {...rest} />;
};

export default withRouter(PrivateRoute);
