import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash/flow';
import { Link } from 'react-router-dom';

class BookCard extends Component {

  render() {
    //TODO: apply opacity when dragging;
    const { card, isDragging, connectDragSource, connectDropTarget } = this.props;
    const opacity = isDragging ? 0 : 1;
    if(this.props.bookCategory === 'toRead'){
      return (
        <a>
        <Link to={'/toRead/' + card.bookId }>
        <img alt="Seems No Cover" title={card.title +"\n By "+ card.author} width="10%" className="bookImg" src={card.cover}>
        </img>
        </Link>
        </a>
      );
    }
    else if(this.props.bookCategory === 'reading'){
      return (
        <a>
        <Link to={'/reading/' + card.bookId }>
        <img alt="Seems No Cover" title={card.title +"\n By "+ card.author} width="10%" className="bookImg" src={card.cover}>
        </img>
        </Link>
        </a>
      );
    }
    else{
      return (
        <a>
        <Link to={'/done/' + card.bookId }>
        <img alt="Seems No Cover" title={card.title +"\n By "+ card.author} width="10%" className="bookImg" src={card.cover}>
        </img>
        </Link>
        </a>
      );
    }
  }
}


const cardSource = {

  beginDrag(props) {
    return {
      index: props.index,
      listId: props.listId,
      card: props.card
    };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if ( dropResult && dropResult.listId !== item.listId ) {
      props.removeCard(item.index);
    }
  }
};

const cardTarget = {

  //TODO: Fixed the horizontal-dragging logic here;
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    const sourceListId = monitor.getItem().listId;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    if ( props.listId === sourceListId ) {
      props.moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      monitor.getItem().index = hoverIndex;
    }
  }
};

export default BookCard;

// export default flow(
//   DropTarget("CARD", cardTarget, connect => ({
//     connectDropTarget: connect.dropTarget()
//   })),
//   DragSource("CARD", cardSource, (connect, monitor) => ({
//     connectDragSource: connect.dragSource(),
//     isDragging: monitor.isDragging()
//   }))
// )(BookCard);
