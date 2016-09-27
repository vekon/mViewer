import React from 'react'
import documentStyles from './document.css'
import $ from 'jquery'
import Modal from 'react-modal'
import Config from '../../../config.json'
import DeleteComponent from '../deletecomponent/DeleteComponent.jsx'
import NewDocument from '../newdocument/newDocumentComponent.jsx'
import autosize from 'autosize'

class DocumentComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      message:'',
      successMessage: false,
      value:this.props.value,
      disabled: true,
      _isMounted: false
    }
  }

  openModal() {
    this.setState({modalIsOpen: true});
    this.setState({message: ''});
  }

  editHandler(){
    this.setState({disabled:false});
  }

  changeHandler(){
    return function(e) {
      this.setState({value:e.target.value});
    }.bind(this);

  }

  componentWillReceiveProps(){
    this.setState({value: this.props.value});
  }

  closeModal(successMessage) {
    if(this.state._isMounted == true){
      this.setState({modalIsOpen: false});
      if (successMessage == true){
        this.props.refresh('delete');
      }
    }
  }

  componentDidMount(){
    this.state._isMounted = true;
  }

  componentWillUnmount(){
    autosize($('.textArea'));
    this.state._isMounted = false;
  }
  render () {
    autosize($('.textArea'));
    return(
      <div className={documentStyles.results+' '+ documentStyles.clearfix}>
        { this.props.queryType == "collection" ?
          <NewDocument currentDb={this.props.currentDb} currentItem={this.props.currentItem} addOrEdit='Edit' connectionId={this.props.connectionId} documentValue = {this.state.value} uId = {this.props.uId} refresh = {this.props.refresh}></NewDocument>
          : null }
        <form>
          <span className={documentStyles.deleteButton} ><i className="fa fa-trash" aria-hidden="true" onClick={this.openModal.bind(this)}></i></span>
          <textarea key={this.props.key1} className ='textArea' value={this.state.value} onChange={this.changeHandler()} disabled={this.state.disabled}></textarea>
          {this.state.modalIsOpen?<DeleteComponent modalIsOpen={this.state.modalIsOpen} closeModal={this.closeModal.bind(this)} title = {this.props.queryType == "collection" ? 'document' : 'file'} dbName = {this.props.currentDb} collectionName = {this.props.currentItem} connectionId={this.props.connectionId} uId= {this.props.uId} ></DeleteComponent> : ''}
        </form>
      </div>
    );
  }
}

export default DocumentComponent;
