import React from 'react'
import createDbStyles from './createdb.css'
import $ from 'jquery'
import Modal from 'react-modal'
import { Form } from 'formsy-react';
import TextInput from '../TextInput/TextInputComponent.jsx';
import Config from '../../../config.json'

class CreateDbComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      name: null,
      canSubmit:false,
      message:'',
      successMessage: false,
      error:false
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
      window.location.hash = '#/dashboard/home?connectionId='+this.props.fromHome.connectionId;
    }
  }

  enableButton() {
    return function() {
      this.setState({
        canSubmit: true
      });
    }.bind(this);
  }

  disableButton() {
    return function() {
      this.setState({
        canSubmit: false
      });
    }.bind(this);
  }

  handleChange(key){
   this.setState({successMessage:false});
   this.setState({message:''});
  }


  clickHandler(){
    var that =this;
    var data = $("form").serialize().split("&");
    var obj={};
    for(var key in data)
    {
      obj[data[key].split("=")[0]] = data[key].split("=")[1];
    }
    if (obj['name']!=''){
      $.ajax({
        type: 'POST',
        cache: false,
        dataType: 'json',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        crossDomain: false,
        url: Config.host+'/mViewer-0.9.2/services/db/'+obj['name']+'?connectionId='+this.props.fromHome.connectionId,
        data : obj,
        success: function(data) {
          if (data.response.result) {
            that.setState({message:'Database '+obj['name']+ ' was successfully created'});
            that.setState({successMessage:true});
            that.props.refreshDb();
          }
          if (data.response.error) {
            that.setState({successMessage:false});
            that.setState({message:'Database '+obj['name']+ ' already exists'});
          }
        }, error: function(jqXHR, exception) {
      }
     });
    }
    else{
      this.setState({error : true})
    }
  }

  render () {
    const customStyles = {
      content : {
        top                   : '50%',
        left                  : '53%',
        right                 : 'auto',
        width                 : '25%',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
      }
    };
    return(
      <div className={createDbStyles.mainContainer}>
        <div className = {createDbStyles.topContainer}>
          <section className={createDbStyles.topSection}>Welcome to <span className={createDbStyles.span1}>m</span><span className={createDbStyles.span2}>Viewer</span></section>
          <section className={createDbStyles.midSection}><hr />A MONOGO DB MANAGEMENT TOOL<hr /></section>
          <section className={createDbStyles.bottomSection}>LET'S GET STARTED</section>
        </div>
        <div className = {createDbStyles.bottomContainer}>
          <button className={createDbStyles.createButton} onClick={this.openModal.bind(this)}>Create New Database</button>
          <section className = {createDbStyles.logoSection}>
            <span>POWERED BY</span>
            <img src={'../../assets/Pramati_Logo.png'} className={createDbStyles.logo}></img>
          </section>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal.bind(this)}
          style = {customStyles}>
          <div className={createDbStyles.two}>
            <h3>Create Database</h3>
            <Form method='POST' onValid={this.enableButton()} onInvalid={this.disableButton()} >
              <div className={ createDbStyles.formContainer}>
                <div className={createDbStyles.inputBox}>
                  <TextInput type="text" name="name" id="name" placeholder="Database name" value={this.state.name} onChange = {this.handleChange.bind(this)} validations={'isRequired2:'+this.state.error+',isAlpha1:'+this.state.error} onChange={this.handleChange.bind(this)} validationErrors={{isRequired2: 'Db name must not be empty', isAlpha1: 'Invalid Db name' }}  />
                </div>
                <div>
                  <button onClick={this.clickHandler.bind(this)} value='SUBMIT' className={createDbStyles.submit} disabled={!this.state.canSubmit}>SUBMIT</button>
                </div>
              </div>
            </Form>
             <div className={!this.state.successMessage? (createDbStyles.errorMessage + ' ' + (this.state.message!='' ? createDbStyles.show : createDbStyles.hidden)) : (this.state.message != '' ? createDbStyles.successMessage : '')}>{this.state.message}</div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default CreateDbComponent;
