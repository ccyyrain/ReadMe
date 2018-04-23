import React, { Component } from 'react';
import { Route } from 'react-router-dom'

import { withAuth } from './Auth';
import FrontPage from './FrontPage';
import Header from './Header';
import './app.css';

class App extends Component {

  render() {

    // this.props has a bunch of stuff in it related to auth0 (from `withAuth` below)
       console.log('props', this.props.profile);
    return (
      <div className="App">

        <Header {...this.props} />
        <div className="bg3"></div>
        <section className="section">
          <div className="content">

            <Route  path="/" render={props => <FrontPage {...props} {...this.props} />}/>
          </div>
        </section>



      </div>
    );
  }
}

export default withAuth(App);
