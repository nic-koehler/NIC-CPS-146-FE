import React from 'react';
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';
import './App.css';

import {
//  BrowserRouter as Router,
  Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './Home';
import MySQLAccount from './MySQLAccount';
import MySQLAccountVerify from './MySQLAccountVerify';

// initialize ReactGA
const trackingId = process.env.REACT_APP_GAID || ''; // Replace with your Google Analytics tracking ID
ReactGA.initialize(trackingId);
ReactGA.pageview(window.location.pathname);

// set up history
const history = createBrowserHistory();

// Initialize google analytics page view tracking
history.listen(location => {
  ReactGA.pageview(location.pathname); // Record a pageview for the given page
});

function App() {
  return (
    <Router history={history}>
      <main>
        <nav className="navbar navbar-expand navbar-dark bg-dark" aria-label="Second navbar example">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">NIC Koehler</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample02" aria-controls="navbarsExample02" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarsExample02">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/create-mysql-account">
                    MySQL Account</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <Switch>
          <Route path="/verify-mysql-account/:token" component={MySQLAccountVerify} />
          <Route path="/create-mysql-account">
            <MySQLAccount />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </main>
    </Router>
  );
}

export default App;
