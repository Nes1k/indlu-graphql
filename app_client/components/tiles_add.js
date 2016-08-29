import React, { Component } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';


let TilesAdd = (props) => {
  const { ad } = props;
  console.log(ad);
  return (
    <div key={ad.id} className="col-sm-12 col-md-6 col-lg-5">
      <div className="thumbnail">
        <Link to={`/ad/${ad.id}`}>
          <img src={`images/${ad.image}`} />
        </Link>
        <div className="caption">
          <h4>{ad.estate.city}</h4> <h5>{ad.estate.street}</h5>
          <p>
            Wolnych miejsc: {ad.freePlaces}<br/>
            Cena: {ad.price}<br/>
            Płatność: {ad.payment}
            <button className="btn btn-danger btn-circle pull-right">
              <i className="fa fa-heart"></i>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

TilesAdd = Relay.createContainer(TilesAdd, {
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
        }
      }
    `
  }
});

export default TilesAdd;
