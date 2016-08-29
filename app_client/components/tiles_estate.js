import React, { Component } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';

export let TilesEstate = ({ estate }) => {
  // TOOO: PHOTO
  return (
    <div className="col-md-6 tiles-estate">
      <div className="col-sm-6">
        <img className="img-rounded img-responsive" src='images/flat.jpg'/>
      </div>
      <div className="col-sm-6">
        <h3><strong>{estate.name}</strong></h3>
        <p><i className="fa fa-map-marker" /> {estate.city} {estate.street}</p>
        Building type: {estate.buildingType}<br/>
        Area: {estate.area}<br/>
        Number of rooms: {estate.numberOfRooms}
        <button className="btn btn-danger btn-circle pull-right">
          <i className="fa fa-times" />
        </button>
        <Link to={`/estates/edit/${estate.id}`}>
          <button className="btn btn-info btn-circle pull-right">
            <i className="fa fa-pencil" />
          </button>
        </Link>
      </div>
    </div>
  );
};


TilesEstate = Relay.createContainer(TilesEstate, {
  fragments: {
    estate: () => Relay.QL`
      fragment on Estate {
        id
        name
        city
        street
        buildingType
        area
        numberOfRooms
      }
    `
  }
});

export default TilesEstate;
