import React from 'react'
import newDocumentStyles from './newdocument.css'
import $ from 'jquery'
import Modal from 'react-modal'
import { Form } from 'formsy-react';
import TextInput from '../TextInput/TextInputComponent.jsx';
import service from '../../gateway/service.js'

class newDocumentComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      message:'',
      successMessage: false,
      newDocument: '{}'
    }
  }

  openModal() {
    this.setState({modalIsOpen: true});
    this.setState({message: ''});
    if(this.props.addOrEdit == 'Edit'){
      this.setState({newDocument: this.props.documentValue});
    }
  }

  closeModal() {
    this.setState({modalIsOpen: false});
    this.setState({newDocument: "{}"});
    if(this.state.successMessage==true)
    {
      this.props.refresh();
    }
  }

  handleChange(key){
    return function(e) {
      var state = {};
      state[key] = e.target.value;
      this.setState(state);
    }.bind(this);
  }

  clickHandler(){
    var that =this;
    var data = $("form").serialize().split("&");
    var obj={};
    if(this.props.addOrEdit == 'Edit'){
      obj['_id'] = this.props.uId;
    }
    for(var key in data)
    {
      obj[data[key].split("=")[0]] = unescape(data[key].split("=")[1]);
    }

    var partialUrl = this.props.currentDb+'/'+this.props.currentItem+'/document?connectionId='+this.props.connectionId;
    var newDocumentCall = service((this.props.addOrEdit != 'Edit'? 'POST' : 'PUT'), partialUrl, obj);
    newDocumentCall.then(this.success.bind(this), this.failure.bind(this));

  }

  success(data){
    if (data.response.result) {
      this.setState({successMessage:true});
      if (this.props.addOrEdit != 'Edit')
      {
        this.setState({message:'Document was successfully added to collection ' + this.props.currentItem});
      }
      else {
        this.setState({message:'Document was successfully Updated'});
      }
      setTimeout(function() { this.closeModal() }.bind(this), 3000);
    }
    if (data.response.error) {
      if (data.response.error){
        this.setState({successMessage:false});
        this.setState({message:'Inavlid JSON object'});
      }
    }
  }

  failure(data){

  }

  render () {
    const customStyles = {
      content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        width                 : '25%',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
      }
    };

    return(
      <div className = {newDocumentStyles.mainContainer}>
       <span className={this.props.addOrEdit != 'Edit' ?newDocumentStyles.addButton : newDocumentStyles.editButton} onClick= {this.openModal.bind(this)} >{this.props.addOrEdit != 'Edit' ? (<i className="fa fa-plus-circle" aria-hidden="true"></i> ) : (<i className="fa fa-pencil" aria-hidden="true"></i> )}  {this.props.addOrEdit!='Edit' ? <span>Add Document</span> : null} </span>
       <Modal
         isOpen={this.state.modalIsOpen}
         onRequestClose={this.closeModal.bind(this)}
         style = {customStyles}>
         <div className={newDocumentStyles.two}>
           {this.props.addOrEdit !='Edit' ? <h3>Add Document</h3> : <h3>Edit Document</h3>}
            <span className={newDocumentStyles.closeSpan} onClick= {this.closeModal.bind(this)}><i className="fa fa-times" aria-hidden="true"></i></span>
            <form>
              {this.props.addOrEdit !='Edit' ? <label>Enter JSON data</label> : <label>Edit JSON data</label>}
              <textarea value ={this.state.newDocument} name={this.props.addOrEdit != 'Edit' ? 'document' : 'keys'} id='document' onChange={this.handleChange('newDocument')}></textarea>
            </form>
            <div className={newDocumentStyles.buttonContainer}>
                <button onClick={this.clickHandler.bind(this)} value='SUBMIT' className={newDocumentStyles.submit}>SUBMIT</button>
              </div>
            <div className={!this.state.successMessage? (newDocumentStyles.errorMessage + ' ' + (this.state.message!='' ? newDocumentStyles.show : newDocumentStyles.hidden)) : (this.state.message != '' ? newDocumentStyles.successMessage : '')}>{this.state.message}</div>
         </div>
       </Modal>
     </div>
    );
  }
}

export default newDocumentComponent;
