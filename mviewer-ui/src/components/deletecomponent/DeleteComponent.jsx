import React from 'react'
import deleteStyles from './delete.css'
import $ from 'jquery'
import Modal from 'react-modal'
import Config from '../../../config.json';

class DeleteComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      message:'',
      successMessage: false
    }
  }

  closeModal() {
    this.props.closeModal(this.state.successMessage);
  }

  clickHandlerYes(){
    var that = this;
    var type = this.props.title;
    var obj={};
    var deleteUrl ='';
    if(type === 'database'){
      deleteUrl = Config.host+Config.service_path+'/services/db/'+this.props.dbName+'?connectionId='+this.props.connectionId;
    }
    if(type === 'collection'){
      deleteUrl = Config.host+Config.service_path+'/services/'+this.props.dbName+'/collection/'+this.props.collectionName+'?connectionId='+this.props.connectionId;
    }
    if(type== 'document'){
      deleteUrl = Config.host+Config.service_path+'/services/'+this.props.dbName+'/'+this.props.collectionName+'/document?connectionId='+this.props.connectionId;
        obj["_id"] = this.props.uId;
    }
    if(type === 'GridFS Bucket'){
      deleteUrl = Config.host+Config.service_path+'/services/'+this.props.dbName+'/gridfs/'+this.props.gridFSName+'/dropbucket?connectionId='+this.props.connectionId;
    }
    if(type === 'file'){
      deleteUrl = Config.host+Config.service_path+'/services/'+this.props.dbName+'/gridfs/'+this.props.collectionName+'/dropfile?id=' + this.props.uId+ '&connectionId='+this.props.connectionId;
    }
    $.ajax({
      type: "DELETE",
      cache: false,
      dataType: 'json',
      contentType: 'application/x-www-form-urlencoded',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      data:obj,
      crossDomain: false,
      url: deleteUrl,
      success: function(data) {
        if (data.response.result) {
          that.setState({successMessage:true});
          that.setState({message:that.props.title+' has been deleted.'});
        }
        if (data.response.error) {
          if (data.response.error){
            that.setState({successMessage:false});
            that.setState({message:'Error in deleteing the '+that.props.title});
          }
        }
        setTimeout(function() { that.closeModal() }.bind(this), 3000);
      }, error: function(jqXHR, exception) {

    }
  });

  }

  clickHandlerNo(){
    this.props.closeModal();
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
        transform             : 'translate(-50%, -50%)',
        zIndex                :  '4'
      }
    };

    return(
      <Modal
        isOpen={this.props.modalIsOpen}
        onRequestClose={this.closeModal.bind(this)}
        style = {customStyles}>
        <div className={deleteStyles.two}>
          <label>Are you sure to delete the {this.props.title} ?</label>
            <span className={deleteStyles.closeSpan} onClick= {this.closeModal.bind(this)}><i className="fa fa-times" aria-hidden="true"></i></span>
           <div className={!this.state.successMessage? (deleteStyles.errorMessage + ' ' + (this.state.message!='' ? deleteStyles.show : deleteStyles.hidden)) : (this.state.message != '' ? deleteStyles.successMessage : '')}>{this.state.message}</div>
             <div className ={!this.state.successMessage ? (deleteStyles.choiceContainer + ' ' +deleteStyles.showChoice) : (deleteStyles.choiceContainer + ' ' +deleteStyles.hideChoice)}>
               <button onClick={this.clickHandlerNo.bind(this)} value='No' className={deleteStyles.submit} >No</button>
               <button onClick={this.clickHandlerYes.bind(this)} value='Yes' className={deleteStyles.submit} >Yes</button>
             </div>
        </div>
      </Modal>
    );
  }
}

export default DeleteComponent;
