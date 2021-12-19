import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Generator from 'components/pages/Generator';
import Payment from 'components/pages/Payment';


const Routes = () => {
	return (
			<Switch>
				<Route exact path="/">
					<Generator />
				</Route>

				<Route exact path="/payment">
					<Payment />
				</Route>

			</Switch>
	)
};

export default Routes;
