import React from 'react'
import dbListStyles from './dblist.css'
import collectionListStyles from '../shared/listpanel.css'
import $ from 'jquery'
import CollectionList from '../collectionlist/CollectionListComponent.jsx'
import GridFSList from '../gridfslist/GridFSListComponent.jsx'
import DbItem from './DbItemComponent.jsx'
import ReactDOM  from 'react-dom'
import { Form } from 'formsy-react'
import TextInput from '../TextInput/TextInputComponent.jsx'
import Modal from 'react-modal'
import service from '../../gateway/service.js'
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

  clickHandler (idx, db) {
    var that = this;
    this.setState({ visible: !this.state.visible });
    this.setState({selectedItem: db});
    this.props.selectedDB(db);
    this.setState({selectedDb : db});
    window.location.hash = '#/dashboard/collections?connectionId='+this.props.propps.connectionId+'&db='+db + '&queryType="collection"&collapsed='+this.state.visible;
  }

  componentDidMount(){
    var that = this;
    var url = window.location.href;
    var params = url.split('?');
    var n = params[1].search("&collapsed=true");
    if (n!= -1) {
      this.setState({visible:false});
    }
    var partialUrl = 'login/details?connectionId='+ this.state.connectionId;
    var refreshDbCall = service('GET', partialUrl, '');
    refreshDbCall.then(this.success.bind(this , 'componentDidMount' , ''), this.failure.bind(this , 'componentDidMount', ''));
  }

  refreshDbList(dbName){
    var partialUrl = 'login/details?connectionId='+ this.state.connectionId;
    var refreshDbCall = service('GET', partialUrl, '');
    refreshDbCall.then(this.success.bind(this , 'refreshDbList' , ''), this.failure.bind(this , 'refreshDbList', ''));
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
      var partialUrl = 'db/'+obj['name']+'?connectionId='+this.props.propps.connectionId;
      var createDbCall = service('POST', partialUrl, obj);
      createDbCall.then(this.success.bind(this , 'clickHandlerModal' , obj), this.failure.bind(this , 'clickHandlerModal', obj));
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

  success(calledFrom, obj, data) {
    if(calledFrom == 'componentDidMount'){
      if (typeof(data.response.result) != 'undefined')
        {
          this.setState({dbNames: data.response.result.dbNames});
        }
      else {
        {
          window.location.hash='#?code=INVALID_CONNECTION';
        }
      }
    }

    if(calledFrom == 'refreshDbList'){
      if (typeof(data.response.result) != 'undefined')
        {
          this.setState({dbNames: data.response.result.dbNames});
        }
      else {
        window.location.hash='#?code=INVALID_CONNECTION';
      }
    }

    if(calledFrom == 'clickHandlerModal'){
      if (data.response.result) {
        this.setState({message:'Database '+obj['name']+ ' was successfully created'});
        this.setState({successMessage:true});
        this.refreshDbList(obj['name']);
      }
      if (data.response.error) {
        this.setState({successMessage:false});
        this.setState({message:'Database '+obj['name']+ ' already exists'});
      }
    }
  }

  failure() {

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
     <div className = {this.state.visible ? dbListStyles.mainMenu : dbListStyles.mainMenuCollapsed}>
       <div className={dbListStyles.menu}>
         <div className={(this.state.visible ? dbListStyles.visible   : dbListStyles.collapsed)  }>
          <div className = {dbListStyles.dbListHeader}>
             <SearchInput className={dbListStyles.searchInput} onChange={this.searchUpdated.bind(this)} />
             <h5 className={dbListStyles.menuTitle}><span onClick= {this.openModal.bind(this)} ><i className="fa fa-plus-circle" aria-hidden="true"></i> Add Database</span></h5>
          </div>
          <div className = {dbListStyles.dbListBody}>
           {filteredData.map((item,idx) => {
               return(
                 <DbItem
                 key={item}
                 name={item}
                 onClick={this.clickHandler.bind(this,idx, item)}
                 isSelected={this.state.selectedDb==item}
                 connectionId = {this.state.connectionId}
                 refreshDbList={this.refreshDbList.bind(this)}
                 />)
             })}
          </div>
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
         <h3>Create Database</h3>
         <span className={dbListStyles.closeSpan} onClick= {this.closeModal.bind(this)}><i className="fa fa-times" aria-hidden="true"></i></span>
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
