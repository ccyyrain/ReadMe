import React, { Component } from 'react';
import 'bulma/css/bulma.css';

class LoginLogout extends Component {

  constructor(props) {
    super(props);
    this.isAuthenticated = this.props.isAuthenticated.bind(this);
    this.login = this.props.login.bind(this);
    this.logout = this.props.logout.bind(this);
  }

  createDB(){
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    if(this.isAuthenticated()){
      let myRequest = new Request('/api/db/login', {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(this.props.profile)
      });

      fetch(myRequest)
        .then(response => {
          if (!response.ok) {
          }
          return response;
        })
        .then(res => res.json())
        .then(json => {
          // this.getData();
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }

  isLoggedIn() {
    return this.isAuthenticated() && !!this.props.profile;
  }

  render() {
    if(this.props.profile){
      this.createDB();
    }
    const userDisplay = this.isLoggedIn()
      ? (
        <div className="navbar-item">
        <img src={this.props.profile.picture} alt=""></img>
          <span>{this.props.profile.name}</span>
        </div>
      ) : null;

    const loginLogoutButton = this.isLoggedIn()
      ? (
        <button className="button" onClick={this.logout}>
          Log Out
        </button>
      ) : (
        <button className="button" onClick={this.login}>
          Log In
        </button>
      );

      const shelfDisplay = this.isLoggedIn()
        ? (
          <div className="navbar-end has-dropdown is-hoverable">
            <a className="navbar-item" href="/">
              <i className="fa fa-pencil-square fa-2x"></i>
              My Shelf
            </a>
          </div>
        ) : null;

    return (
      <div className="navbar-end">
        {shelfDisplay}
        {userDisplay}
        <div className="navbar-item">
          {loginLogoutButton}
        </div>
      </div>
    )
  }
}

export default LoginLogout;
