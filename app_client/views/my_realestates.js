import React, { Component } from 'react';
import Relay, { RootContainer, Route } from 'react-relay';
import { Link } from 'react-relay';


import { TilesEstate } from '../components';


export class MyRealestates extends Component {

  constructor(props){
    super(props);

    this.renderEstates = this.renderEstates.bind(this);
  }

  renderEstates(){
    const { edges } = this.props.user.properties;
    return edges.map(edge => <TilesEstate key={edge.node.id} estate={edge.node} />);
  }

  render(){
      console.log(this.props);
    return (
        <div className="row">
          {this.renderEstates()}
        </div>
    );
  }
}

MyRealestates = Relay.createContainer(MyRealestates, {
  initialVariables: {
    first: 10
  },
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id
        properties(first: $first) {
          edges {
            node {
              id
              ${TilesEstate.getFragment('estate')}
            }
          }
        }
      }
    `
  }
});

class MyRealestatesRoute extends Route {
  static queries = {
    user: (Component) => Relay.QL`
      query {
        user {${Component.getFragment('user')}}
      }
    `
  };

  static routeName = 'MyRealestatesRoute';
}

export default () => (
  <RootContainer
    Component={MyRealestates}
    route={ new MyRealestatesRoute()}
  />
)
