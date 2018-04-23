import React, { Component } from 'react';

import LoginLogout from './LoginLogout';

class Header extends Component {

  render() {
    return (
      <nav className="navbar is-light">
        <div className="navbar-menu">
          <div className="navbar-start">
            <a className="navbar-item title" href="/">Just Read Me!</a>
          </div>
          <div className="navbar-end">
            <LoginLogout {...this.props} />
          </div>
        </div>
      </nav>
    )
  }

}

export default Header;
