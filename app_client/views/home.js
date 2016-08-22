import React, { Component } from 'react';
import Relay, { RootContainer, Route } from 'react-relay';
import { Link } from 'react-router';

import { TilesAdd } from '../components';

class Home extends Component {

  constructor(props){
    super(props);

    this.renderAds = this.renderAds.bind(this);
  }

  renderAds(){
    const { edges } = this.props.user.ads;
    return edges.map(edge => <TilesAdd ad={edge.node} key={edge.node.id} />);
  }

  render(){
    return (
      <div className="row">
        {this.renderAds()}
      </div>
    );
  }
}

Home = Relay.createContainer(Home, {
  initialVariables: {
    first: 5
  },
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        firstName
        lastName
        email
        street

        ads(first: $first) {
          edges {
            node {
              id
              ${TilesAdd.getFragment('ad')}
            }
          }
        }
      }
    `
  }
});


class HomeRoute extends Route {

  static queries = {
    user: (Component) => Relay.QL`
      query {
        user {${Component.getFragment('user')}}
      }
    `
  };

  static routeName = 'HomeRoute';
}


export default (props) => (
    <RootContainer
      Component={Home}
      route={ new HomeRoute()}
    />
)
