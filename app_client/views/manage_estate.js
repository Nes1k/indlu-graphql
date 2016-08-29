import React from 'react';
import Relay, { RootContainer, Route } from 'react-relay';

import { ManageEstate } from '../components';

class ManageEstateRoute extends Route {

  static paramDefinitions = {
    id: { require: true}
  };

  static queries = {
    estate: (Component) => Relay.QL`
      query {
        estate(id: $id) {
          ${Component.getFragment('estate')}
        }
      }
    `
  };

  static routeName = 'ManageEstateRoute';
}

export default (props) => {
  return (
  <RootContainer
    Component={ManageEstate}
    route={new ManageEstateRoute({id: props.params.id})}
  />
);
}
