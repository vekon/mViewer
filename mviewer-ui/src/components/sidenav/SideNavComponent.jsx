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
      selectedItem:"1",
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
    this.setState({selectedItem: 0});
  }

  help() {
    window.open('https://venkoux.github.io/mViewer/','_blank');
  }

  render () {
    var url = window.location.href;
    var params = url.split('?');
    var n = params[1].search("&collapsed=true");
    return(

        <div className ={n == -1 ?sideNavStyles.mainContainer : sideNavStyles.mainContainerCollapsed}>
          <div className={n == -1 ? sideNavStyles.sideContainer : sideNavStyles.sideContainerCollapsed }>
            <ul className={sideNavStyles.sideNav} >
              <li className ={this.state.selectedItem == 1 ? sideNavStyles.active : ''}><button data-id = '1'><div><i className={"fa fa-database " + sideNavStyles.icon} aria-hidden="true"></i></div></button></li>
              <li onClick={this.help.bind(this)} className ={this.state.selectedItem == 2 ? sideNavStyles.active : ''}><button data-id = '2'><div><i className={"fa fa-question-circle-o " +  sideNavStyles.icon} aria-hidden="true"></i></div></button></li>
            </ul>
          </div>
          <DbList ref="left" selectedNav = {this.state.selectedItem} selectedDB = { this.setActiveItem.bind(this)} alignment={dbListStyles.left} propps = {this.props}></DbList>
        </div>

    );
  }
}

SideNavComponent.childContextTypes = {
  selectedDB: React.PropTypes.string
};

export default SideNavComponent;
