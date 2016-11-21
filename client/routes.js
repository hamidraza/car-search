import React from 'react';
import {Router, Route, IndexRoute, IndexRedirect, Redirect, browserHistory} from 'react-router';

import Layout from './layout/default';

import CarsPage from './pages/cars';

export default (
  <Route path="/" component={Layout}>
    <IndexRoute component={CarsPage} />
  </Route>
);