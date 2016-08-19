import React from 'react'
import sideNavStyles from './sideNav.css'
import $ from 'jquery'
import dbIcon from 'react-icons/lib/fa/database'
import { browserHistory, hashHistory } from 'react-router';
// import Menu from './Menu.jsx'
// import MenuItem from './MenuItem.jsx'
// import MenuStyles from './menu.css'
import DbList from '../dblist/DbListComponent.jsx'
import dbListStyles from '../dblist/dblist.css'

class SideNavComponent extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        selectedItem:null
      }
  }
  showLeft (e) {
     this.setState({ selectedItem: e.currentTarget.dataset.id });
    console.log(e.currentTarget.dataset.id);
         this.refs.left.show();
        // <li className ={this.props.propss.location.pathname == '/dashboard/collections' ? sideNavStyles.active : ''}><a href= {'#/dashboard/collections?connectionId='+this.props.connectionId}><div><i className={"fa fa-folder-open-o " +  sideNavStyles.icon} aria-hidden="true"></i><span>COLLECTION</span></div></a></li>
        // <li className ={this.props.propss.location.pathname == '/dashboard/grids' ? sideNavStyles.active : ''}><a href= {'#/dashboard/grids?connectionId='+this.props.connectionId}><div><i className={"fa fa-th " +  sideNavStyles.icon} aria-hidden="true"></i><span>GRIDS</span></div></a></li>
        // <li className ={this.props.propss.location.pathname == '/dashboard/help' ? sideNavStyles.active : ''}><a href= {'#/dashboard/help?connectionId='+this.props.connectionId}><div><i className={"fa fa-question-circle-o " +  sideNavStyles.icon} aria-hidden="true"></i><span>HELP</span></div></a></li>
        // <li className ={this.props.propss.location.pathname == '/dashboard/console' ? sideNavStyles.active : ''}><a href= {'#/dashboard/console?connectionId='+this.props.connectionId}><div><i className={"fa fa-code " +  sideNavStyles.icon} aria-hidden="true"></i><span>CONSOLE</span></div></a></li>
        // <li className ={this.props.propss.location.pathname == '/dashboard/settings' ? sideNavStyles.active : ''}><a href= {'#/dashboard/settings?connectionId='+this.props.connectionId}><div><i className={"fa fa-gear " +  sideNavStyles.icon} aria-hidden="true"></i><span>SETTINGS</span></div></a></li>
//
        // <Menu ref="left" alignment={MenuStyles.left}>
        //        <MenuItem hash="first-page">First Page</MenuItem>
        //        <MenuItem hash="second-page">Second Page</MenuItem>
        //        <MenuItem hash="third-page">Third Page</MenuItem>
        // </Menu>

    }


  render () {
    // console.log(this.props);
    // console.log(this.props.propss.location.pathname);
    return(
      <div className ={sideNavStyles.mainContainer}>
        <DbList ref="left" alignment={dbListStyles.left} propps = {this.props}></DbList>

      <div className={sideNavStyles.sideContainer}>
        <ul className={sideNavStyles.sideNav} >
            <li className ={this.state.selectedItem == 1 ? sideNavStyles.active : ''}><button data-id = '1' onClick={this.showLeft.bind(this)}><div><i className={"fa fa-database " + sideNavStyles.icon} aria-hidden="true"></i><span>DATABASE</span></div></button></li>
            <li className ={this.state.selectedItem == 2 ? sideNavStyles.active : ''}><button data-id = '2' onClick={this.showLeft.bind(this)}><div><i className={"fa fa-folder-open-o " +  sideNavStyles.icon} aria-hidden="true"></i><span>COLLECTION</span></div></button></li>
            <li className ={this.state.selectedItem == 3 ? sideNavStyles.active : ''}><button data-id = '3'><div><i className={"fa fa-th " +  sideNavStyles.icon} aria-hidden="true"></i><span>GRIDS</span></div></button></li>
            <li className ={this.state.selectedItem == 4 ? sideNavStyles.active : ''}><button data-id = '4'><div><i className={"fa fa-question-circle-o " +  sideNavStyles.icon} aria-hidden="true"></i><span>HELP</span></div></button></li>
            <li className ={this.state.selectedItem == 5 ? sideNavStyles.active : ''}><button data-id = '5'><div><i className={"fa fa-code " +  sideNavStyles.icon} aria-hidden="true"></i><span>CONSOLE</span></div></button></li>
            <li className ={this.state.selectedItem == 6 ? sideNavStyles.active : ''}><button data-id = '6'><div><i className={"fa fa-gear " +  sideNavStyles.icon} aria-hidden="true"></i><span>SETTINGS</span></div></button></li>
        </ul>

      </div>
      </div>
    );
  }
}

export default SideNavComponent;
