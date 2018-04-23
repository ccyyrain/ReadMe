import React, { Component } from 'react';
import { Redirect }from 'react-router';
import OutsideLink from './OutsideLink';
import './reading.css';

var listStyle = {
  "list-style":null
}
class ReadingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedBook: '',
      selectedBookId: '',
      selectedBookIndex:-1,
      selectedNoteId:'',
      comment:'',
      isActive:false,
      redirect: false
    }
    this.submitNote = this.submitNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.handleEditOn = this.handleEditOn.bind(this);
    this.handleEditOff = this.handleEditOff.bind(this);
    this.editText = this.editText.bind(this);
    this.updateNote = this.updateNote.bind(this);
  }

  addToDone(){
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
    .then(e => this.props.setCategory())
    // .then(e => this.props.getData())
    .then(json => {this.setState({
    redirect: true
    })
    })
    .catch(function (error) {
  console.error(error);
});
}

  updateNote(){
    const noteId = this.state.selectedNoteId;
    if(document.getElementById("noteUpdate")){
    const text = document.getElementById("noteUpdate").value;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    let myRequest = new Request('/api/db/updateNote', {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
          user: this.props.profile.sub,
          bookId: this.state.selectedBookId,
          category: this.props.bookCategory,
          noteId: noteId,
          text: text
        })
      });
    fetch(myRequest)
    .then(res=>{this.handleEditOff()})
    .then(res=>{this.props.getData()})
    .catch(function (error) {
      console.error(error);
    });
  }
  }

deleteNote(noteId){
   var myHeaders = new Headers();
   myHeaders.append('Content-Type', 'application/json');
     let myRequest = new Request('/api/db/deleteNote', {
       method: 'POST',
       headers: myHeaders,
       body: JSON.stringify({
         user: this.props.profile.sub,
         bookId: this.state.selectedBookId,
         category: this.props.bookCategory,
         noteId: noteId
       })
     });
     fetch(myRequest)
       .then(response => {this.props.getData()})
       .catch(function (error) {
         console.error(error);
       });
 }

submitNote(){
  var currentDate = new Date();
  var time = currentDate.getFullYear()+"/"+currentDate.getMonth()+"/"+currentDate.getDate();
  var text = document.getElementById('noteInput').value;
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  let myRequest = new Request('/api/db/addNote', {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({
      user: this.props.profile.sub,
      bookId: this.state.selectedBookId,
      category: this.props.bookCategory,
      note:{
        noteId:currentDate.getFullYear()+''+currentDate.getMonth()+''+currentDate.getDate()+''+currentDate.getUTCHours()+''+currentDate.getUTCMinutes()+''+currentDate.getUTCSeconds()+'',
        text:text,
        time:time
      }
    })
  });
  fetch(myRequest)
  .then(response =>{console.log("finished writing note")})
  .then((res) => {
    this.props.getData();
  })
  .then(n =>{
    document.getElementById('noteInput').value = '';
  })
  .catch(function (error) {
    console.error(error);
  });
}
handleEditOn(note) {
  this.setState({
      isActive: true,
      selectedNoteId: note.noteId,
      comment: note.text
    });
}
handleEditOff() {
  this.setState({
    isActive: false});
}

editText(){
  var text = document.getElementById('noteUpdate').value;
  //this.value = text;
  this.setState({
    comment:text
  })
}

componentDidMount(){
  console.log("I am mounting readingPage!!!")
  for(var i = 0; i < this.props.books.length; i++) {
    if(this.props.books[i].bookId === this.props.match.params.bookId) {
      console.log("I wantto know index",i);
      console.log("I want props",this.props)
      this.setState({
        selectedBook: this.props.books[i] ,
        selectedBookId: this.props.books[i].bookId,
        selectedBookIndex:i
      })
    }
  }
}

