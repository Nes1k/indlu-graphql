import 'babel-polyfill';
import './styles/app.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import Relay, { DefaultNetworkLayer } from 'react-relay';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Router, browserHistory } from 'react-router';

import reducers from './reducers';
import routes from './routes';

const store = createStore(reducers);

// Relay.injectNetworkLayer( new DefaultNetworkLayer('http://localhost:3000/graphql'));

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
