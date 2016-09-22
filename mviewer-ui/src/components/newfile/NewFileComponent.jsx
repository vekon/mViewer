import React from 'react'
import newFileStyles from './newfile.css'
import $ from 'jquery'
import Modal from 'react-modal'
import { Form } from 'formsy-react';
import TextInput from '../TextInput/TextInputComponent.jsx'
import FileInput from 'react-file-input';
import sharedStyles from '../shared/listpanel.css'
import progress from '../shared/jquery.ajax-progress.jsx'
import Line from 'rc-progress/lib/Line.js'
import 'rc-progress/assets/index.less'
import service from '../../gateway/service.js'

class newFileComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      name: null,
      canSubmit:false,
      title:'',
      submitted:false,
      message:'',
      successMessage: false,
      newFile: [],
      uploadClick: false,
      count: 0
    }
  }

  openModal() {
    this.setState({modalIsOpen: true});
    this.setState({message: ''});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
    this.setState({newFile: []});
    this.setState({uploadClick: false});
    this.setState({count: 0});
    if(this.state.successMessage==true)
    {
      this.props.refresh('new');
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

  handleChanged(event){
    var newArray = this.state.newFile.slice();
    newArray.push(event.target.files[0]);
    this.setState({newFile : newArray});
  }

  fileUpload(data) {
    var that = this;
    var fd = new FormData();
    fd.append( 'files', data );
    var partialUrl = this.props.currentDb+'/gridfs/'+this.props.currentItem+'/uploadfile?connectionId='+this.props.connectionId;
    var newFileCall = service('POST', partialUrl, fd, 'fileUpload' , data);
    newFileCall.then(this.success.bind(this), this.failure.bind(this));
  }

  success(data) {
    if (data.response && data.response.error) {
      if (data.response.error.code === 'ANY_OTHER_EXCEPTION'){
        this.setState({successMessage:false});
        this.setState({count : 0 })
        this.setState({message: "File cannot be added some error."});
      }
    } else {
      this.setState({count : this.state.count +1 })
    }
    if(this.state.count == this.state.newFile.length) {
      this.setState({successMessage:true});
      setTimeout(function() { this.setState({message: "File(s) successfully added to bucket " + this.props.currentItem})}.bind(this), 1000);
      setTimeout(function() { this.closeModal() }.bind(this), 3000);
    }
  }

  failure() {

  }

  uploadHandle(){
    this.setState({uploadClick: true});
    var that = this;
    this.state.newFile.map(function(item){
      item.percent = 0;
      that.fileUpload(item);
    });
  }

  componentDidMount(){
    this.setState({name :this.props.currentItem});
    this.setState({title:'File Upload'});
  }

  componentDidUpdate() {
    $("input[name='myfile_filename']").value = "";
  }

  completeLoading() {
    this.setState({completeLoading: true});
  }

  startLoading() {
    this.setState({startLoading: true});
  }

  resetLoading() {

  }

  render () {
    var that = this;
    var selectedFiles = null;
    var count = 0;
    var selectedFiles = Object.keys(that.state.newFile).map(function (item, idx) {
      ++count
      var sizeKB = Math.round((that.state.newFile[item].size / 1024) * 100 ) / 100 ;
      return <div key={item} className={newFileStyles.eachFile}>
              <span className={newFileStyles.name}>{this.state.newFile[item].name}</span>
              <span>({sizeKB}Kb) </span>
              <span id={this.state.newFile[item].name}></span>
              { this.state.uploadClick ?
                <Line percent={this.state.newFile[item].percent} strokeWidth="4" strokeColor={this.state.color} className={newFileStyles.lineProgress}/>
                : null
              }
              <span>{item.success}</span>
              { item.added ?
                <span><i className={"fa fa-remove " +  sharedStyles.removeIcon} aria-hidden="true"></i></span>
                : null}
             </div>
      }.bind(this));

    const customStyles = {
      content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        width                 : '30%',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
      }
    };

    return(
      <div>
       <span className={newFileStyles.addButton} onClick= {this.openModal.bind(this)} ><i className="fa fa-plus-circle" aria-hidden="true"></i> Add File(s)</span>
       <Modal
         isOpen={this.state.modalIsOpen}
         onRequestClose={this.closeModal.bind(this)}
         style = {customStyles}>
         <div className={newFileStyles.two}>
           <h3>{this.state.title}</h3>
            <span className={newFileStyles.closeSpan} onClick= {this.closeModal.bind(this)}><i className="fa fa-times" aria-hidden="true"></i></span>
           <Form method='POST'>
             <label className={newFileStyles.addLabel}>Add files..</label>
             <FileInput name="files"
                placeholder="Add files.."
                className={newFileStyles.addFile}
                onChange={this.handleChanged.bind(that)}
                value={this.state.inputValue}/>
             <button onClick={this.uploadHandle.bind(that)} className={newFileStyles.upload}>Upload</button>
             { selectedFiles.length > 0 ?
               <div className={newFileStyles.selectedFiles}>
                { selectedFiles }
               </div>
             : null}
           </Form>
           <div className={!this.state.successMessage? (newFileStyles.errorMessage + ' ' + (this.state.message!='' ? newFileStyles.show : newFileStyles.hidden)) : (this.state.message != '' ? newFileStyles.successMessage : '')}>{this.state.message}</div>
           <button onClick={this.closeModal.bind(that)} className={ newFileStyles.cancel }>Cancel</button>
         </div>
       </Modal>
      </div>
    );
  }
}

export default newFileComponent;
