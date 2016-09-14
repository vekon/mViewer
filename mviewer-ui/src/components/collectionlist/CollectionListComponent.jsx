import React from 'react'
import collectionListStyles from '../shared/listpanel.css'
import $ from 'jquery'
import CollectionItem from './CollectionItemComponent.jsx'
import NewCollection from '../newcollection/newCollectionComponent.jsx'
import Config from '../../../config.json';
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
      selectedCollection:null
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
        url : Config.host+'/mViewer-0.9.2/services/'+ db +'/collection?connectionId=' + this.state.connectionId,
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

  componentDidMount() {
    var that = this;
      $.ajax({
        type: "GET",
        dataType: 'json',
        credentials: 'same-origin',
        crossDomain: false,
        url : Config.host+'/mViewer-0.9.2/services/'+ this.props.selectedDB +'/collection?connectionId=' + this.state.connectionId,
        success: function(data) {
          that.setState({collections: data.response.result});
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
        url : Config.host+'/mViewer-0.9.2/services/'+ nextProps.selectedDB +'/collection?connectionId=' + this.state.connectionId,
        success: function(data) {
          that.setState({collections: data.response.result});
        }, error: function(jqXHR, exception) {
        }
      });

  }

  render () {
    var that=this;
    var items=null;
    if(typeof(that.state.collections) !== 'undefined')
    {
      var items = that.state.collections.map(function (item, idx) {
        var is_selected = that.state.selectedItem == idx;
        return <CollectionItem
                key={item}
                name={item}
                dbName={this.state.selectedDB}
                onClick={this.clickHandler.bind(this,idx,item)}
                isSelected={that.state.selectedCollection==item}
                connectionId={this.state.connectionId}
                refreshCollectionList={this.refreshCollectionList.bind(this)}
               />;
        }.bind(this));
       return (
         <div className={collectionListStyles.menu} key = {this.props.visible}>
           <div className={(this.props.visible ?(this.state.visible ? collectionListStyles.visible : this.props.alignment): this.props.alignment ) }>
             <h5 className={collectionListStyles.menuTitle}><NewCollection queryType= {this.props.propps.location.query.queryType} currentDb={this.props.selectedDB} currentItem={''} connectionId={this.props.propps.connectionId} addOrUpdate={'1'} refreshCollectionList={this.refreshCollectionList.bind(this)} refreshRespectiveData={this.refreshRespectiveData.bind(this)}/></h5>
             {items}
            </div>
        </div>
       );
     }
     else {
       return(
         <div className={collectionListStyles.menu} key = {this.props.visible}>
           <div className={(this.props.visible ?(this.state.visible ? collectionListStyles.visible : this.props.alignment): this.props.alignment ) }>
             <h5 className={collectionListStyles.menuTitle}><NewCollection queryType= {this.props.propps.location.query.queryType} currentDb={this.props.selectedDB} currentItem={''} connectionId={this.props.propps.connectionId} addOrUpdate={'1'} refreshCollectionList={this.refreshCollectionList.bind(this)} refreshRespectiveData={this.refreshRespectiveData.bind(this)}/></h5>
            </div>
        </div>
       );
     }
  }
}

export default CollectionList;
