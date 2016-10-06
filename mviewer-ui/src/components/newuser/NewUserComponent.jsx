import React from 'react'
import newUserStyles from './newuser.css'
import $ from 'jquery'
import Modal from 'react-modal'
import { Form } from 'formsy-react'
import TextInput from '../TextInput/TextInputComponent.jsx'
import service from '../../gateway/service.js'

class NewUserComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      addUser_readonly: false,
      autoIndex: true,
      addUser_password: null,
      addUser_user_name: null,
      canSubmit:false,
      title:'',
      submitted:false,
      message:'',
      successMessage: false,
      _isMounted: false,
      newUser: null,
      error: false
    }
  }

  openModal() {
    this.setState({modalIsOpen: true});
    this.setState({message: ''});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
    this.setState({error: false});
    this.setState({addUser_readonly: false});
    if(this.state.successMessage==true)
    {
      this.props.refreshCollectionList(this.props.currentDb);
      this.props.refreshRespectiveData(this.state.newUser);
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
    return true;
  }

  handleCheck(){
    this.setState({addUser_readonly:!this.state.addUser_readonly});
  }

  clickHandler(){
    var that =this;
    var data = $("form").serialize().split("&");
    var obj={};
    for(var key in data)
    {
      obj[data[key].split("=")[0]] = data[key].split("=")[1];
    }
    obj['addUser_readonly'] =  this.state.addUser_readonly;
    if ((obj['addUser_user_name']!= '' && obj['addUser_user_name']!= null)
         && (obj['addUser_password']!= '' && obj['addUser_password']!=null)){
      this.setState({submitted:true});
    } else {
      this.setState({error:true});
    }


    var partialUrl = this.props.currentDb+'/usersIndexes/addUser?connectionId='+this.props.connectionId;
    var addUserCall = service('POST', partialUrl, obj);
    addUserCall.then(this.success.bind(this, 'clickHandler', obj), this.failure.bind(this, 'clickHandler', obj));
  }

  componentDidMount(){
    this.state._isMounted =  true;
    this.setState({title:'Add User'});
  }

  componentWillUnmount(){
    this.state._isMounted =  false;
  }

  componentWillReceiveProps(nextProps){
    this.setState({title:'Add User'});
  }

  success(calledFrom, obj,  data) {
    if (calledFrom == 'clickHandler'){
      if (data.response.result) {
        this.setState({message:'User '+obj['addUser_user_name']+ ' was successfully added to database ' + this.props.currentDb});
        this.state.newUser = obj['addUser_user_name'];
        this.setState({successMessage:true});
        setTimeout(function() { this.closeModal() }.bind(this), 2000);
      }
      if (data.response.error) {
        if (data.response.error.code === 'USER_CREATION_EXCEPTION'){
          this.setState({successMessage:false});
          this.setState({message:'User '+obj['addUser_user_name']+ ' already exists in database ' + this.props.currentDb});
        }
      }
    }
  }

  failure() {

  }


  render () {
    const customStyles = {
      content : {
        top                   : '50%',
        left                  : '50%',
        border                : 'none',
        borderRadius          : '4px',
        right                 : 'auto',
        width                 : '25%',
        bottom                : 'auto',
        marginRight           : '-50%',
        padding               : '0px',
        transform             : 'translate(-50%, -50%)'
      },
      overlay : {
        backgroundColor       : 'rgba(0,0,0, 0.74902)'
      }
    };

    return(
      <div className={newUserStyles.modalContainer}>
        <span onClick= {this.openModal.bind(this)} ><i className="fa fa-plus-circle" aria-hidden="true"></i> Add User</span>
       <Modal
         isOpen={this.state.modalIsOpen}
         onRequestClose={this.closeModal.bind(this)}
         style = {customStyles}>
         <div className={newUserStyles.two}>
           <div className={newUserStyles.header}>
             <span className={newUserStyles.text}>{this.state.title}</span>
           </div>
           <Form method='POST' onValid={this.enableButton()} onInvalid={this.disableButton()} >
             <div className={ newUserStyles.formContainer}>
               <div className={newUserStyles.name}>
                 <TextInput type="text" name="addUser_user_name" id="addUser_user_name" placeholder="User Name" value={this.state.addUser_user_name} onChange={this.handleChange.bind(this)} validationErrors={{isRequired2: 'User name must not be empty'}} validations={'isRequired2:'+this.state.error}/>
               </div>
               <div className={newUserStyles.userPassword}>
                 <TextInput type="password" name="addUser_password" id="addUser_password" placeholder="Password" value={this.state.name} onChange={this.handleChange.bind(this)} validationErrors={{isRequired2: 'Password must not be empty'}} validations={'isRequired2:'+this.state.error}/>
               </div>
               <div className={newUserStyles.inputBox}>
                 <input type="checkbox" className={newUserStyles.checkboxClass} name="addUser_readonly" id="addUser_readonly"  onChange={this.handleCheck.bind(this)} checked={this.state.addUser_readonly}  />
                 <div className={newUserStyles.checkLabel}><span>ReadOnly</span></div>
               </div>
               <div className={newUserStyles.buttonContainer}>
                 <span onClick={this.closeModal.bind(this)} className={ newUserStyles.cancel }>CANCEL</span>
                 <button onClick={this.clickHandler.bind(this)} value='SUBMIT' className={newUserStyles.submit} disabled={!this.state.canSubmit}>SUBMIT</button>
               </div>
             </div>
           </Form>
            <div className={!this.state.successMessage? (newUserStyles.errorMessage + ' ' + (this.state.message!='' ? newUserStyles.show : newUserStyles.hidden)) : (this.state.message != '' ? newUserStyles.successMessage : '')}>{this.state.message}</div>
         </div>
       </Modal>
     </div>
    );
  }
}

export default NewUserComponent;
