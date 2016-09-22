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

 closeModal() {
   if(this.state._isMounted == true){

   }

   this.props.refreshCollectionList();
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
        <span>
          <i className="fa fa-folder-open-o" aria-hidden="true"></i>
        </span>
        <button>{this.props.name}</button>
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
