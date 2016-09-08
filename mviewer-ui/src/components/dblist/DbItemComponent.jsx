import React from 'react'
import dbListStyles from './dblist.css'
import sharedStyles from '../shared/listpanel.css'
import $ from 'jquery'
import DeleteComponent from '../deletecomponent/DeleteComponent.jsx'

class DbItemComponent extends React.Component {

 constructor(props) {
    super(props);
    this.state = {
      hover_flag: false,
      modalIsOpen: false
    }
  }

  openModal() {
    this.setState({modalIsOpen: true});
    this.setState({message: ''});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
    this.props.refreshDbList();
  }

  render () {
    return (
      <div className={(this.props.isSelected ? dbListStyles.menuItem +' ' +dbListStyles.highlight :dbListStyles.menuItem)} key={this.props.name} >
        <span>
          <i className="fa fa-database" aria-hidden="true"></i>
        </span>
        <button onClick={this.props.onClick} value={this.props.name}>{this.props.name}</button>
        <i className={"fa fa-remove " +  sharedStyles.removeIcon} aria-hidden="true" onClick={this.openModal.bind(this)}></i>
          {this.state.modalIsOpen?<DeleteComponent modalIsOpen={this.state.modalIsOpen} closeModal={this.closeModal.bind(this)} title = 'database' dbName = {this.props.name} connectionId={this.props.connectionId} ></DeleteComponent> : ''}
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
