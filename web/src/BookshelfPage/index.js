import React, { Component } from 'react';
import SearchInput from './SearchInput';
import SearchOptionBtn from './SearchOptionBtn';
import BookshelfContainer from './BookshelfContainer';
import { Route } from 'react-router-dom'


import './bookshelf.css';
import ToReadPage from './toRead';
import ReadingPage from './readingPage';
import DonePage from './donePage';

class BookshelfPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bookCategory: "toRead",
      books: '',
      searchOption: "library",
      hook: false
    }
    this.handleBookCategoryChange=this.handleBookCategoryChange.bind(this);
    this.handleSearchOptionChange=this.handleSearchOptionChange.bind(this);
    this.hookChild = this.hookChild.bind(this);

    this.getData = this.getData.bind(this);
    this.localSearch = this.localSearch.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }
  handleBookCategoryChange(selectedCategory) {
    let myPromise = new Promise((resolve, reject) =>{
      this.setState(
        {bookCategory: selectedCategory}
      )
      resolve("success");
    })
    myPromise.then(() => {
          if(this.state.bookCategory === 'toRead'){
            this.setState({
              books: this.state.allBooks.toRead
            })
          }
          else if(this.state.bookCategory === 'reading'){
            this.setState({
              books: this.state.allBooks.inProgress
            })
          }
          else{
            this.setState({
              books: this.state.allBooks.finished
            })
          }
        })
  }
  getData() {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    // console.log(this.props.profile);
    if(this.props.profile){
      let myRequest = new Request('/api/db/getData', {
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
          if(this.state.bookCategory === 'toRead'){
            console.log(json.bookList.toRead, 'im toread')
            this.setState({
              allBooks:json.bookList,
              books: json.bookList.toRead
            })
          }
          else if(this.state.bookCategory === 'reading'){
            console.log(json.bookList.inProgress, 'im reading')
            this.setState({
              allBooks:json.bookList,
              books: json.bookList.inProgress
            })
          }
          else{
            console.log(json.bookList.fineshed, 'im done')
            this.setState({
              allBooks:json.bookList,
              books: json.bookList.finished
            })
          }
          console.log(this.state,"wo shi state");
        })
        .catch(function (error) {
          console.error(error);
        });
    }
    else{
    }
    return 0;
  }

  componentDidMount(){
    this.getData();
  }

  hookChild() {
    this.getData();
  }

  localSearch(searchText){
    var newText = searchText.toLowerCase();
    var localResult = [];
    for(var i = 0; i < this.state.books.length; i++){
      var bookTitle = this.state.books[i].title.toString();
      if(this.state.books[i].author)
      var bookAuthor = this.state.books[i].author.toString();
      else {
         bookAuthor = 'unKnown';
      }
      if(bookTitle.toLowerCase() === newText || bookAuthor.toLowerCase() === newText){
        localResult.push(this.state.books[i]);
      }
    }
    this.setState({
      books: localResult
    })
  }


  /**
  **  Drag book card logic.
  **/
  clearSearch(){
    this.getData();
  }


  handleSearchOptionChange(event) {
    this.setState({searchOption: event.target.value});
  }

  // pushCard(card) {
	// 	this.setState(update(this.state, {
	// 		books: {$push: [ card ]}
	// 	  }));
	//   }


  setCategory() {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    // console.log(this.props.profile);
    if(this.props.profile){
      let myRequest = new Request('/api/db/getData', {
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
          if(this.state.bookCategory === 'toRead'){
            console.log(json.bookList.toRead, 'im toread')
            this.setState({
              bookCategory:"reading",
              allBooks:json.bookList,
              books: json.bookList.inProgress
            })
          }
          else if(this.state.bookCategory === 'reading'){
            console.log(json.bookList.inProgress, 'im reading')
            this.setState({
               bookCategory:"done",
              allBooks:json.bookList,
              books: json.bookList.finished
            })
          }
          console.log(this.state,"wo shi state");
        })
        .catch(function (error) {
          console.error(error);
        });
    }
    else{
    }
    return;
  }


  render() {
        console.log(this.state.books,"test to see books");
    return (
      <div className="BookshelfPage">
        <div className="columns">
          <div className="column">
            <SearchInput {...this.state} {...this.props} hook = {this.hookChild.bind(this)} localSearch = {this.localSearch.bind(this)}/>
          </div>
          <div className="column">
            <SearchOptionBtn handleSearchOptionChange={this.handleSearchOptionChange}/>
          </div>
        </div>
        <Route path = "/toRead/:bookId" render={props => <ToReadPage {...props} {...this.state} profile = {this.props.profile} getData = {this.getData} setCategory = {this.setCategory.bind(this)}/>} />
        <Route path = "/reading/:bookId" render={props => <ReadingPage {...props} {...this.state} profile = {this.props.profile} getData = {this.getData} setCategory = {this.setCategory.bind(this)}/>} />
        <Route path = "/done/:bookId" render={props => <DonePage {...props} {...this.state} profile = {this.props.profile} getData = {this.getData}/>} />
        <Route exact path="/" render={
          props =>
            <BookshelfContainer
              {...this.props}
              {...this.state}
              clearSearch = {this.clearSearch.bind(this)}
              handleBookCategoryChange = {this.handleBookCategoryChange.bind(this)}
            />
        }/>
      </div>
    );
  }
}

export default BookshelfPage;
