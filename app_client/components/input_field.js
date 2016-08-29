import React from 'react';

const Error = ({ error, show }) => {
  if(!show){
    return null;
  }

  return (
    <div className="col-sm-12 alert alert-danger">
      <ul className="errorlist">
        <li>{error}</li>
      </ul>
    </div>
  );
};

export const InputField = (field) => {
  return (
    <div className="row">
      <label className="col-sm-4">{field.label}</label>
      <div className="col-sm-8">
        <input className="form-control" {...field.input} />
      </div>
      <Error show={field.meta.touched && field.meta.error} error={field.meta.error} />
    </div>
  );
};


export const SelectField = (field) => {
  return (
    <div className="row">
      <label className="col-sm-4">{field.label}</label>
      <div className="col-sm-8">
        <select className="form-control" {...field.input}>
          <option value="">---------</option>
          {field.options.map((option) =>
            <option key={option[0]} value={option[0]}>{option[1]}</option>
           )}
        </select>
      </div>
    </div>
  );
};
