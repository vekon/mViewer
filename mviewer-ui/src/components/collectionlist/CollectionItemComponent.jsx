import React from 'react'
import collectionListStyles from '../shared/listpanel.css'
import sharedStyles from '../shared/listpanel.css'
import $ from 'jquery'
import DeleteComponent from '../deletecomponent/DeleteComponent.jsx'

class CollectionItemComponent extends React.Component {

 constructor(props) {
   super(props);
   this.state = {
     hover_flag: false,
     modalIsOpen: false,
     _isMounted: false
   }
 }

 openModal() {
   this.setState({modalIsOpen: true});
   this.setState({message: ''});
 }

 closeModal(successMessage, fromDeleteButton) {
   if(this.state._isMounted == true){
     if(successMessage == true){
       if(fromDeleteButton == 'delete'){

          this.props.refreshCollectionListForDelete(this.props.dbName);
       }
       else {
          this.props.refreshCollectionList(this.props.dbName , false);
       }

     }
     this.setState({modalIsOpen: false});
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
      <div className={(this.props.isSelected ? collectionListStyles.menuItem +' ' +collectionListStyles.highlight :collectionListStyles.menuItem)} key={this.props.name} onClick={this.props.onClick} value={this.props.name} >
        <span className = {collectionListStyles.collectionIcon}>
          <i className="fa fa-folder-open-o" aria-hidden="true"></i>
        </span>
        <span className = {collectionListStyles.button}>{this.props.name}</span>
        <i className={"fa fa-trash "+ collectionListStyles.trash} aria-hidden="true" onClick = {this.openModal.bind(this)}></i>
        {this.state.modalIsOpen ? <DeleteComponent modalIsOpen={this.state.modalIsOpen} closeModal={this.closeModal.bind(this)} title = 'collection' dbName = {this.props.dbName} collectionName = {this.props.name} connectionId={this.props.connectionId} ></DeleteComponent> : null}
      </div>
    );
  }

}
CollectionItemComponent.getDefaultProps = {
  isSelected: false
}
CollectionItemComponent.propTypes = {
  onClick: React.PropTypes.func.isRequired,
  isSelected: React.PropTypes.bool
}

export default CollectionItemComponent;
