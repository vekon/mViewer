import React from 'react'
import collectionListStyles from '../shared/listpanel.css'
import $ from 'jquery'
import CollectionItem from './CollectionItemComponent.jsx'
import Config from '../../../config.json';
class CollectionList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      collections:['collection1', 'collection2', 'collection3'],
      connectionId: this.props.propps.connectionId,
      dbStats: {},
      selectedDB: null,
      visible: false,
      selectedItem: null,
      loading: 'Loading',
      selectedCollection:null
    }
  }

  clickHandler (idx,collection) {
    this.setState({selectedItem: idx});
    this.setState({ visible: false});
    this.props.onClick();
    this.setState({selectedCollection : collection}, function(){
      window.location.hash = '#/dashboard/collections?connectionId='+this.props.propps.connectionId+'&db='+this.state.selectedDB+'&collection='+this.state.selectedCollection + '&queryType="collection"';
    });
  }

  show (db) {
    this.setState({selectedDB:db});
    var that = this;
      $.ajax({
        type: "GET",
        dataType: 'json',
        credentials: 'same-origin',
        crossDomain: false,
        url : Config.host+'/mViewer-0.9.2/services/'+ db +'/collection?connectionId=' + this.state.connectionId,
        success: function(data) {
          that.setState({collections: data.response.result});
        }, error: function(jqXHR, exception) {
        }
      });
      this.setState({ visible: true }, function(){
        that.setState({selectedItem:null});
      });
  }

  hide(x) {
    this.setState({ visible: false});
  }

  refreshCollectionList(){
    // this.setState({selectedDB:db});
    var that = this;
      $.ajax({
        type: "GET",
        dataType: 'json',
        credentials: 'same-origin',
        crossDomain: false,
        url : Config.host+'/mViewer-0.9.2/services/'+ that.state.selectedDB +'/collection?connectionId=' + this.state.connectionId,
        success: function(data) {
          that.setState({collections: data.response.result});
        }, error: function(jqXHR, exception) {
        }
      });
      // this.setState({ visible: true }, function(){
      //   that.setState({selectedItem:null});
      // });
  }


  render () {
    var that=this;
    var items=null;
    var items = that.state.collections.map(function (item, idx) {
      var is_selected = that.state.selectedItem == idx;
      return <CollectionItem
              key={item}
              name={item}
              dbName={this.state.selectedDB}
              onClick={this.clickHandler.bind(this,idx,item)}
              isSelected={that.state.selectedItem==idx}
              connectionId={this.state.connectionId}
              refreshCollectionList={this.refreshCollectionList.bind(this)}
             />;
      }.bind(this));
     return (
       <div className={collectionListStyles.menu} key = {this.props.visible}>
         <div className={(this.props.visible ?(this.state.visible ? collectionListStyles.visible : this.props.alignment): this.props.alignment ) }>
           <h5 className={collectionListStyles.menuTitle}>COLLECTIONS</h5>
           {items}
          </div>
      </div>
     );
  }
}

export default CollectionList;
