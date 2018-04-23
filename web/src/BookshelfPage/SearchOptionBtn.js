import React, { Component } from 'react';

class SearchOptionBtn extends Component {

  render() {
    return (
      <div className="SearchOptionBtn">
        <div className="control has-icons-left">
          <div className="select is-large">
            <select onChange={this.props.handleSearchOptionChange}>
              <option value="library">Library</option>
              <option value="internal">In Shelf</option>
            </select>
          </div>
          <div className="icon is-small is-left">
            <i className="fa fa-globe"></i>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchOptionBtn;
