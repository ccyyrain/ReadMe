import React, { Component } from 'react';
import BookCard from './BookCard';

class BookshelfRow extends Component {

  constructor(props) {
    super(props);
    this.state = { cards: this.props.books }
  }

  // pushCard(card) {
  //   this.props.pushCard(card);
  // }
  //
  // moveCard(dragIndex, hoverIndex) {
  //   this.props.moveCard(dragIndex, hoverIndex);
  // }
  //
  // removeCard(index) {
  //   this.props.removeCard(index);
  // }


  render() {

    const books = this.props.bookList;
		const { canDrop, isOver, connectDropTarget } = this.props;
		const isActive = canDrop && isOver;
    if(books.length!== 0) {

      return (
        <div className="bookshelfRow">
          <div className="columns">
            <div className="column is-1">
              <div className="invisible-box">
              </div>
            </div>
            <div className="column">
              {books.map((card, i) => {
                return (
                  <BookCard
                    key={card.bookId}
                    index={i}
                    listId={this.props.id}
                    card={card}
                    bookCategory={this.props.bookCategory}
                   />
                );
              })}
            </div>
          </div>
  			</div>
      );
    }
  }
}

const cardTarget = {
	drop(props, monitor, component ) {
		const { id } = props;
		const sourceObj = monitor.getItem();
		if ( id !== sourceObj.listId ) {
      component.pushCard(sourceObj.card);
    }
		return {
			listId: id
		};
	}
}

export default BookshelfRow
// export default DropTarget("CARD", cardTarget, (connect, monitor) => ({
// 	connectDropTarget: connect.dropTarget(),
// 	isOver: monitor.isOver(),
// 	canDrop: monitor.canDrop()
// }))(BookshelfRow);
