import React from 'react'
import newCollectionStyles from './newcollection.css'
import $ from 'jquery'
import Modal from 'react-modal'
import { Form } from 'formsy-react';
import TextInput from '../TextInput/TextInputComponent.jsx';
import Config from '../../../config.json';

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
      title:'',
      submitted:false,
      message:'',
      successMessage: false,
      newCollection: this.props.currentItem
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
      window.location.hash = '#/dashboard/collections?connectionId='+this.props.connectionId+'&db='+this.props.currentDb+'&collection='+this.state.newCollection + '&queryType="collection"';
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
    var methodType = 'POST';
    var that =this;
    var data = $("form").serialize().split("&");
    var obj={};
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

    $.ajax({
      type: methodType,
      cache: false,
      dataType: 'json',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      crossDomain: false,
      url: Config.host+'/mViewer-0.9.2/services/'+this.props.currentDb+'/collection/'+this.state.newCollection+'?connectionId='+this.props.connectionId,
      data : obj,
      success: function(data) {
        if (data.response.result) {
          if(that.props.addOrUpdate == 2){
            var successResult = data.response.result.replace(/[\[\]']/g,'' );
            that.setState({message:successResult});
          }
          else {
            that.setState({message:'Collection '+obj['newCollName']+ ' was successfully added to database ' + that.props.currentDb});
          }
          // console.log(data);
          that.setState({successMessage:true});
          that.setState({newCollection:obj['newCollName']});

        }
        if (data.response.error) {
          console.log(data);
          if (data.response.error.code === 'COLLECTION_ALREADY_EXISTS'){
            that.setState({successMessage:false});
            that.setState({message:'Collection '+obj['newCollName']+ ' already exists in database ' + that.props.currentDb});
          }
        }
      }, error: function(jqXHR, exception) {

    }
   });
  }

  componentDidMount(){
    if(this.props.addOrUpdate == 2){
      this.setState({name :this.props.currentItem});
      this.getCappedData.call(this);
      this.setState({title:'Update Collection'});
    }
    else {
      this.setState({title:'Add Collection'});
    }
  }

  getCappedData(){
    var that =this;
    $.ajax({
      type: "GET",
      dataType: 'json',
      credentials: 'same-origin',
      crossDomain: false,
      url : Config.host+'/mViewer-0.9.2/services/'+ this.props.currentDb +'/collection/'+this.props.currentItem+'/isCapped?connectionId=' + this.props.connectionId,
      success: function(data) {
          that.setState({cap:data.response.result});
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
       <button onClick={this.openModal.bind(this)}>Update collection</button>
       <Modal
         isOpen={this.state.modalIsOpen}
         onRequestClose={this.closeModal.bind(this)}
         style = {customStyles}>
         <div className={newCollectionStyles.two}>
           <h3>{this.state.title}</h3>
           <Form method='POST' onValid={this.enableButton()} onInvalid={this.disableButton()} >
             <div className={ newCollectionStyles.formContainer}>
               <div className={newCollectionStyles.inputBox}>
                 <TextInput type="text" name="newCollName" id="newCollName" placeholder="collection name" value={this.state.name} validations='isRequired' onChange={this.handleChange.bind(this)} validationError="Collection name must not be empty" />
               </div>
               <div className={newCollectionStyles.inputBox}>
                 <label>Capped:</label>
                 <input type="checkbox" name="isCapped" id="isCapped"  onChange={this.handleCheck.bind(this)} checked={this.state.cap}  />
               </div>
               <div className={newCollectionStyles.inputBox}>
                 <TextInput type="text" name="capSize" id="capSize" placeholder="size (bytes)" value={this.state.size} onChange={this.handleChange.bind(this)} validations={'isRequired1:'+this.state.cap+',isNumeric1:'+this.state.cap} checkforOtherErrors ={this.state.submitted} validationErrors={{isNumeric1: 'Please enter the size in numeric', isRequired1: 'Please enter the size'}} shouldBeDisabled = {!this.state.cap}  />
               </div>
               <div className={newCollectionStyles.inputBox}>
                 <TextInput type="text" name="maxDocs" id="maxDocs" placeholder="max Documents (optional)" value={this.state.max} onChange={this.handleChange.bind(this)} shouldBeDisabled = {!this.state.cap}  />
               </div>
               <div className={newCollectionStyles.inputBox}>
                 <label>Auto Indent:</label>
                 <input type="checkbox" name="autoIndexId" id="autoIndexId"  checked={this.state.autoIndex} onChange={this.handleIndex.bind(this)} checked={this.state.autoIndex} disabled={!this.state.cap} />
               </div>
               <div>
                 <button onClick={this.clickHandler.bind(this)} value='SUBMIT' className={newCollectionStyles.submit} disabled={!this.state.canSubmit}>SUBMIT</button>
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
