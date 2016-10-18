import React from 'react'
import newCollectionStyles from './newcollection.css'
import $ from 'jquery'
import Modal from 'react-modal'
import { Form } from 'formsy-react'
import TextInput from '../TextInput/TextInputComponent.jsx'
import service from '../../gateway/service.js'

class newCollectionComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      cap: false,
      autoIndex: true,
      name: null,
      size: '',
      max:'',
      canSubmit:false,
      canSubmit1:true,
      title:'',
      submitted:false,
      message:'',
      successMessage: false,
      _isMounted: false,
      error:false,
      newCollection: this.props.currentItem
    }
  }

  openModal() {
    if (this.props.addOrUpdate == '2'){
      this.getCappedData.call(this);
    }
    this.setState({modalIsOpen: true});
    this.setState({message: ''});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
    if(this.state.successMessage==true)
    {
      this.props.refreshCollectionList(this.props.currentDb);
      this.props.refreshRespectiveData(this.state.newCollection);
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
    this.setState({cap:!this.state.cap});
  }

  handleIndex(){
    this.setState({autoIndex:!this.state.autoIndex});
  }

  clickHandler(){
    this.setState({error:true});
    var methodType = 'POST';
    var that =this;
    var data = $("form").serialize().split("&");
    var obj={};
    this.setState({error : true});
    for(var key in data)
    {
      obj[data[key].split("=")[0]] = data[key].split("=")[1];
    }
    if (obj['capSize']!= '' && obj['size']!=null){
      this.setState({submitted:true});
    }

    if(this.props.addOrUpdate == 2){
      methodType ='PUT';
    }
    else {
      this.setState({ newCollection: obj['newCollName']});
    }
    if(obj['newCollName'] !=  '') {
      var partialUrl = this.props.currentDb+'/collection/'+(this.props.addOrUpdate == 2 ? this.state.name :obj['newCollName'])+'?connectionId='+this.props.connectionId;
      var updateCollectionCall = service(methodType, partialUrl, obj);
      updateCollectionCall.then(this.success.bind(this, 'clickHandler', obj), this.failure.bind(this, 'clickHandler', obj));
    }
}
  componentDidMount(){
    this.state._isMounted =  true;
    if(this.props.addOrUpdate == 2){
      this.setState({name :this.props.currentItem});
      this.setState({title:'Update Collection'});
    }
    else {
      this.setState({title:'Add Collection'});
      this.setState({cap: false});
    }
  }

  componentWillUnmount(){
    this.state._isMounted =  false;
  }

  componentWillReceiveProps(nextProps){
    this.setState({error:false});
    if(nextProps.addOrUpdate == 2 ){
      this.setState({name :nextProps.currentItem});
      // this.getCappedData.call(this);
      this.setState({title:'Update Collection'});
      this.setState({successMessage:false});
    }
    else {
      this.setState({title:'Add Collection'});
      this.setState({cap: false});
    }
  }


  getCappedData(){
    var partialUrl = this.props.currentDb +'/collection/'+this.state.name+'/isCapped?connectionId=' + this.props.connectionId;
    var getCappedDataCall = service('GET', partialUrl, '');
    getCappedDataCall.then(this.success.bind(this, 'getCappedData', ''), this.failure.bind(this, 'getCappedData', ''));
  }

  success(calledFrom, obj,  data) {
    if (calledFrom == 'clickHandler'){
      if (data.response.result) {
        if(this.props.addOrUpdate == 2){
          var successResult = data.response.result.replace(/[\[\]']/g,'' );
          this.setState({message:successResult});
          this.state.newCollection = obj['newCollName'];
        }
        else {
          this.setState({message:'Collection '+obj['newCollName']+ ' was successfully added to database ' + this.props.currentDb});
          this.state.newCollection = obj['newCollName'];
        }
        this.setState({successMessage:true});
        setTimeout(function() { this.closeModal() }.bind(this), 2000);
      }
      if (data.response.error) {
        if (data.response.error.code === 'COLLECTION_ALREADY_EXISTS'){
          this.setState({successMessage:false});
          this.setState({message:'Collection '+obj['newCollName']+ ' already exists in database ' + this.props.currentDb});
        }
      }
    }

    if (calledFrom == 'getCappedData'){
      if(this.state._isMounted == true){
        if(typeof(data.response) != 'undefined'){
          this.setState({cap:data.response.result});
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
      <div className={this.props.addOrUpdate=='1'? newCollectionStyles.modalContainer : newCollectionStyles.updateModalContainer}>
        {this.props.addOrUpdate=='1'? <span onClick= {this.openModal.bind(this)} ><i className="fa fa-plus-circle" aria-hidden="true"></i> Add Collection</span> : <span className={newCollectionStyles.updateButton} onClick={this.openModal.bind(this)}><i className="fa fa-pencil" aria-hidden="true"></i>Update Collection</span>}
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal.bind(this)}
          style = {customStyles}>
          <div className={newCollectionStyles.two}>
            <div className={newCollectionStyles.header}>
              <span className={newCollectionStyles.text}>{this.state.title}</span>
            </div>
            <Form method='POST' onValid={this.enableButton()} onInvalid={this.disableButton()} >
              <div className={ newCollectionStyles.formContainer}>
                <div className={newCollectionStyles.inputBox}>

                  <TextInput type="text" name="newCollName" id="newCollName" placeholder="Collection name" value={this.state.name} onChange = {this.handleChange.bind(this)} validations={'isRequired2:'+this.state.error+',isAlpha1:'+this.state.error+',maxLength:120'} onChange={this.handleChange.bind(this)} validationErrors={{isRequired2: 'Collection name must not be empty', isAlpha1: 'Invalid Collection name', maxLength: 'Collection name cannot be more than 120 characters' }}  />
                </div>
                <div className={newCollectionStyles.inputBox}>
                  <input type="checkbox" name="isCapped" id="isCapped" className={newCollectionStyles.checkBox} onChange={this.handleCheck.bind(this)} checked={this.state.cap}  />
                  <div className={newCollectionStyles.checkLabel}><span>Capped</span></div>
                </div>
                <div className={newCollectionStyles.inputBox}>
                  <TextInput type="text" name="capSize" id="capSize" placeholder="size (bytes)" value={this.state.size} onChange={this.handleChange.bind(this)} validations={'isRequired1:'+this.state.cap+',isNumeric1:'+this.state.cap} checkforOtherErrors ={this.state.submitted} validationErrors={{isNumeric1: 'Please enter the size in numeric', isRequired1: 'Please enter the size'}} shouldBeDisabled = {!this.state.cap}  />
                </div>
                <div className={newCollectionStyles.inputBox}>
                  <TextInput type="text" name="maxDocs" id="maxDocs" placeholder="max Documents (optional)" value={this.state.max} onChange={this.handleChange.bind(this)} shouldBeDisabled = {!this.state.cap}  validationErrors={{isNumeric1: 'Please enter the size in numeric'}} checkforOtherErrors ={this.state.submitted} validations={'isNumeric1:' + this.state.cap}/>
                </div>
                <div className={newCollectionStyles.inputBox}>
                  <input type="checkbox" name="autoIndexId" id="autoIndexId"  className={newCollectionStyles.checkBox} checked={this.state.autoIndex} onChange={this.handleIndex.bind(this)} checked={this.state.autoIndex} disabled={!this.state.cap} />
                  <div className={newCollectionStyles.checkLabel}><span>Auto Indent</span></div>
                </div>
                <div >
                  <button onClick={this.clickHandler.bind(this)} value='SUBMIT' className={newCollectionStyles.submit} disabled={!this.state.canSubmit}>SUBMIT</button>
                  <span onClick={this.closeModal.bind(this)} value='CANCEL' className={newCollectionStyles.cancel}>CANCEL</span>
                </div>
              </div>
            </Form>
             <div className={!this.state.successMessage? (newCollectionStyles.errorMessage + ' ' + (this.state.message!='' ? newCollectionStyles.show : newCollectionStyles.hidden)) : (this.state.message != '' ? newCollectionStyles.successMessage : '')}>{this.state.message}</div>
          </div>
        </Modal>
     </div>
    );
  }
}

export default newCollectionComponent;
