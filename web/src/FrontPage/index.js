import React, { Component } from 'react';
import './frontpage.css';

import BookshelfPage from '../BookshelfPage';

class Frontpage extends Component {

  constructor(props) {
    super(props);
    this.isAuthenticated = this.props.isAuthenticated.bind(this);
  }

  isLoggedIn() {
    return this.isAuthenticated() && !!this.props.profile;
  }

  render() {
    const hello = this.isLoggedIn()
    if(hello) return (
      <BookshelfPage {...this.props}/>
    );
    else return(
      <div className="FrontPage">
      <div className="bg">
      </div>
      <div className="bg1">
      </div>
      <div className="welcome">
        <h1>
          <span className="icon"><i className="fa fa-home"></i></span>
          &nbsp;
          Welcome to Just ReadMe!
        </h1>
        <div>
        <span>It is a book cateloging website.</span>
        <span>Please <strong>sign in</strong> to manage your books and write down your reviews.</span>
        </div>
      </div>
      </div>
    );
  }
}

export default Frontpage;
