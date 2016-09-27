import React from 'react'
import GridFSListStyles from '../shared/listpanel.css'
import $ from 'jquery'
import GridFSItem from './GridFSItemComponent.jsx'
import Config from '../../../config.json'
import NewBucket from '../newbucket/NewBucketComponent.jsx'
import SearchInput, {createFilter} from 'react-search-input'

class GridFSList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gridfs:[],
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
    var that = this;
      $.ajax({
        type: "GET",
        dataType: 'json',
        credentials: 'same-origin',
        crossDomain: false,
        url : Config.host +Config.service_path+'/services/'+ db +'/gridfs?connectionId=' + this.state.connectionId,
        success: function(data) {
          if(typeof(data.response.result) !== 'undefined'){
            that.setState({gridfs: data.response.result});
          }
          if(typeof(data.response.error) !== 'undefined'){
            if(data.response.error.code == 'DB_DOES_NOT_EXISTS'){
                that.props.refreshDb();
            }
          }

        }, error: function(jqXHR, exception) {
        }
      });
  }

  componentWillMount(){
    var that = this;
    $.ajax({
      type: "GET",
      dataType: 'json',
      credentials: 'same-origin',
      crossDomain: false,
      url : Config.host +Config.service_path+'/services/'+ this.props.selectedDB +'/gridfs?connectionId=' + this.state.connectionId,
      success: function(data) {
         that.setState({gridfs: data.response.result});
      }, error: function(jqXHR, exception) {
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    var that = this;
      $.ajax({
        type: "GET",
        dataType: 'json',
        credentials: 'same-origin',
        crossDomain: false,
        url : Config.host+Config.service_path+'/services/'+ nextProps.selectedDB +'/gridfs?connectionId=' + this.state.connectionId,
        success: function(data) {
          that.setState({gridfs: data.response.result});
        }, error: function(jqXHR, exception) {
        }
      });
  }

  render () {
    var that=this;
    var items=null;
    var filteredData = null;
    if (this.state.gridfs != undefined){
      filteredData = this.state.gridfs.filter(createFilter(this.state.searchTerm));
      var items = filteredData.map(function (item, idx) {
        var is_selected = that.state.selectedCollection == idx;
        return <GridFSItem
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
        <div className={GridFSListStyles.menu} key = {this.props.visible}>
          <div className={(this.props.visible ?(this.state.visible ? GridFSListStyles.visible   : this.props.alignment): this.props.alignment ) }>
            <SearchInput className={GridFSListStyles.searchInput} onChange={this.searchUpdated.bind(this)} />
            <h5 className={GridFSListStyles.menuTitle}><NewBucket gridList= {this.state.gridfs} currentDb={this.props.selectedDB} currentItem="fs" connectionId={this.state.connectionId} refreshCollectionList={this.refreshCollectionList.bind(this)} refreshRespectiveData={this.refreshRespectiveData.bind(this)}></NewBucket></h5>
            {items}
          </div>
        </div>
      );
  }
}

export default GridFSList;
