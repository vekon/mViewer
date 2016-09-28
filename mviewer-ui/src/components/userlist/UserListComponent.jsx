import React from 'react'
import UserListStyles from '../shared/listpanel.css'
import $ from 'jquery'
import UserItem from './UserItemComponent.jsx'
import NewUser from '../newuser/NewUserComponent.jsx'
import SearchInput, {createFilter} from 'react-search-input'
import service from '../../gateway/service.js'

class UserList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user:[],
      connectionId: this.props.propps.connectionId,
      dbStats: {},
      selectedDB: this.props.selectedDB,
      visible: false,
      selectedItem: null,
      loading: 'Loading',
      selectedCollection:null,
      searchTerm: ''
    }
  }

  success(calledFrom, data) {
    if(calledFrom == 'refreshCollectionList'){
      if(typeof(data.response.result) !== 'undefined'){
        this.setState({user: data.response.result});
      }
      if(typeof(data.response.error) !== 'undefined'){
        if(data.response.error.code == 'DB_DOES_NOT_EXISTS'){
            this.props.refreshDb();
        }
      }
    }

    if(calledFrom == 'componentWillMount'){
      this.setState({user: data.response.result});
    }

    if(calledFrom == 'componentWillReceiveProps'){
      this.setState({user: data.response.result});
    }
  }

  failure() {

  }


  clickHandler (idx,fs) {
    this.setState({selectedCollection: idx});
    this.setState({ visible: false});
    this.props.setStates(fs);
    this.setState({selectedCollection : fs}, function(){
    });
  }

  refreshRespectiveData(newCollectionName) {
    this.setState({selectedCollection: newCollectionName});
    this.props.setStates(newCollectionName);
  }

  searchUpdated (term) {
    this.setState({searchTerm: term})
  }

  refreshCollectionList(db){
    var partialUrl = db +'/userIndexes/users?connectionId=' + this.state.connectionId;
    var userListCall = service('GET', partialUrl, '', 'getUser');
    userListCall.then(this.success.bind(this, 'refreshCollectionList'), this.failure.bind(this, 'refreshCollectionList'));
  }

  componentWillMount(){
    var that = this;
    var partialUrl = this.props.selectedDB +'/userIndexes/users?connectionId=' + this.state.connectionId;
    var userListCall = service('GET', partialUrl, '', 'getUser');
    userListCall.then(this.success.bind(this, 'componentWillMount'), this.failure.bind(this, 'componentWillMount'));
  }

  componentWillReceiveProps(nextProps) {
    var that = this;
    var partialUrl = nextProps.selectedDB +'/userIndexes/users?connectionId=' + this.state.connectionId;
    var userListCall = service('GET', partialUrl, '', 'getUser');
    userListCall.then(this.success.bind(this, 'componentWillReceiveProps'), this.failure.bind(this, 'componentWillReceiveProps'));
  }

  render () {
    var that=this;
    var items=null;
    var filteredData = null;
    if (this.state.user != undefined){
      filteredData = this.state.user.filter(createFilter(this.state.searchTerm));
      var items = filteredData.map(function (item, idx) {
        var is_selected = that.state.selectedCollection == idx;
        return <UserItem
                key={item}
                name={item}
                dbName={this.state.selectedDB}
                onClick={this.clickHandler.bind(this,idx,item)}
                isSelected={that.state.selectedCollection==item}
                connectionId={this.state.connectionId}
                refreshCollectionList={this.refreshCollectionList.bind(this)}
                />;
        }.bind(this));
    }
      return (
        <div className={UserListStyles.menu} key = {this.props.visible}>
          <div className={(this.props.visible ?(this.state.visible ? UserListStyles.visible   : this.props.alignment): this.props.alignment ) }>
            <SearchInput className={UserListStyles.searchInput} onChange={this.searchUpdated.bind(this)} />
            <h5 className={UserListStyles.menuTitle}><NewUser currentDb={this.props.selectedDB} currentItem="fs" connectionId={this.state.connectionId} refreshCollectionList={this.refreshCollectionList.bind(this)} refreshRespectiveData={this.refreshRespectiveData.bind(this)}></NewUser></h5>
            {items}
          </div>
        </div>
      );
  }
}

export default UserList;
