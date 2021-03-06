import React, { PropTypes } from 'react';
import { GoogleMapLoader, GoogleMap, Marker } from 'react-google-maps';


const GMap = (props) => {
  const coords = { lat: props.coords[0], lng: props.coords[1]};
  return (
    <GoogleMapLoader
      containerElement={
        <div style={{ height: 400, width: "100%"}}/>
      }
      googleMapElement={
        <GoogleMap
          defaultZoom={15}
          defaultCenter={coords}
        >
          <Marker position={coords}/>
        </GoogleMap>
      }
    />
  );
};

GMap.propTypes = {
  coords: PropTypes.array.isRequired
};

export default GMap;

