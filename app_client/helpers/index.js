import React from 'react';


export const loadToForm = (Component, propName) => {
  return (props) => (<Component {...props} initialValues={props[propName]}/>);
};
