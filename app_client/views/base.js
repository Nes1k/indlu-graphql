import React from 'react';
import Navbar from './navbar';

export default (props) => {
  return (
    <div>
      <Navbar />
      <div className="container">
        {props.children}
      </div>
    </div>
  );
}
