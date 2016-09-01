import React from 'react'
import GridFSListStyles from '../shared/listpanel.css'
import $ from 'jquery'
import GridFSItem from './GridFSItemComponent.jsx'
class GridFSList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gridfs:['fs1', 'fs2', 'fs3'],
      connectionId: this.props.propps.connectionId,
      dbStats: {},
      selectedDB: null,
      visible: false,
      selectedItem: null,
      loading: 'Loading',
      selectedfs:null
    }
  }

  clickHandler (idx,fs) {
    this.setState({selectedItem: idx});
    this.setState({ visible: false});
    this.props.onClick();
    this.setState({selectedfs : fs}, function(){
      window.location.hash = '#/dashboard/gridfs?connectionId='+this.props.propps.connectionId+'&db='+this.state.selectedDB+'&fs='+this.state.selectedfs + '&queryType="fs"';
    });
  }

  componentWillMount(){
  }

  show (db) {
    this.setState({selectedDB:db});
    var that = this;
    $.ajax({
      type: "GET",
      dataType: 'json',
      credentials: 'same-origin',
      crossDomain: false,
      url : 'http://172.16.55.42:8080/mViewer-0.9.2/services/'+ db +'/gridfs?connectionId=' + this.state.connectionId,
      success: function(data) {
        that.setState({gridfs: data.response.result});
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

  render () {
    var that=this;
    var items=null;
    var items = that.state.gridfs.map(function (item, idx) {
      var is_selected = that.state.selectedItem == idx;
      return <GridFSItem
              key={item}
              name={item}
              onClick={this.clickHandler.bind(this,idx,item)}
              isSelected={that.state.selectedItem==idx}
              />;
      }.bind(this));
      return (
        <div className={GridFSListStyles.menu} key = {this.props.visible}>
          <div className={(this.props.visible ?(this.state.visible ? GridFSListStyles.visible   : this.props.alignment): this.props.alignment ) }>
            <h5 className={GridFSListStyles.menuTitle}>GridFS</h5>
            {items}
          </div>
        </div>
      );
  }
}

export default GridFSList;
