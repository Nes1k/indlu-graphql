import React, { Component, PropTypes } from 'react';
import Relay, { RootContainer, Route } from 'react-relay';
import { Link } from 'react-router';

import { GMap } from '../components';


class AdDetail extends Component {

  render(){
    const { ad } = this.props;
    console.log(ad);
    const { coords } = ad.estate;
    return (
      <div className="row adBody">
        <div className="col-md-12">
          <div className="row">
            <div className="col-sm-12">
              <button className="btn btn-danger btn-circle pull-right">
                <i className="glyphicon glyphicon-heart"></i>
              </button>
              </div>
          </div>
          <hr/>
          <div className="row">
            <div style={{height: 400}}className="col-sm-6 container">
                <img style={{width: '100%', height: 400}} src={`/images/${ad.image}`} />
            </div>
            <div className="col-sm-6">
              <GMap coords={coords} />
            </div>
          </div>
          <div className="caption">
            <h4>{ad.estate.city}</h4> <h5>{ad.estate.street}</h5>
            <p>
              Wolnych miejsc: {ad.freePlaces}<br/>
              Cena: {ad.price}<br/>
              Płatność: {ad.payment}<br/>
            </p>
          </div>
        </div>
      </div>
    );
  }
}


AdDetail = Relay.createContainer(AdDetail, {
  fragments: {
    ad: () => Relay.QL`
      fragment on Advertisement {
        id
        payment
        price
        freePlaces
        image
        estate {
          city
          street
          coords
        }
      }
      `
  }
});

class AdDetailRoute extends Route {

  static paramDefinitions = {
    id: { required: true }
  };

  static queries = {
    ad: (Component, vars) => Relay.QL`
      query {
        node(id: $id) {
          ${Component.getFragment('ad')}
        }
      }
    `
  };

  static routeName = 'AdDetailRoute';

}

export default (props) => {
  const { id } = props.params;
  return (
    <RootContainer
      Component={AdDetail}
      route={ new AdDetailRoute({ id })}
    />
  );
}
