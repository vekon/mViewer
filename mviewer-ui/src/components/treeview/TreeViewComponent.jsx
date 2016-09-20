import React from 'react'
import treeViewStyles from './treeview.css'
import $ from 'jquery'
import TreeView from 'react-json-tree'
import DeleteComponent from '../deletecomponent/DeleteComponent.jsx'

class TreeViewComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      message: '',
      uId: ''
    }
  }
  openModal(id) {
    this.setState({modalIsOpen: true});
    this.setState({message: ''});
    this.setState({uId: id});
  }

  closeModal(successMessage) {
    this.setState({modalIsOpen: false});
    if (successMessage == true){
      this.props.refresh();
    }
  }

 render () {
   var items = this.props.collectionObjects.map(function (collection, i) {
     i++;
     const getItemString = (type, data, itemType, itemString) => (<span></span>);
     return(
     <div className={treeViewStyles.innerContainer +' '+ treeViewStyles.clearfix}>
       <span className={treeViewStyles.deleteButton}>
           <i className="fa fa-trash" aria-hidden="true" onClick={this.openModal.bind(this,collection._id)}></i>
       </span>
       <form method='DELETE'></form>
         <TreeView data={collection} shouldExpandNode={() => false } keyPath ={this.props.queryType == "collection" ? ['Document '+i] : ['File '+i]} key = {collection._id["counter"] || collection._id } getItemString={getItemString}/>
     </div>)
   }.bind(this));
   return (
     <div className={treeViewStyles.container}>
       <span className={treeViewStyles.headContainer}>
         <span className={treeViewStyles.key}>Key</span> <span className={treeViewStyles.value}>Value</span>
       </span>
       {this.state.modalIsOpen?<DeleteComponent modalIsOpen={this.state.modalIsOpen} closeModal={this.closeModal.bind(this)} title = {this.props.queryType == "collection" ? 'document' : 'file'} dbName = {this.props.currentDb} collectionName = {this.props.currentItem} connectionId={this.props.connectionId} uId= {this.state.uId} ></DeleteComponent> : ''}
       {items.length>0 ? items : <span className={treeViewStyles.exceptionContainer}>No Records to be displayed</span>}
     </div>
   );
 }
}

export default TreeViewComponent;
