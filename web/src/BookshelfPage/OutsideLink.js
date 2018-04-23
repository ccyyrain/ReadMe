import React, { Component } from 'react';

class OutsideLink extends Component{
  render(){
    if(this.props.preview !=='' && this.props.buy!=='' && this.props.library!==''){
      return(
        <div className="OutsideLink">
        <a className="button is-primary is-outlined is-medium marg" href={this.props.preview}>
          Preview
        </a>
        <a className="button is-primary is-outlined is-medium marg" href = {this.props.buy}>
          BuyLink
        </a>
        <a className="button is-primary is-outlined is-medium marg" href = {this.props.library}>
          Nearby Libraries
        </a>
        </div>
      )
    }
    else if (this.props.preview!==''&&this.props.buy==='' && this.props.library ==='') {
      return(
      <div className = "OutsideLink">
      <a className="button is-primary is-outlined is-medium marg" href={this.props.preview}>
        Preview
      </a>
      <a className="button is-primary is-outlined is-medium marg" disabled>
        BuyLink
      </a>
      <a className="button is-primary is-outlined is-medium marg" disabled>
        Nearby Libraries
      </a>
      </div>
    )
    }
    else if(this.props.preview==='' && this.props.buy!=='' && this.props.library==='') {
      return(
      <div className = "OutsideLink">
      <a className="button is-primary is-outlined is-medium marg" disabled>
        Preview
      </a>
      <a className="button is-primary is-outlined is-medium marg" href = {this.props.buy}>
        buyLink
      </a>
      <a className="button is-primary is-outlined is-medium marg" disabled>
        Nearby Libraries
      </a>
      </div>
     )
    } else if(this.props.preview==='' && this.props.buy==='' && this.props.library!=='') {
      return(
      <div className = "OutsideLink">
      <a className="button is-primary is-outlined is-medium marg" disabled>
        Preview
      </a>
      <a className="button is-primary is-outlined is-medium marg" disabled>
        buyLink
      </a>
      <a className="button is-primary is-outlined is-medium marg" href = {this.props.library}>
        Nearby Libraries
      </a>
      </div>
     )
   } else if(this.props.preview==='' && this.props.buy!=='' && this.props.library!=='') {
       return(
       <div className = "OutsideLink">
       <a className="button is-primary is-outlined is-medium marg" disabled>
         Preview
       </a>
       <a className="button is-primary is-outlined is-medium marg" href = {this.props.buy}>
         buyLink
       </a>
       <a className="button is-primary is-outlined is-medium marg" href = {this.props.library}>
         Nearby Libraries
       </a>
       </div>
      )
  } else if(this.props.preview!=='' && this.props.buy==='' && this.props.library!=='') {
      return(
      <div className = "OutsideLink">
      <a className="button is-primary is-outlined is-medium marg" href = {this.props.preview}>
        Preview
      </a>
      <a className="button is-primary is-outlined is-medium marg" disabled>
        buyLink
      </a>
      <a className="button is-primary is-outlined is-medium marg" href = {this.props.library}>
        Nearby Libraries
      </a>
      </div>
     )
  } else if(this.props.preview!=='' && this.props.buy!=='' && this.props.library==='') {
      return(
      <div className = "OutsideLink">
      <a className="button is-primary is-outlined is-medium marg" href = {this.props.preview}>
        Preview
      </a>
      <a className="button is-primary is-outlined is-medium marg" href = {this.props.buy}>
        buyLink
      </a>
      <a className="button is-primary is-outlined is-medium marg" disabled>
        Nearby Libraries
      </a>
      </div>
     )
  }
    else{
      return(
      <div className = "OutsideLink">
      <a className="button is-primary is-outlined is-medium marg" disabled>
        Preview
      </a>
      <a className="button is-primary is-outlined is-medium marg" disabled>
        buyLink
      </a>
      <a className="button is-primary is-outlined is-medium marg" disabled>
        Nearby Libraries
      </a>
      </div>
    )
    }
  }
}
export default OutsideLink;
