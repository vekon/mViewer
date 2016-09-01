import React from 'react'
import treeViewStyles from './treeview.css'
import $ from 'jquery'
import TreeView from 'react-json-tree'

class TreeViewComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

 render () {
   var items = this.props.collectionObjects.map(function (collection, i) {
     i++;
     const getItemString = (type, data, itemType, itemString) => (<span></span>);
     return <div className={treeViewStyles.innerContainer +' '+ treeViewStyles.clearfix}><span className={treeViewStyles.deleteButton}><button><i className="fa fa-remove" aria-hidden="true"></i></button></span><TreeView data={collection} shouldExpandNode={() => false } keyPath ={['Document '+i]} key = {collection._id["counter"] || collection._id } getItemString={getItemString}/> </div>
   }.bind(this));
   return (
     <div className={treeViewStyles.container}>
       <span className={treeViewStyles.headContainer}>
         <span className={treeViewStyles.key}>Key</span> <span className={treeViewStyles.value}>Value</span>
       </span>
       {items}
     </div>
   );
 }
}

export default TreeViewComponent;
