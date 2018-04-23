import React, { Component } from 'react';
import { Redirect } from 'react-router';
import './reading.css';
import OutsideLink from './OutsideLink';

class ToReadPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
        selectedBook: '',
        selectedBookId: '',
        redirect: false
    }
  }
  componentDidMount(){
     console.log("I did Moung!!!!!")
      for(var i = 0; i < this.props.books.length; i++) {
        if(this.props.books[i].bookId === this.props.match.params.bookId) {
            this.setState({
              selectedBook: this.props.books[i] ,
              selectedBookId: this.props.books[i].BookId
            })
        }
      }
  }

  addToReading(){
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
      let myRequest = new Request('/api/db/changeStatus', {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
          profile: this.props.profile,
          bookId: this.props.match.params.bookId
        })
      });
      fetch(myRequest)
        .then(response => {
          if (!response.ok) {
          }
          return response;
        })
        .then(res => res.json())
        .then(() => this.props.setCategory()
        )
        // .then(e => {this.props.getData()
      // }
        // )
        .then(json => {
          this.setState({
            redirect: true
          })
        })
        .catch(function (error) {
          console.error(error);
        });
  }


  render() {
    if(this.state.redirect){
    return (
      <Redirect push to={"/reading/" + this.state.selectedBook.bookId} />
    );
  }
  else{
    if(this.state.selectedBook)
    {
    return (
      <div className="ToReadPage container-offset is-desktop">
        <div className="box">
        <div className="columns">
        <div className="column is-one-third">
        <div>
          <figure className="image is-1by2">
            <img src={this.state.selectedBook.cover} alt="book_cover"/>
          </figure>
        </div>
        <div className="status"><span className="tag is-light is-large">
        <span className="icon has-text-info">
          <i className="fa fa-info-circle"></i>
          </span>
          &nbsp;&nbsp;Want to read
          </span>
        </div>

        </div>
        <div className="column">
          <div className="title is-3">{this.state.selectedBook.title}</div>
          <div className="subtitle is-5"> by {this.state.selectedBook.author?this.state.selectedBook.author:"Anonymous"}</div>
          <div className="rating">
          <span className="is-medium">
            <span className="icon has-text-warning">
            <i className="fa fa-star"></i>
            </span>
          Rating: {this.state.selectedBook.rating ? this.state.selectedBook.rating:5}/5
          (<span className="icon has-text-black-bis">
          <i className="fa fa-users"></i>
          </span> {this.state.selectedBook.ratingsCount ? this.state.selectedBook.ratingsCount:0} have rated)
          </span>
          </div>
          <div className = "publishedYear">Year: {this.state.selectedBook.publishYear?this.state.selectedBook.publishYear:"Unknown"}</div>
          <div className = "publisher">Publisher: {this.state.selectedBook.publisher?this.state.selectedBook.publisher:"Unknown"}</div>
          <div className="des"><span>Description: </span>{this.state.selectedBook.description ? this.state.selectedBook.description : "No description"}</div>
          <div className="lan">
          <b>Get a copy</b>
          <OutsideLink preview = {this.state.selectedBook.url.preview} buy = {this.state.selectedBook.url.buyLink} library = {this.state.selectedBook.url.library}/>
          </div>



          <div className="oper">
          <a className="button is-primary is-outlined is-medium marg" onClick={this.addToReading.bind(this)}>
            Start to read
          </a>
          </div>
        </div>
        </div>
      </div>
      </div>
    );
  }
  else{
    return null;
  }
  }
}
}

export default ToReadPage;
