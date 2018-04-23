import React, { Component } from 'react';

class ShelfTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "toRead"
    };

    this.handleCategoryTabState.bind(this);
    this.isActive.bind(this);
  }

  handleCategoryTabState(selectedTab) {
    this.props.handleBookCategoryChange(selectedTab);
    this.setState(
      {selectedTab: selectedTab}
    );
  }

  isActive(state) {
    return ((state===this.state.selectedTab) ? 'is-active':'');
  }

  render() {
    return (
      <div className="ShelfTab">
        <div className="tabs is-boxed is-large">
          <ul>
            <li className={"to-read-tab " + this.isActive('toRead')} onClick={this.handleCategoryTabState.bind(this, "toRead")}>
              <a>
                <span className="icon is-small"><i className="fa fa-bars"></i></span>
                <span>To read</span>
              </a>
            </li>
            <li className={"reading-tab " + this.isActive('reading')} onClick={this.handleCategoryTabState.bind(this, "reading")}>
              <a>
                <span className="icon is-small"><i className="fa fa-th-list"></i></span>
                <span>Reading</span>
              </a>
            </li>
            <li className={"done-tab " + this.isActive('done')} onClick={this.handleCategoryTabState.bind(this, "done")}>
              <a>
                <span className="icon is-small"><i className="fa fa-list"></i></span>
                <span>Done</span>
              </a>
            </li>
            <li>
            <a className="is-right" onClick={this.props.clearSearch}>
            <span className="icon has-text-danger">
            <i className="fa fa-ban"></i>
            </span>
            <span>Clear Local Search</span>
            </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default ShelfTab;
