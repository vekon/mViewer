import React from 'react'
import collectionListStyles from '../shared/listpanel.css'
import $ from 'jquery'
import CollectionItem from './CollectionItemComponent.jsx'
import NewCollection from '../newcollection/newCollectionComponent.jsx'
import SearchInput, {createFilter} from 'react-search-input'
import Config from '../../../config.json'
class CollectionList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      collections:['collection1', 'collection2', 'collection3'],
      connectionId: this.props.propps.connectionId,
      dbStats: {},
      selectedDB: this.props.selectedDB,
      visible: false,
      selectedItem: null,
      loading: 'Loading',
      searchTerm: '',
      selectedCollection:null,
      _isMounted:false
    }
  }

  clickHandler (idx,collection) {
    this.setState({selectedItem: idx});
    this.setState({ visible: false});
    this.props.setStates(collection);
    this.setState({selectedCollection : collection}, function(){
    });
  }

  refreshRespectiveData(newCollectionName) {
    this.setState({selectedCollection: newCollectionName});
    this.props.setStates(newCollectionName);
  }

  refreshCollectionList(db){
    var that = this;
      $.ajax({
        type: "GET",
        dataType: 'json',
        credentials: 'same-origin',
        crossDomain: false,
        url : Config.host+Config.service_path+'/services/'+ db +'/collection?connectionId=' + this.state.connectionId,
        success: function(data) {
          if(typeof(data.response.result) !== 'undefined'){
            that.setState({collections: data.response.result});
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
    this.state._isMounted == true;
  }
  componentDidMount() {
    this.state._isMounted == true;
    this.setState({_isMounted : true});
    var that = this;
      $.ajax({
        type: "GET",
        dataType: 'json',
        credentials: 'same-origin',
        crossDomain: false,
        url : Config.host+Config.service_path+'/services/'+ this.props.selectedDB +'/collection?connectionId=' + this.state.connectionId,
        success: function(data) {
            that.setState({collections: data.response.result});
        }, error: function(jqXHR, exception) {
        }
      });
  }

  componentWillUnmount(){
    this.state._isMounted = false;
    // this.setState({_isMounted : false});
  }

  componentWillReceiveProps(nextProps) {
    var that = this;
      $.ajax({
        type: "GET",
        dataType: 'json',
        credentials: 'same-origin',
        crossDomain: false,
        url : Config.host+Config.service_path+'/services/'+ nextProps.selectedDB +'/collection?connectionId=' + this.state.connectionId,
        success: function(data) {
          if (that.state._isMounted == true) {
            that.setState({collections: data.response.result});
          }
        }, error: function(jqXHR, exception) {
        }
      });

  }

  searchUpdated (term) {
    this.setState({searchTerm: term})
  }

  render () {
    var that=this;
    var filteredData = null;
    if (this.state.collections != undefined){
      filteredData = this.state.collections.filter(createFilter(this.state.searchTerm));
    }
       return (
         <div className={collectionListStyles.menu} key = {this.props.visible}>
           <div className={(this.props.visible ?(this.state.visible ? collectionListStyles.visible : this.props.alignment): this.props.alignment ) }>
             <SearchInput className={collectionListStyles.searchInput} onChange={this.searchUpdated.bind(this)} />
             <h5 className={collectionListStyles.menuTitle}><NewCollection queryType= {this.props.propps.location.query.queryType} currentDb={this.props.selectedDB} currentItem={''} connectionId={this.props.propps.connectionId} addOrUpdate={'1'} refreshCollectionList={this.refreshCollectionList.bind(this)} refreshRespectiveData={this.refreshRespectiveData.bind(this)}/></h5>
               { this.state.collections != undefined ?
                 (filteredData.map((item,idx) => {
                   return(
                     <CollectionItem
                      key={item}
                      name={item}
                      dbName={this.state.selectedDB}
                      onClick={this.clickHandler.bind(this,idx,item)}
                      isSelected={this.state.selectedCollection==item}
                      connectionId={this.state.connectionId}
                      refreshCollectionList={this.refreshCollectionList.bind(this)}
                     />)
                })): null}

            </div>
        </div>
      );
}
}

export default CollectionList;
