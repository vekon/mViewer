import React from 'react'
import UserListStyles from '../shared/listpanel.css'
import $ from 'jquery'
class UserItemComponent extends React.Component {

 constructor(props) {
   super(props);
   this.state = {
     hover_flag: false
   }
  }

  render () {
    return (
      <div className={(this.props.isSelected ? UserListStyles.menuItem +' ' +UserListStyles.highlight :UserListStyles.menuItem)} key={this.props.name} >
        <span>
          <i className="fa fa-folder-open-o" aria-hidden="true"></i>
        </span>
        <button onClick={this.props.onClick} value={this.props.name}>{this.props.name}</button>
      </div>
    );
  }
}
UserItemComponent.getDefaultProps = {
  isSelected: false
}
UserItemComponent.propTypes = {
  onClick: React.PropTypes.func.isRequired,
  isSelected: React.PropTypes.bool
}

export default UserItemComponent;
