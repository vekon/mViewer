import React from 'react'
import dbListStyles from './dblist.css'
import sharedStyles from '../shared/listpanel.css'
import modalStyles from '../shared/modal.css'
import $ from 'jquery'
import modal from 'react-modal'

class DbItemComponent extends React.Component {

 constructor(props) {
    super(props);
    this.state = {
      hover_flag: false,
      modalIsOpen: false
    }
  }

  callParentClick () {
    if (typeof this.props.onClickHandler === 'function') {
      this.props.onClickHandler();
    }
  }

  render () {
    return (
      <div className={(this.props.isSelected ? dbListStyles.menuItem +' ' +dbListStyles.highlight :dbListStyles.menuItem)} key={this.props.name} >
        <span>
          <i className="fa fa-database" aria-hidden="true"></i>
        </span>
        <button onClick={this.props.onClick} value={this.props.name}>{this.props.name}</button>
        <i className={"fa fa-remove " +  sharedStyles.removeIcon} aria-hidden="true" onClick={this.callParentClick.bind(this)}></i>
      </div>
    );
  }
}

DbItemComponent.getDefaultProps = {
  isSelected: false
}
DbItemComponent.propTypes = {
  onClick: React.PropTypes.func.isRequired,
  isSelected: React.PropTypes.bool
}

export default DbItemComponent;
