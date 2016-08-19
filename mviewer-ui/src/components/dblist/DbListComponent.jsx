import React from 'react'
import dbListStyles from './dblist.css'
import collectionListStyles from '../collectionlist/collectionlist.css'
import $ from 'jquery'
import CollectionList from '../collectionlist/CollectionListComponent.jsx'
import DbItem from './DbItemComponent.jsx'
class DbListComponent extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
          dbNames:['test1', 'test2', 'test3'],
          connectionId: this.props.propps.connectionId,
          dbStats: {},
          selectedDB: null,
          visible: false,
          selectedItem: null
      }
  }
  clickHandler (idx, e) {
         this.setState({selectedItem: idx});
         this.refs.left.show(e.target.value);
     }

  componentDidMount(){
   var that = this;
  //  console.log(this.props);
  //  console.log(this.state.connectionId + ' connectionId ')
    $.ajax({
        type: "GET",
        dataType: 'json',
        credentials: 'same-origin',
        crossDomain: false,
        // url: 'http://localhost:8080/mViewer-0.9.2/services/db/test?connectionId='+ that.props.location.query.connectionId +'&query=db.runCommand(%7BdbStats%3A1%7D)&limit=10&skip=0&fields=&sortBy={_id:-1}',

        url : 'http://172.16.55.42:8080/mViewer-0.9.2/services/login/details?connectionId='+ this.state.connectionId,
        //url : 'http://localhost:8080/mViewer-0.9.2/services/login/details?connectionId='+ this.state.connectionId,
        success: function(data) {
          // console.log(data);
          that.setState({dbNames: data.response.result.dbNames});

        },

        error: function(jqXHR, exception) {

        }

    });

}
show (x) {
     var that = this;
     this.setState({ visible: !this.state.visible }, function(){
       that.setState({selectedItem:null});
     });
    this.refs.left.hide(x);
}

changeHandler(){
     this.setState({visible:false});

}

render () {
  var that = this;
  var items = this.state.dbNames.map(function (item, idx) {
            var is_selected = this.state.selectedItem == idx;
            // console.log(is_selected + ' ' + this.state.selectedItem);
            return <DbItem
                key={item}
                name={item}
                onClick={this.clickHandler.bind(this,idx)}
                isSelected={this.state.selectedItem==idx}
                />;
        }.bind(this));
  return(
   <div>
     <div className={dbListStyles.menu}>
        <div className={(this.state.visible ? dbListStyles.visible   : this.props.alignment)  }>
          <h5 className={dbListStyles.menuTitle}>DATABASES</h5>
              {items}
        </div>
    </div>
    <CollectionList ref="left" alignment={dbListStyles.left} propps = {this.props.propps} visible={this.state.visible} onClick = {that.changeHandler.bind(that)} ></CollectionList>
  </div>
   );
  }
}

export default DbListComponent;
