import React from 'react';
import { Route, IndexRoute } from 'react-router';

import {
  Base,
  Home,
  AdDetail,
  MyRealEstates,
  EditEstate
} from './views';

export default (
  <Route path="/" component ={Base}>
    <IndexRoute component={Home} />
    <Route path="ad/:id" component={AdDetail} />
    <Route path="estates" component={MyRealEstates} />
    <Route path="estates/edit/:id" component={EditEstate} />
    <Route path="*" component={Home} />
  </Route>
);
