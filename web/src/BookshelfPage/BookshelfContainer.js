import React, { Component } from 'react';
import BookshelfRow from './BookshelfRow';
import ShelfTab from './ShelfTab';



class BookshelfContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      books: []
    }
  }

  renderBookshelfRow(rowId, bookList) {
    return (
      <BookshelfRow
        id={rowId}
        bookList = {bookList}
        {...this.props}
      />
    );
  }

  renderShelfRows(bookList) {

    console.log(bookList, "bookList");
    let emptyShelfRow = (
      <div className="bookshelf-rows">
        <div className="bookshelfRow">
          <div className="invisible-box-in-empty-row">
          </div>
        </div>
      </div>
    );

    var rowId = 0;
    let rows = []
    for(var i = 0; i < bookList.length; i += 6) {
      let row = []
      for(var j = 0; j < 6; j++) {
        if(i + j < bookList.length) {
          row.push(bookList[i+j]);
        } else {
          break;
        }
      }

      rows.push(this.renderBookshelfRow(rowId, row));
      ++rowId;
    }
    if(rowId < 3) {
      var neededEmptyRow = 3 - rowId;
      for(var i = 0; i < neededEmptyRow; i++) {
        rows.push(emptyShelfRow);
      }
    }
    return rows;
  }

  render() {
    if(this.props.books.length !== 0) {
      return (
        <div className="BookshelfContainer">
          <ShelfTab
            clearSearch={this.props.clearSearch}
            handleBookCategoryChange={this.props.handleBookCategoryChange}
          />
          <div className="bookshelf-rows">
            {this.renderShelfRows(this.props.books)}
          </div>
        </div>
      );
    }
    else{
      return (
        <div className="BookshelfContainer">
          <ShelfTab clearSearch={this.props.clearSearch}
            handleBookCategoryChange={this.props.handleBookCategoryChange}
          />
          <div className="bookshelf-rows">
            <div className="bookshelfRow">
              <div className="invisible-box-in-empty-row">
              </div>
            </div>
          </div>
          <div className="bookshelf-rows">
            <div className="bookshelfRow">
              <div className="invisible-box-in-empty-row">
              </div>
            </div>
          </div>
          <div className="bookshelf-rows">
            <div className="bookshelfRow">
              <div className="invisible-box-in-empty-row">
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default BookshelfContainer;
