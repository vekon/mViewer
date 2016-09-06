import React from 'react'
import dbListStyles from './dblist.css'
import collectionListStyles from '../shared/listpanel.css'
import $ from 'jquery'
import CollectionList from '../collectionlist/CollectionListComponent.jsx'
import GridFSList from '../gridfslist/GridFSListComponent.jsx'
import DbItem from './DbItemComponent.jsx'
import modalStyles from '../shared/modal.css'
import modal from 'react-modal'
import ReactDOM  from 'react-dom'
import Config from '../../../config.json';
class DbListComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dbNames:['test1', 'test2', 'test3'],
      connectionId: this.props.propps.connectionId,
      dbStats: {},
      visible: false,
      selectedItem: null,
      selectedNav: this.props.selectedNav
    }
    modal.setAppElement(document.body)
  }

  clickHandler (idx, e) {
    this.setState({selectedItem: idx});
    this.props.selectedDB(e.target.value);
    this.refs.left.show(e.target.value);
  }

  componentDidMount(){
    var that = this;
    $.ajax({
      type: "GET",
      dataType: 'json',
      credentials: 'same-origin',
      crossDomain: false,
      url : Config.host+'/mViewer-0.9.2/services/login/details?connectionId='+ this.state.connectionId,
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
     { this.props.selectedNav == 3 ?
        <GridFSList ref="left" alignment={dbListStyles.left} propps = {this.props.propps} visible={this.state.visible} onClick = {that.changeHandler.bind(that)}> </GridFSList>
        : <CollectionList ref="left" alignment={dbListStyles.left} propps = {this.props.propps} visible={this.state.visible} onClick = {that.changeHandler.bind(that)} ></CollectionList>
     }
    </div>
    );
  }
}

DbListComponent.contextTypes = {
  selectedDB: React.PropTypes.string
};

export default DbListComponent;
