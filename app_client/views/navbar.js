import React from 'react';
import { Link } from 'react-router';

export default (props) => {
  return (
    <nav className="navbar navbar-default">
      <div className="container-fluid">
        <div className="navbar-header">
          <Link to="/" className="navbar-brand">
            Logo
          </Link>
        </div>
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-6">
          <ul className="nav navbar-nav">
            <li>
              <Link to="/estates" activeClassName="active">
                My real estate
              </Link>
            </li>
            <li>
              <Link to="/properties" activeClassName="active">
                Properties
              </Link>
            </li>
            <li>
              <Link to="/properties" activeClassName="active">
                Properties
              </Link>
            </li>
          </ul>
          <p className="navbar-text navbar-right">Signed in as User</p>
        </div>
      </div>
    </nav>
  );
};