render() {
  const element = <h3>Please write down your first note!</h3>;

  var selectedBookIndex = -1;
  for(var i = 0; i < this.props.books.length; i++) {
    if(this.props.books[i].bookId === this.props.match.params.bookId) {
      selectedBookIndex = i;
    }
  }
if(selectedBookIndex>-1){
  if(this.state.redirect){
    return (
      <Redirect push to={"/done/" + this.state.selectedBookId} />
    );
  }
  else{
    const listItems = this.props.books[selectedBookIndex].notes.map((note) =>
    <li key={note.time.toString()}>
    <div className="box">
    <article className="media is-widescreen">
    <div className="media-content">
    <div className="content">
    <p>
    <strong>Date: {note.time}</strong>
    </p>
    <div className = "cotent2">
    <ul>
    {note.text.split("\n").map((p) =>
    <li key = {p}>
    {p}
    </li>)}
    </ul>
    </div>
    </div>
    <nav className="level is-mobile">
    <div className="level-left">
    <a className="level-item" onClick={() => this.handleEditOn(note)}>
      <span className="icon is-small"><i className="fa fa-edit"></i></span>
      <span>&nbsp;</span>
      <span><u>Edit</u></span>
    </a>
    </div>
    </nav>
    </div>
    <div className="media-right">
    <button className="delete" onClick = {() => this.deleteNote(note.noteId)}></button>
    </div>
    </article>
    </div>
    </li>
  );
  if(this.state.isActive){
    // for(var j = 0; j < this.props.books[selectedBookIndex].length; j++) {
    //   if(this.props.books[selectedBookIndex].notes() === this.props.match.params.bookId) {
    //     selectedBookIndex = i;
    //   }
    // }
    return(
      <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-card modal_diy">
      <header className="modal-card-head">
      <h1 className="modal-card-title">Edit your note</h1>
      <button className="delete" aria-label="close" onClick={this.handleEditOff}></button>
      </header>
      <section className="modal-card-body">
      <div>
      <textarea id="noteUpdate" className="textarea is-info" onChange={this.editText} placeholder="content" rows="10" value={this.state.comment}>

      </textarea>
      </div>
      </section>
      <footer className="modal-card-foot">
      <button className="button is-info is-medium" onClick={this.updateNote}><i className="fa fa-file-text" aria-hidden="true"></i>&nbsp;Submit</button>
      </footer>
      </div>
      </div>
    );
  }
  else{
    if(this.state.selectedBook)
    {
  return (
    <div className="ReadingPage container-offset is-desktop">

    <div className="box">
    <div className="columns">
    <div className="column is-one-third">
    <div>
    <figure className="image is-1by2">
    <img src={this.state.selectedBook.cover} alt="book_cover"/>
    </figure>
    </div>
    <div className="status">
    <span className="tag is-light is-large is-rounded"><span className="icon has-text-warning">
    <i className="fa fa-ellipsis-h"></i>
    </span>&nbsp;&nbsp;Currently Reading
    </span>
    </div>
    </div>
    <div className="column">
    <div className="title is-3">{this.state.selectedBook.title}</div>
    <div className="subtitle is-5">by {this.state.selectedBook.author?this.state.selectedBook.author:"Anonymous"}</div>
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
    <OutsideLink preview = {this.state.selectedBook.url.preview} buy = {this.state.selectedBook.url.buyLink} library={this.state.selectedBook.url.library}/>
    </div>
    <div className="oper">
    <a className="button is-primary is-outlined is-medium marg" onClick={this.addToDone.bind(this)}>
    Finish Reading
    </a>
    </div>
    </div>
    </div>
    </div>

    <div className="add_notes">
    <div>
    <h1>Add a note</h1>
    </div>
    <article className="media is-tablet">
    <figure className="media-left">
    <p className="image is-64x64">
    <img src={this.props.profile.picture} />
    </p>
    </figure>
    <div className="media-content">
    <div className="field">
    <p className="control">
    <textarea id="noteInput" className="textarea" placeholder="Please write down your comment..."></textarea>
    </p>
    </div>
    <nav className="level">
    <div className="level-left">
    <div className="level-item">
    <a className="button is-info" onClick = {this.submitNote}>Submit</a>
    </div>
    </div>
    </nav>
    </div>
    </article>
    </div>
    <div className="bot_boarder">
    <div className="your_div">
    <h1>Your Note(s)</h1>
    </div>
    {listItems.length >0?" ":element}
    <ul className = "myList">{listItems}</ul>
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
else{
// console.log(this.state.selectedBookIndex,"I am false")
return null;
}
}
}

export default ReadingPage;
