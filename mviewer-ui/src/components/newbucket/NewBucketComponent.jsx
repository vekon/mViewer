import React from 'react'
import newBucketStyles from './newBucket.css'
import $ from 'jquery'
import Modal from 'react-modal'
import { Form } from 'formsy-react';
import TextInput from '../TextInput/TextInputComponent.jsx';
import progress from '../shared/jquery.ajax-progress.jsx'
import Line from 'rc-progress/lib/Line.js'
import newFileStyles from '../newfile/newfile.css'
import 'rc-progress/assets/index.less'
import FileInput from 'react-file-input'
import service from '../../gateway/service.js'

class newFileComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      autoIndex: true,
      name: null,
      size: '',
      max:'',
      error: false,
      title:'',
      submitted:false,
      message:'',
      successMessage: false,
      newBucket: null,
      uploadClick: false,
      count: 0,
      newFile: [],
      errorFile: false
    }
  }

  openModal() {
    this.setState({modalIsOpen: true});
    this.setState({message: ''});
    this.setState({newBucket: null});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
    this.setState({newFile: []});
    this.setState({uploadClick: false});
    this.setState({error: false});
    this.setState({errorFile: false});
    this.setState({count: 0});
    if(this.state.successMessage==true)
    {
      this.props.refreshCollectionList(this.props.currentDb);
      this.props.refreshRespectiveData(this.state.newBucket);
    }
  }

  handleChanged(event){
    var newArray = this.state.newFile.slice();
    newArray.push(event.target.files[0]);
    this.setState({newFile : newArray});
    this.setState({errorFile: false});
  }

  handleChange(e){
    this.setState({successMessage:false});
    this.setState({message:''});
  }

  fileUpload(data) {
    var that = this;
    var fd = new FormData();
    fd.append( 'files', data );
    var partialUrl = this.props.currentDb+'/gridfs/'+that.state.newBucket+'/uploadfile?connectionId='+this.props.connectionId;
    var newBucketCall = service('POST', partialUrl, fd, 'fileUpload' , data);
    newBucketCall.then(this.success.bind(this), this.failure.bind(this));
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
      setTimeout(function() { this.setState({message: "New Bucket" +this.state.newBucket+" is successfully created"})}.bind(this), 1000);
      setTimeout(function() { this.closeModal() }.bind(this), 3000);
    }
  }

  failure() {

  }

  addHandle(){
    var that = this;
    var that = this;
    var data = $("form").serialize().split("&");
    var obj={};
    for(var key in data)
    {
      obj[data[key].split("=")[0]] = data[key].split("=")[1];
    }
    if ((obj['newBucket']!='' || obj['newBucket']!=null) && this.state.newFile.length > 0){
      this.state.newBucket = obj['newBucket'];
      this.setState({uploadClick: true});
      this.state.newFile.map(function(item){
        item.percent = 0;
        that.fileUpload(item);
      });
    }
    if(obj['newBucket']!='' || obj['newBucket']!=null) {
      this.setState({error : true});
    }

    if(this.state.newFile.length <= 0){
      this.setState({errorFile: true});
    }
  }

  componentDidMount(){
    this.setState({name :this.props.currentItem});
    this.setState({title:'Add GridFS Bucket'});
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
        overflow              : 'hidden',
        left                  : '50%',
        padding               : '0px',
        right                 : 'auto',
        width                 : '28%',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
      }
    };

    return(
      <div>
        <span onClick= {this.openModal.bind(this)} className={newBucketStyles.newBucket}><i className="fa fa-plus-circle" aria-hidden="true"></i> Add GridFS Bucket</span>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal.bind(this)}
          style = {customStyles}>
          <div className={newBucketStyles.two}>
            <div className={newBucketStyles.header}>
              <span className={newBucketStyles.text}>{this.state.title}</span>
              <span className={newBucketStyles.closeSpan} onClick= {this.closeModal.bind(this)}><i className="fa fa-times" aria-hidden="true"></i></span>
            </div>
            <Form method='POST'>
              <div className={newBucketStyles.div1}>
                <TextInput className={newBucketStyles.input} type="text" name="newBucket" id="newBucket" placeholder="Bucket Name" value={this.state.newBucket} validations={'isRequired2:'+this.state.error+',isAlpha1:'+this.state.error} onChange={this.handleChange.bind(that)} validationErrors={{isRequired2: 'Bucket name must not be empty', isAlpha1: 'Invalid Bucket name' }} />
                <div>
                { selectedFiles.length <= 0 ?
                  <span>
                    <label className={newBucketStyles.addLabel}>Add files..</label>
                    <FileInput name="files"
                       placeholder="Add files.."
                       className={newBucketStyles.addFile}
                       onChange={this.handleChanged.bind(that)}
                       value={this.state.inputValue}/>
                  </span>
                 : <span>
                    <div className={newBucketStyles.selectedFiles}>
                    { selectedFiles }
                    </div>
                    <FileInput name="files"
                       placeholder="Add files.."
                       className={newBucketStyles.addFile}
                       onChange={this.handleChanged.bind(that)}
                       value={this.state.inputValue}/>

                   </span> }
                 { this.state.errorFile ?
                  <div className={newBucketStyles.errorFile}>Please select alteast one file.</div>
                  : null}
                  </div>
              </div>
              <div className={!this.state.successMessage? (newBucketStyles.errorMessage + ' ' + (this.state.message!='' ? newBucketStyles.show : newBucketStyles.hidden)) : (this.state.message != '' ? newBucketStyles.successMessage : '')}>{this.state.message}</div>
              <div className={newBucketStyles.buttons}>
                <button onClick={this.addHandle.bind(that)} className={newBucketStyles.submit}>SUBMIT</button>
                <span onClick={this.closeModal.bind(that)} className={newBucketStyles.cancel}>CANCEL</span>
              </div>
            </Form>

          </div>
        </Modal>
      </div>
    );
  }
}

export default newFileComponent;
