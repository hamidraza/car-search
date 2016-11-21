import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import {Router, Route, browserHistory} from 'react-router';

import './app.scss';
import 'react-datepicker/dist/react-datepicker.css';

import reducers from './reducers';
import Routes   from './routes';

const store = createStore(reducers, window.__APP_STATE__ || {});

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={Routes} />
  </Provider>,
  document.getElementById('app')
);
