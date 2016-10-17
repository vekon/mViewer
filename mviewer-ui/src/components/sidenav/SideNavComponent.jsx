import React from 'react'
import sideNavStyles from './sideNav.css'
import $ from 'jquery'
import GridFSList from '../gridfslist/GridFSListComponent.jsx'
import { browserHistory, hashHistory } from 'react-router';
import DbList from '../dblist/DbListComponent.jsx'
import dbListStyles from '../dblist/dblist.css'

class SideNavComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem:this.props.propss.location.query.tab,
      selectedDB: null,
      connectionId: this.props.connectionId,
      visible: false
    }
  }

  refreshDb(){
    this.refs.left.refreshDbList();
  }

  setActiveItem (item) {
    this.setState({selectedDB: item});
  }

  clearActiveClass(){
    this.setState({selectedItem: 1});
  }

  dbList(){
    this.setState({selectedItem:1});
    hashHistory.push({ pathname: '/dashboard/home', query: {connectionId: this.props.connectionId, tab: 1, collapsed: 'false'} });
  }

  mongoGraphs(){
    this.setState({selectedItem:2});
    hashHistory.push({ pathname: 'dashboard/mongoGraphs', query: {connectionId: this.props.connectionId, tab: 2} });
  }

  serverStats(){
    this.setState({selectedItem:3});
    hashHistory.push({ pathname: 'dashboard/serverStats', query: {connectionId: this.props.connectionId, tab: 3} });
  }

  render () {
    var url = window.location.href;
    var params = url.split('?');
    var n = params[1].search("&collapsed=true");
    return(

        <div className ={this.props.propss.location.query.tab ==1 ? (n == -1 ? sideNavStyles.mainContainer : sideNavStyles.mainContainerCollapsed) : sideNavStyles.otherContainer}>
          <div className={this.props.propss.location.query.tab ==1 ?(n == -1 ? sideNavStyles.sideContainer : sideNavStyles.sideContainerCollapsed) : sideNavStyles.otherSideContainer}>
            <ul className={sideNavStyles.sideNav} >
              <li onClick={this.dbList.bind(this)} className ={this.state.selectedItem == 1 ? sideNavStyles.active : ''}><button data-id = '1'><div><i className={"fa fa-database " + sideNavStyles.icon} aria-hidden="true"></i></div></button></li>
              <li onClick={this.mongoGraphs.bind(this)} className ={this.state.selectedItem == 2 ? sideNavStyles.active : ''}><button data-id = '2'><div><i className={"fa fa-area-chart " + sideNavStyles.icon} aria-hidden="true"></i></div></button></li>
              <li onClick={this.serverStats.bind(this)} className ={this.state.selectedItem == 3 ? sideNavStyles.active : ''}><button data-id = '3'><div><i className={"fa fa-bar-chart " + sideNavStyles.icon} aria-hidden="true"></i></div></button></li>
            </ul>
          </div>
          { (this.state.selectedItem == 1 || this.state.selectedItem == 0) ? <DbList ref="left" selectedNav = {this.state.selectedItem} selectedDB = { this.setActiveItem.bind(this)} alignment={dbListStyles.left} propps = {this.props}></DbList> : null }
        </div>

    );
  }
}

SideNavComponent.childContextTypes = {
  selectedDB: React.PropTypes.string
};

export default SideNavComponent;
