import React from 'react'
import dbListStyles from './dblist.css'
import $ from 'jquery'
import DeleteComponent from '../deletecomponent/DeleteComponent.jsx'

class DbItemComponent extends React.Component {

 constructor(props) {
    super(props);
    this.state = {
      hover_flag: false,
      modalIsOpen: false,
      _isMounted: false
    }
  }

  openModal(e) {
    e.stopPropagation();
    this.setState({modalIsOpen: true});
    this.setState({message: ''});
  }

  closeModal(successMessage) {
    if(this.state._isMounted == true){
      this.setState({modalIsOpen: false});
      if(successMessage == true){
        this.props.refreshDbList('undefined');
      }
    }
  }

  componentDidMount(){
    this.state._isMounted = true;
  }

  componentWillUnmount(){
    this.state._isMounted = false;
  }


  render () {
    return (
      <div onClick={this.props.onClick} value={this.props.name} className={(this.props.isSelected ? dbListStyles.menuItem +' ' +dbListStyles.highlight :dbListStyles.menuItem)} key={this.props.name} >
          <span>
            <i className="fa fa-database" aria-hidden="true"></i>
          </span>
          <span className={dbListStyles.content}>{this.props.name}</span>
          <i className={"fa fa-trash " +  dbListStyles.removeIcon} aria-hidden="true" onClick={this.openModal.bind(this)}></i>
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
