import React from 'react'
import indexStyles from './index.css'
import $ from 'jquery'
import Modal from 'react-modal'
import update from 'react-addons-update'
import { Form } from 'formsy-react';
import TextInput from '../TextInput/TextInputComponent.jsx';
import service from '../../gateway/service.js'

class NewIndexComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      message:'',
      successMessage: false,
      indexes: [],
      errorMessage: false,
      fields: [],
      attrCreated : false
    }
  }

  getAttributes() {
    var that = this;
    var partialUrl = this.props.currentDb+'/'+this.props.currentItem+'/document/keys?connectionId='+this.props.connectionId+'&allKeys=true';
    var getAttributesCall = service('GET', partialUrl, '');
    getAttributesCall.then(this.success.bind(this, 'getAttributes'), this.failure.bind(this, 'getAttributes'));
  }

  getIndexes() {
    var that = this;
    var partialUrl = this.props.currentDb+'/usersIndexes/getIndex?index_colname=' + this.props.currentItem+'&connectionId='+this.props.connectionId;
    var getIndexesCall = service('GET', partialUrl, '');
    getIndexesCall.then(this.success.bind(this, 'getIndexes'), this.failure.bind(this, 'getIndexes'));
  }

  success(calledFrom,data){
    if (calledFrom == 'getAttributes'){
      var arr = data.response.result.keys;
      var newArr = [];
      for(var i=0; i < arr.length; i++) {
        newArr.push({"value": arr[i], "attrSelected" :false,"asc": false});
      }
      this.setState({fields:newArr});
      if(!this.state.attrCreated && this.state.indexes && this.state.indexes.length > 0) {
        this.setAttributes();
      }
    }
    if(calledFrom == 'clickHandler') {
      if(data.response.result) {
        var successResult = data.response.result.replace(/[\[\]']/g,'' );
        this.setState({message:successResult});
        this.setState({successMessage:true});
        setTimeout(function() { this.closeModal() }.bind(this), 2000);
      }
      if (data.response.error) {
        this.setState({message:"Server error, Index cannot be added"});
      }
    }
    if (calledFrom == 'getIndexes'){
      this.setState({indexes: data.response.result.documents});
      if(!this.state.attrCreated && this.state.fields && this.state.fields.length > 0) {
        this.setAttributes();
      }
    }
  }

  failure(){

  }

  setAttributes() {
    var that = this;
    this.state.fields.map(function(items){
      that.state.indexes.map(function(item){
        Object.keys(item).map(function(key){
          if(key == items.value){
            items.attrSelected = true;
            if(item[key] == 1){
              items.asc = true;
            } else {
              items.asc = false;
            }
           }
         });
      });
    });
    this.setState({attrCreated: true});
  }

  openModal() {
    this.setState({modalIsOpen: true});
    this.getAttributes();
    this.getIndexes();
    this.setState({message: ''});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
    this.setState({fields: []});
    this.setState({indexes: []});
    this.setState({attrCreated: false});
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
      if (e.target.value == '') {
        this.setState({errorMessage : true});
      }
      else {
        this.setState({errorMessage : false});
      }
    }.bind(this);


  }

  clickHandler(){
    var that =this;
    var dataObj = {};
    var obj = {};
    obj['index_colname'] = this.props.currentItem;
    this.state.fields.map(function(item){
      if(item.attrSelected){
        if(item.asc){
          dataObj[item.value] = 1;
        } else {
          dataObj[item.value] = -1;
        }
      }
    });
    obj['index_keys'] = JSON.stringify(dataObj);
    var partialUrl = this.props.currentDb+'/usersIndexes/updateIndex?connectionId='+this.props.connectionId;
    var newDocumentCall = service((this.props.addOrEdit != 'Edit'? 'POST' : 'PUT'), partialUrl, obj);
    newDocumentCall.then(this.success.bind(this, 'clickHandler'), this.failure.bind(this, 'clickHandler'));

  }

  attributeHandler(r) {
    var that = this;
    var index = 0;
    var checkUncheck = function(value) {
      that.state.fields.map(function(e) {
        if(e.value == r.result.value) {
          that.setState(update(that.state.fields[index], {attrSelected: {$set: value}}));
          ++index;
        }
      });
    }
    return function(e) {
      if(r.result.attrSelected == true){
        r.result.attrSelected = false;
        checkUncheck(false);
      }
      else {
        r.result.attrSelected = true;
        checkUncheck(true);
      }
    }.bind(this);
  }

  orderHandler(r){
    var that = this;
    var index = 0;
    var checkUncheck = function(value) {
      that.state.fields.map(function(e) {
        if(e.value == r.result.value) {
          that.setState(update(that.state.fields[index], {asc: {$set: value}}));
          ++index;
        }
      });
    }

    return function(e) {
      if(r.result.asc == true){
        r.result.asc = false;
        checkUncheck(false);
      }
      else {
        r.result.asc = true;
        checkUncheck(true);
      }
    }.bind(this);
  }

  render () {
    var that = this;
    const customStyles = {
      content : {
        top                   : '50%',
        left                  : '50%',
        border                : 'none',
        borderRadius          : '4px',
        right                 : 'auto',
        width                 : '25%',
        overflow              : 'hidden',
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
      <div className = {indexStyles.mainContainer}>
      <span className= {indexStyles.addButton} onClick= {this.openModal.bind(this)} ><i className="fa fa-pencil" aria-hidden="true"></i> Add/Edit Indexes</span>
       <Modal
         isOpen={this.state.modalIsOpen}
         onRequestClose={this.closeModal.bind(this)}
         style = {customStyles}>
         <div className={indexStyles.two}>
           <div className={indexStyles.header}>
             <span className={indexStyles.text}>Add/Edit Indexes</span>
           </div>
            <form>
              <div className = {indexStyles.attrDiv}>
                <label className={indexStyles.attributesLabel}>Attributes</label>
                <label className={indexStyles.orderLabel}>Asc Index</label>
                <div className={indexStyles.queryAttributesDiv}>
                  <ol id="attributesList" className={indexStyles.attributeList}>
                    { this.state.fields && this.state.fields.length > 0 ? this.state.fields.map(function(result) {
                      return <li key={result.value} className={indexStyles.attributesItems}>
                      <span className={indexStyles.checkboxSpan}><input type="checkbox" id={result.value} checked={result.attrSelected} onChange = {that.attributeHandler({result}).bind(that)}></input></span>
                            <span className={indexStyles.valueSpan}>{result.value}</span>
                      <span className={indexStyles.ascCheckboxSpan}><input type="checkbox" id={result.value} checked={result.asc} onChange = {that.orderHandler({result}).bind(that)}></input></span>
                      </li>;

                    }) : null }
                  </ol>
                </div>
              </div>
            </form>
            <div className={indexStyles.buttonContainer}>
                <button onClick={this.clickHandler.bind(this)} value='SUBMIT' className={indexStyles.submit} disabled = {this.state.errorMessage}>SUBMIT</button>
                <button onClick={this.closeModal.bind(this)} value='CANCEL' className={indexStyles.cancel}>CANCEL</button>
            </div>
            <div className = {indexStyles.clear}></div>
            <div className={!this.state.successMessage? (indexStyles.errorMessage + ' ' + (this.state.message!='' ? indexStyles.show : indexStyles.hidden)) : (this.state.message != '' ? indexStyles.successMessage : '')}>{this.state.message}</div>
         </div>
       </Modal>
     </div>
    );
  }
}

export default NewIndexComponent;
