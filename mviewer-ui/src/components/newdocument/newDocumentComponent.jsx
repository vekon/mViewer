import React from 'react'
import newDocumentStyles from './newdocument.css'
import $ from 'jquery'
import Modal from 'react-modal'
import { Form } from 'formsy-react';
import TextInput from '../TextInput/TextInputComponent.jsx';
import Config from '../../../config.json';

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
  }

  closeModal() {
    this.setState({modalIsOpen: false});
    if(this.state.successMessage==true)
    {
      this.props.refreshDocuments();
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

    for(var key in data)
    {
      obj[data[key].split("=")[0]] = unescape(data[key].split("=")[1]);
    }
    $.ajax({
      type: "POST",
      cache: false,
      dataType: 'json',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      crossDomain: false,
      url: Config.host+'/mViewer-0.9.2/services/'+this.props.currentDb+'/'+this.props.currentItem+'/document?connectionId='+this.props.connectionId,
      data : obj,
      success: function(data) {
        if (data.response.result) {
          that.setState({successMessage:true});
          that.setState({message:'Document was successfully added to collection ' + that.props.currentItem});
        }
        if (data.response.error) {
          if (data.response.error){
            that.setState({successMessage:false});
            that.setState({message:'Inavlid JSON object'});
          }
        }
      }, error: function(jqXHR, exception) {

    }
  });

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
      <div>
       <span className={newDocumentStyles.addButton} onClick= {this.openModal.bind(this)} ><i className="fa fa-plus-circle" aria-hidden="true"></i> Add Document</span>
       <Modal
         isOpen={this.state.modalIsOpen}
         onRequestClose={this.closeModal.bind(this)}
         style = {customStyles}>
         <div className={newDocumentStyles.two}>
           <h3>Add Document</h3>
            <form>
              <label>Enter JSON data</label>
              <textarea value ={this.state.newDocument} name='document' id='document' onChange={this.handleChange('newDocument')}></textarea>
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
