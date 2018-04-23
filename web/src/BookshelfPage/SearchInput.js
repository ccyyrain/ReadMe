import React, { Component } from 'react';
const author_style = {
};
class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive:false,
      books: '',
      hasResult: false,
      searchResultIndex: 0
    }
    this.beginSearch = this.beginSearch.bind(this);
    this.handleModalOn = this.handleModalOn.bind(this);
    this.handleModalOff = this.handleModalOff.bind(this);
    this.preResult = this.preResult.bind(this);
    this.nexResult = this.nexResult.bind(this);
    this.addBook = this.addBook.bind(this);
    this.stillAdd = this.stillAdd.bind(this);
  }
  stillAdd(){
    var currentDate = new Date();
    var cover = "https://dummyimage.com/400x600/fff/000.jpg&text=" + this.state.searchKey;
    var bookInfo = {
      bookId:currentDate.getFullYear()+''+currentDate.getMonth()+''+currentDate.getDate()+''+currentDate.getUTCHours()+''+currentDate.getUTCMinutes()+''+currentDate.getUTCSeconds()+'',
      title: this.state.searchKey,
      author: '',
      description: '',
      cover: cover,
      publishYear: '',
      publisher: '',
      url: {
        preview: '',
        buyLink: '',
        library: ''
      },
      notes: []
    }
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
      let myRequest = new Request('/api/db/addBook', {
        method: 'POST',
        // this header sends the user token from auth0
        headers: myHeaders,
        body: JSON.stringify({
          user: this.props.profile.sub,
          book: bookInfo,
          toGo: "toRead"
        })
      });
      fetch(myRequest)
        .then(response => {
          // https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
          if (!response.ok) {
            console.log('im the response');
          }
          return response;
        })
        .then(res => res.json())
        .then(json => {
          this.handleModalOff();
        })
        .catch(function (error) {
          console.error(error);
        });
  }
  addBook(){
    var currentDate = new Date();
    var hasCover = this.state.books.items[this.state.searchResultIndex].volumeInfo.imageLinks;
    if(hasCover){
      var cover = this.state.books.items[this.state.searchResultIndex].volumeInfo.imageLinks.thumbnail;
    }
    else{
      var cover = "https://dummyimage.com/400x600/fff/000.jpg&text=" + this.state.books.items[this.state.searchResultIndex].volumeInfo.title;
    }
    var bookInfo = {
      bookId:currentDate.getFullYear()+''+currentDate.getMonth()+''+currentDate.getDate()+''+currentDate.getUTCHours()+''+currentDate.getUTCMinutes()+''+currentDate.getUTCSeconds()+'',
      title: this.state.books.items[this.state.searchResultIndex].volumeInfo.title,
      author: this.state.books.items[this.state.searchResultIndex].volumeInfo.authors,
      description: this.state.books.items[this.state.searchResultIndex].volumeInfo.description,
      cover: cover,
      publishYear: this.state.books.items[this.state.searchResultIndex].volumeInfo.publishedDate,
      publisher: this.state.books.items[this.state.searchResultIndex].volumeInfo.publisher,
      rating: this.state.books.items[this.state.searchResultIndex].volumeInfo.averageRating,
      ratingsCount: this.state.books.items[this.state.searchResultIndex].volumeInfo.ratingsCount,
      url: {
        preview:'',
        buyLink: '',
        library: ''
      },
      notes: []
    }
    var _identifiers = this.state.books.items[this.state.searchResultIndex].volumeInfo.industryIdentifiers
    if(_identifiers != null && _identifiers.length != 0){
      var _isbn =  _identifiers[0].identifier;
      bookInfo.url.library = "https://www.worldcat.org/search?q=" + _isbn + "&qt=owc_search";
    }
    if(this.state.books.items[this.state.searchResultIndex].saleInfo.buyLink){
      bookInfo.url.buyLink = this.state.books.items[this.state.searchResultIndex].saleInfo.buyLink;
    }
    if(this.state.books.items[this.state.searchResultIndex].volumeInfo.previewLink){
      bookInfo.url.preview = this.state.books.items[this.state.searchResultIndex].volumeInfo.previewLink;
    }
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
      let myRequest = new Request('/api/db/addBook', {
        method: 'POST',
        // this header sends the user token from auth0
        headers: myHeaders,
        body: JSON.stringify({
          user: this.props.profile.sub,
          book: bookInfo,
          toGo: "toRead"
        })
      });
      fetch(myRequest)
        .then(response => {
          if (!response.ok) {
            console.log('im the response');
          }
          return response;
        })
        .then(res => res.json())
        .then(json => {
          this.handleModalOff();
        })
        .catch(function (error) {
          console.error(error);
        });
  }
  preResult(){
    if(this.state.searchResultIndex > 0){
      this.setState({
        searchResultIndex: this.state.searchResultIndex - 1
      });
    }
    else{
      this.setState({
        searchResultIndex: 0
      })
    }
  }
  nexResult(){
    if(this.state.searchResultIndex < this.state.books.items.length-1){
      this.setState({
        searchResultIndex: this.state.searchResultIndex + 1
      })
    }
    else{
      this.setState({
        searchResultIndex: this.state.books.items.length - 1,
        hasResult: false
      })
    }
  }
  handleModalOn() {
    this.setState({isActive: true});
  }
  handleModalOff() {
    console.log("trying to turn it off")
    this.setState({
      isActive: false,
      searchResultIndex: 0
    });
    this.props.hook();
  }
  handleKeyPress = (e) => {
   if (e.key === 'Enter') {
     this.beginSearch();
   }
 }
  beginSearch(){
    if (document.getElementById('searchInput').value.toString().replace(/^\s+|\s+$/g, "").length === 0) {
      alert("Please input your book's title!");
    }
    else{
    if(this.props.searchOption.toString() === "library"){
      fetch('https://www.googleapis.com/books/v1/volumes?q=intitle:' + document.getElementById('searchInput').value.toString())
      .then(res =>res.json())
      .then(json =>{
        if(json.items){
          console.log('books', json);
          this.setState({
            books: json,
            hasResult: true,
            searchKey: document.getElementById('searchInput').value.toString()
          });
        }
        else{
          this.setState({
            hasResult: false,
            searchKey: document.getElementById('searchInput').value.toString()
          })
        }
      }).then(res =>
        this.handleModalOn())
        .catch(function (error){
          console.log(error);
        });
      }
      else{
        //Todo: for local search
        console.log("begin local")
        this.props.localSearch(document.getElementById('searchInput').value.toString());
      }
    }
  }
    render() {
      const isActive = this.state.isActive;
      if(!isActive) {
        return (
          <div className="search-input">
          <div className="control has-icons-left has-icons-right">
          <input className="is-large input classToInput" type="search" placeholder="Book name..." id="searchInput" onKeyPress={this.handleKeyPress}/>
          <span className="icon is-small is-left">
          <i className="fa fa-book"></i>
          </span>
          <span className="icon is-small is-right">
          <i className="fa fa-search"></i>
          </span>
          <div className="search-hide"  onClick={this.beginSearch}><a className="button is-large">s</a></div>
          </div>
          </div>
        );
      }
      else{
        if(this.state.hasResult && this.state.books.items[this.state.searchResultIndex].volumeInfo.imageLinks)
        {
          return(
            <div className="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-card modal_diy">
            <header className="modal-card-head">
            <p className="modal-card-title">Search Result(s)</p>
            <button className="delete" aria-label="close" onClick={this.handleModalOff}></button>
            </header>
            <section className="modal-card-body">
            <div className="columns">
            <div className="column is-one-third">
            <div>
            <figure className="image is-1by2">
            <img src={this.state.books.items[this.state.searchResultIndex].volumeInfo.imageLinks.thumbnail} alt="book_cover"/>
            </figure>
            </div>
            </div>
            <div className="column">
            <div className="title is-3">{this.state.books.items[this.state.searchResultIndex].volumeInfo.title}</div>
            <div className="subtitle is-5"><span>by </span><span style={author_style}>{this.state.books.items[this.state.searchResultIndex].volumeInfo.authors?this.state.books.items[this.state.searchResultIndex].volumeInfo.authors:"Unknown"}</span></div>
            <div className="rating">
            <span className="is-medium">
              <span className="icon has-text-warning">
              <i className="fa fa-star"></i>
              </span>
            Rating: {this.state.books.items[this.state.searchResultIndex].volumeInfo.averageRating ? this.state.books.items[this.state.searchResultIndex].volumeInfo.averageRating:5}/5
            (<span className="icon has-text-black-bis">
            <i className="fa fa-users"></i>
            </span> {this.state.books.items[this.state.searchResultIndex].volumeInfo.ratingsCount ? this.state.books.items[this.state.searchResultIndex].volumeInfo.ratingsCount:0} have rated)
            </span>
            </div>
            <div className="des"><span>Description: </span>{this.state.books.items[this.state.searchResultIndex].volumeInfo.description?this.state.books.items[this.state.searchResultIndex].volumeInfo.description:"No description."}</div>
            </div>
            </div>
            </section>
            <footer className="modal-card-foot">
            <button className="button is-success" onClick={this.addBook}><i className="fa fa-plus-circle" aria-hidden="true"></i> Add to Shelf</button>
            <button className="button" onClick={this.preResult}>Previous</button>
            <button className="button" onClick={this.nexResult}>Next book</button>
            </footer>
            </div>
            </div>
          );
        }
        else if(this.state.hasResult && !this.state.books.items[this.state.searchResultIndex].volumeInfo.imageLinks){
          return(
            <div className="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-card modal_diy">
            <header className="modal-card-head">
            <p className="modal-card-title">Search Result(s)</p>
            <button className="delete" aria-label="close" onClick={this.handleModalOff}></button>
            </header>
            <section className="modal-card-body">
            <div className="columns">
            <div className="column is-one-third">
            <div>
            <figure className="image is-1by2">
            <img src={"https://dummyimage.com/400x600/fff/000.jpg&text=" + this.state.books.items[this.state.searchResultIndex].volumeInfo.title} alt="Whoops! This book has no cover!"/>
            </figure>
            </div>
            </div>
            <div className="column">
            <div className="title is-3">{this.state.books.items[this.state.searchResultIndex].volumeInfo.title}</div>
            <div className="subtitle is-5"><span>by </span><span style={author_style}>{this.state.books.items[this.state.searchResultIndex].volumeInfo.authors?this.state.books.items[this.state.searchResultIndex].volumeInfo.authors:"Unknown"}</span></div>
            <div className="rating">
            <span className="is-medium">
              <span className="icon has-text-warning">
              <i className="fa fa-star"></i>
              </span>
            Rating: {this.state.books.items[this.state.searchResultIndex].volumeInfo.averageRating ? this.state.books.items[this.state.searchResultIndex].volumeInfo.averageRating:5}/5
            (<span className="icon has-text-black-bis">
            <i className="fa fa-users"></i>
            </span> {this.state.books.items[this.state.searchResultIndex].volumeInfo.ratingsCount ? this.state.books.items[this.state.searchResultIndex].volumeInfo.ratingsCount:0} have rated)
            </span>
            </div>
            <div className="des"><span>Description: </span>{this.state.books.items[this.state.searchResultIndex].volumeInfo.description?this.state.books.items[this.state.searchResultIndex].volumeInfo.description:"No description."}</div>
            </div>
            </div>
            </section>
            <footer className="modal-card-foot">
            <button className="button is-success" onClick={this.addBook}><i className="fa fa-plus-circle" aria-hidden="true"></i> Add to Shelf</button>
            <button className="button" onClick={this.preResult}>Previous</button>
            <button className="button" onClick={this.nexResult}>Next book</button>
            </footer>
            </div>
            </div>
          );
        }
        else{
          return(
            <div className="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-card modal_diy">
            <header className="modal-card-head">
            <p className="modal-card-title">Search Result(s)</p>
            <button className="delete" aria-label="close" onClick={this.handleModalOff}></button>
            </header>
            <section className="modal-card-body">
            <div>
            <p>
            Whoops! No search result in our library.
            </p>
            <p>
            Do you still want to add this book?
            </p>
            </div>
            </section>
            <footer className="modal-card-foot">
            <button className="button is-success" onClick={this.stillAdd}><i className="fa fa-plus-circle" aria-hidden="true"></i>Still add to shelf</button>
            </footer>
            </div>
            </div>
          )
          }
      }
      }
    }
    export default SearchInput;
