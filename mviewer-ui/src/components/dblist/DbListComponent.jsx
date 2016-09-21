import React from 'react'
import dbListStyles from './dblist.css'
import collectionListStyles from '../shared/listpanel.css'
import $ from 'jquery'
import CollectionList from '../collectionlist/CollectionListComponent.jsx'
import GridFSList from '../gridfslist/GridFSListComponent.jsx'
import DbItem from './DbItemComponent.jsx'
import modalStyles from '../shared/modal.css'
import ReactDOM  from 'react-dom'
import { Form } from 'formsy-react'
import TextInput from '../TextInput/TextInputComponent.jsx';
import Modal from 'react-modal'
import Config from '../../../config.json'
import SearchInput, {createFilter} from 'react-search-input'
class DbListComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dbNames:['test1', 'test2', 'test3'],
      connectionId: this.props.propps.connectionId,
      dbStats: {},
      visible: true,
      selectedItem: null,
      selectedDb: null,
      modalIsOpen: false,
      name: null,
      error:false,
      searchTerm: '',
      selectedNav: this.props.selectedNav
    }
  }

  openModal() {
    this.setState({modalIsOpen: true});
    this.setState({message: ''});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
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

  clickHandler (idx, e) {
    var that = this;
    this.setState({ visible: !this.state.visible });
    this.setState({selectedItem: idx});
    this.props.selectedDB(e.target.value);
    this.setState({selectedDb : e.target.value});
    window.location.hash = '#/dashboard/collections?connectionId='+this.props.propps.connectionId+'&db='+e.target.value + '&queryType="collection"&collapsed='+this.state.visible;
  }

  componentDidMount(){
    var that = this;
    var url = window.location.href;
    var params = url.split('?');
    var n = params[1].search("&collapsed=true");
    if (n!= -1) {
      this.setState({visible:false});
    }
    $.ajax({
      type: "GET",
      dataType: 'json',
      credentials: 'same-origin',
      crossDomain: false,
      url : Config.host+Config.service_path+'/services/login/details?connectionId='+ this.state.connectionId,
      success: function(data) {
        if (typeof(data.response.result) != 'undefined')
          {
            that.setState({dbNames: data.response.result.dbNames});
          }
        else {
          {
            window.location.hash='#?code=INVALID_CONNECTION';
          }
        }
      }, error: function(jqXHR, exception) {
      }
    });
  }

  refreshDbList(dbName){
    var that = this;
    $.ajax({
      type: "GET",
      dataType: 'json',
      credentials: 'same-origin',
      crossDomain: false,
      url : Config.host+Config.service_path+'/services/login/details?connectionId='+ this.state.connectionId,
      success: function(data) {
        if (typeof(data.response.result) != 'undefined')
          {
            that.setState({dbNames: data.response.result.dbNames});
          }
        else {
          {
            window.location.hash='#?code=INVALID_CONNECTION';
          }
        }
      }, error: function(jqXHR, exception) {
      }
    });
    window.location.hash = '#/dashboard/collections?connectionId='+this.props.propps.connectionId+'&db='+dbName + '&queryType="collection"&collapsed=false';
  }

  changeHandler(){
    this.setState({visible:false});
  }

  collapsedDivHandler(){
    var that =this;
    this.setState({visible: !this.state.visible}, function(){
      window.location.hash = '#/dashboard/collections?connectionId='+that.props.propps.connectionId+'&db='+that.state.selectedDb + '&queryType="collection"&collapsed='+false;
    });

  }

  clickHandlerModal(){
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
        url: Config.host+Config.service_path+'/services/db/'+obj['name']+'?connectionId='+this.props.propps.connectionId,
        data : obj,
        success: function(data) {
          if (data.response.result) {
            that.setState({message:'Database '+obj['name']+ ' was successfully created'});
            that.setState({successMessage:true});
            that.refreshDbList(obj['name']);
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

  searchUpdated (term) {
    this.setState({searchTerm: term})
  }

  componentWillReceiveProps(){
    var url = window.location.href;
    var params = url.split('?');
    var shouldCollapse = params[1].search("&collapsed=true");
    if (shouldCollapse!= -1) {
      this.setState({visible:false});
    }
    else{
      this.setState({visible:true});
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
    var that = this;
    const filteredData = this.state.dbNames.filter(createFilter(this.state.searchTerm));
    return(
     <div>
       <div className={dbListStyles.menu}>
         <div className={(this.state.visible ? dbListStyles.visible   : dbListStyles.collapsed)  }>
           <SearchInput className={dbListStyles.searchInput} onChange={this.searchUpdated.bind(this)} />
           <h5 className={dbListStyles.menuTitle}><span onClick= {this.openModal.bind(this)} ><i className="fa fa-plus-circle" aria-hidden="true"></i> Add Database</span></h5>
             {filteredData.map((item,idx) => {
               return(
                 <DbItem
                 key={item}
                 name={item}
                 onClick={this.clickHandler.bind(this,idx)}
                 isSelected={this.state.selectedDb==item}
                 connectionId = {this.state.connectionId}
                 refreshDbList={this.refreshDbList.bind(this)}
                 />)
             })}
        </div>
        <div className={this.state.visible ?dbListStyles.collapsedDiv: dbListStyles.openDiv} onClick={this.collapsedDivHandler.bind(this)} >
          <span className={dbListStyles.arrow}>
            <i className="fa fa-chevron-right" aria-hidden="true" ></i>
          </span>
          <span className={dbListStyles.collapsedData}>{(this.state.selectedDb != null ? this.state.selectedDb : '') || (this.props.propps.propss != undefined ? this.props.propps.propss.location.query.db : null)}</span>
        </div>
     </div>
     <Modal
       isOpen={this.state.modalIsOpen}
       onRequestClose={this.closeModal.bind(this)}
       style = {customStyles}>
       <div className={dbListStyles.two}>
         <span className={dbListStyles.closeModal} onClick={this.closeModal.bind(this)}><i className='fa fa-remove'></i></span>
         <h3>Create Database</h3>
         <Form method='POST' onValid={this.enableButton()} onInvalid={this.disableButton()} >
           <div className={ dbListStyles.formContainer}>
             <div className={dbListStyles.inputBox}>
               <TextInput type="text" name="name" id="name" placeholder="Database name" value={this.state.name} onChange = {this.handleChange.bind(this)} validations={'isRequired2:'+this.state.error+',isAlpha1:'+this.state.error} onChange={this.handleChange.bind(this)} validationErrors={{isRequired2: 'Db name must not be empty', isAlpha1: 'Invalid Db name' }}  />
             </div>
             <div>
               <button onClick={this.clickHandlerModal.bind(this)} value='SUBMIT' className={dbListStyles.submit} disabled={!this.state.canSubmit}>SUBMIT</button>
             </div>
           </div>
         </Form>
          <div className={!this.state.successMessage? (dbListStyles.errorMessage + ' ' + (this.state.message!='' ? dbListStyles.show : dbListStyles.hidden)) : (this.state.message != '' ? dbListStyles.successMessage : '')}>{this.state.message}</div>
       </div>
     </Modal>
    </div>
    );
  }
}

DbListComponent.contextTypes = {
  selectedDB: React.PropTypes.string
};

export default DbListComponent;
