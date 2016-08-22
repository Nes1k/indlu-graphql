import React, { Component } from 'react';
import { Link } from 'react-router';

export class EditEstate extends Component {
  render(){
    return (
      <div className="row">
        <div className="col-lg-6 col-lg-offset-3">
          <form role="form">
            <div className="row">
              <div className="col-sm-12">
              </div>
              <label className="col-sm-4">Kraj</label>
              <div className="col-sm-8">
                <select value="PL" className="form-control">
                  <option value="">---------</option>
                  <option value="PL">Polska</option>
                </select>
              </div>
            </div>
            <hr/>
            <div className="row">
              <div className="col-sm-12">
              </div>
              <label className="col-sm-4">Ulica</label>
              <div className="col-sm-8">
                <input className="form-control" type="text" value="Świdnik 102" />
              </div>
            </div>
            <hr/>
            <div className="row">
              <div className="col-sm-12">
              </div>
              <label className="col-sm-4">Kod pocztowy</label>
              <div className="col-sm-8">
                <input className="form-control" maxlength="120" type="text" value="34-606"/>
              </div>
            </div>
            <hr/>
            <div className="row">
              <div className="col-sm-12">
              </div>
              <label className="col-sm-4">Miasto</label>
              <div className="col-sm-8">
                <input className="form-control" maxlength="120" type="text" value="Łukowica"/>
              </div>
            </div>
            <hr/>
            <div className="row">
              <div className="col-sm-12">
              </div>
              <label className="col-sm-4">Typ budynku</label>
              <div className="col-sm-8">
                <select className="form-control">
                  <option value="">---------</option>
                  <option value="Dom">Dom</option>
                  <option value="Blok">Blok</option>
                  <option value="Kamienica">Kamienica</option>
                  <option value="Apartamentowiec">Apartamentowiec</option>
                </select>
              </div>
            </div>
            <hr/>
            <div className="row">
              <div className="col-sm-12">
              </div>
              <label className="col-sm-4">Nazwa budynku</label>
              <div className="col-sm-8">
                <input className="form-control" maxLength="120" type="text" value="Nowy"/>
              </div>
            </div>
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

export default EditEstate;
