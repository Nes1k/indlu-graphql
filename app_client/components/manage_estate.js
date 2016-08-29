import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import { reduxForm, Field } from 'redux-form';

import { InputField, SelectField }  from '../components/input_field';
import { CreateEstateMutation, EditEstateMutation } from '../../mutation';

const loadToForm = (Component, propName) => {
  return (props) => (<Component {...props} initialValues={props[propName]}/>);
};

export class ManageEstate extends Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor(props){
    super(props);

    this._onSuccess = this._onSuccess.bind(this);
  }

  _onSuccess({ createEstate: { estate }}){
    console.log(estate);
    this.context.router.push(`/estates/edit/${estate.id}`);
  }

  onSubmit(props){
    const { estate } = this.props;
    let mutation;

    if(estate && estate.id){
      mutation = new EditEstateMutation({
        estate: { ...estate, ...props }
      });
    }
    else {
      mutation = new CreateEstateMutation({
        estate: props
      });
    }

    this.props.relay.commitUpdate(mutation, {
      onSuccess: this._onSuccess
    });
  }


  render(){
    const { handleSubmit } = this.props;
    return (
      <div className="row">
        <div className="col-lg-6 col-lg-offset-3">
          <form role="form" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
            <Field
              name="country"
              label="Country"
              options={[['PL', 'Polska'], ['EN', 'England']]}
              component={SelectField}
              type="select"
            />
            <hr/>
            <Field
              name="street"
              label="Street"
              component={InputField}
              type="text"
            />
            <hr/>
            <Field
              name="postalCode"
              label="Postal code"
              component={InputField}
              type="text"
            />
            <hr/>
            <Field
              name="city"
              label="City"
              component={InputField}
              type="text"
            />
            <hr/>
            <Field
              name="buildingType"
              label="Building Type"
              options={[[0, 'House'], [1, 'Apartment']]}
              component={SelectField}
              type="select"
            />
            <hr/>
            <Field
              name="name"
              label="Name"
              component={InputField}
              type="text"
            />
            <hr/>
            <div className="row">
              <div className="col-sm-6">
                <Link to="/estates" className="btn btn-default btn-block">Anuluj</Link>
              </div>
              <div className="col-sm-6">
                <button type="submit" className="btn btn-primary btn-block">Zapisz</button>
              </div>
            </div>
          </form>
        </div>
        <div className="col-lg-6">
        </div>
      </div>
    );
  }
}

const validate = (values) => {
  let errors = {};
  return errors;
};

ManageEstate = reduxForm({
  form: 'ManageEstate',
  validate
})(ManageEstate);

ManageEstate = loadToForm(ManageEstate, 'estate');

ManageEstate = Relay.createContainer(ManageEstate, {
  fragments: {
    estate: () => Relay.QL`
      fragment on Estate {
        id
        country
        street
        postalCode
        city
        buildingType
        name
        ${EditEstateMutation.getFragment('estate')}
      }
    `
  }
});

export default ManageEstate;
