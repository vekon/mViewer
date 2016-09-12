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
      selectedItem:null,
      selectedDB: null,
      connectionId: this.props.connectionId,
      visible: false
    }
  }

  refreshDb(){
    this.refs.left.refreshDbList();
  }

  showLeft (e) {
    this.setState({ selectedItem: e.currentTarget.dataset.id });
    this.refs.left.show();
  }

  setActiveItem (item) {
    this.setState({selectedDB: item});
  }

  clearActiveClass(){
    this.setState({selectedItem: 0});
  }

  render () {
    return(
      <div className ={sideNavStyles.mainContainer}>
        <DbList ref="left" selectedNav = {this.state.selectedItem} selectedDB = { this.setActiveItem.bind(this)} alignment={dbListStyles.left} propps = {this.props}></DbList>
        <div className={sideNavStyles.sideContainer}>
          <ul className={sideNavStyles.sideNav} >
            <li className ={this.state.selectedItem == 1 ? sideNavStyles.active : ''}><button data-id = '1' onClick={this.showLeft.bind(this)}><div><i className={"fa fa-database " + sideNavStyles.icon} aria-hidden="true"></i><span>DATABASE</span></div></button></li>
            <li className ={this.state.selectedItem == 2 ? sideNavStyles.active : ''}><button data-id = '2' onClick={this.showLeft.bind(this)}><div><i className={"fa fa-folder-open-o " +  sideNavStyles.icon} aria-hidden="true"></i><span>COLLECTION</span></div></button></li>
            <li className ={this.state.selectedItem == 3 ? sideNavStyles.active : ''}><button data-id = '3' onClick={this.showLeft.bind(this)}><div><i className={"fa fa-th " +  sideNavStyles.icon} aria-hidden="true"></i><span>GRIDS</span></div></button></li>
            <li className ={this.state.selectedItem == 4 ? sideNavStyles.active : ''}><button data-id = '4'><div><i className={"fa fa-question-circle-o " +  sideNavStyles.icon} aria-hidden="true"></i><span>HELP</span></div></button></li>
            <li className ={this.state.selectedItem == 5 ? sideNavStyles.active : ''}><button data-id = '5'><div><i className={"fa fa-code " +  sideNavStyles.icon} aria-hidden="true"></i><span>CONSOLE</span></div></button></li>
            <li className ={this.state.selectedItem == 6 ? sideNavStyles.active : ''}><button data-id = '6'><div><i className={"fa fa-gear " +  sideNavStyles.icon} aria-hidden="true"></i><span>SETTINGS</span></div></button></li>
          </ul>
        </div>
      </div>
    );
  }
}

SideNavComponent.childContextTypes = {
  selectedDB: React.PropTypes.string
};

export default SideNavComponent;
