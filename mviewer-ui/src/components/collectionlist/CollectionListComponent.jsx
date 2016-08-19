import React from 'react'
import collectionListStyles from './collectionlist.css'
import $ from 'jquery'
import CollectionItem from './CollectionItemComponent.jsx'
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
           window.location.hash = '#/dashboard/collections?connectionId='+this.props.propps.connectionId+'&db='+this.state.selectedDB+'&collection='+this.state.selectedCollection;
         });

  }

  componentWillMount(){
  }


  show (db) {
      // alert('Clicked!! '+ db);
      // console.log(this.props);
      // console.log('-----');
      // console.log(this.state.connectionId);
      this.setState({selectedDB:db});
      var that = this;
        $.ajax({
            type: "GET",
            dataType: 'json',
            credentials: 'same-origin',
            crossDomain: false,
            // url: 'http://localhost:8080/mViewer-0.9.2/services/db/test?connectionId='+ that.props.location.query.connectionId +'&query=db.runCommand(%7BdbStats%3A1%7D)&limit=10&skip=0&fields=&sortBy={_id:-1}',

            url : 'http://172.16.55.42:8080/mViewer-0.9.2/services/'+ db +'/collection?connectionId=' + this.state.connectionId,

            //url : 'http://localhost:8080/mViewer-0.9.2/services/login/details?connectionId='+ this.state.connectionId,
            success: function(data) {
              // console.log(data.response.result);
              that.setState({collections: data.response.result});
              // console.log("********");

            },

            error: function(jqXHR, exception) {

            }

        });


        this.setState({ visible: true }, function(){
         //  document.addEventListener("click", that.hide.bind(that));
         that.setState({selectedItem:null});
        });



  }

  hide(x) {
    this.setState({ visible: false});
  }


render () {
  var that=this;
  var items=null;
  var items = that.state.collections.map(function (item, idx) {
            var is_selected = that.state.selectedItem == idx;
            // console.log(is_selected + ' ' + this.state.selectedItem);
            return <CollectionItem
                key={item}
                name={item}
                onClick={this.clickHandler.bind(this,idx,item)}
                isSelected={that.state.selectedItem==idx}
                />;
        }.bind(this));
   return (
     <div className={collectionListStyles.menu} key = {this.props.visible}>
        <div className={(this.props.visible ?(this.state.visible ? collectionListStyles.visible   : this.props.alignment): this.props.alignment ) }>
          <h5 className={collectionListStyles.menuTitle}>COLLECTIONS</h5>
          {items}
        </div>
    </div>

   );
}
}

export default CollectionList;
