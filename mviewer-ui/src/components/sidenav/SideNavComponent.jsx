import React from 'react'
import sideNavStyles from './sideNav.css'
import $ from 'jquery'
import dbIcon from 'react-icons/lib/fa/database'
import { browserHistory, hashHistory } from 'react-router';



class SideNavComponent extends React.Component {


  render () {
    console.log(this.props);
    console.log(this.props.propss.location.pathname);
    return(
      <div className={sideNavStyles.sideContainer}>
        <ul className={sideNavStyles.sideNav} >
            <li className ={this.props.propss.location.pathname == '/dashboard/databases' ? sideNavStyles.active : ''}><a href= {'#/dashboard/databases?connectionId='+this.props.connectionId}><div><i className={"fa fa-database " + sideNavStyles.icon} aria-hidden="true"></i><span>DATABASE</span></div></a></li>
            <li className ={this.props.propss.location.pathname == '/dashboard/collections' ? sideNavStyles.active : ''}><a href= {'#/dashboard/collections?connectionId='+this.props.connectionId}><div><i className={"fa fa-folder-open-o " +  sideNavStyles.icon} aria-hidden="true"></i><span>COLLECTION</span></div></a></li>
            <li className ={this.props.propss.location.pathname == '/dashboard/grids' ? sideNavStyles.active : ''}><a href= {'#/dashboard/grids?connectionId='+this.props.connectionId}><div><i className={"fa fa-th " +  sideNavStyles.icon} aria-hidden="true"></i><span>GRIDS</span></div></a></li>
            <li className ={this.props.propss.location.pathname == '/dashboard/help' ? sideNavStyles.active : ''}><a href= {'#/dashboard/help?connectionId='+this.props.connectionId}><div><i className={"fa fa-question-circle-o " +  sideNavStyles.icon} aria-hidden="true"></i><span>HELP</span></div></a></li>
            <li className ={this.props.propss.location.pathname == '/dashboard/console' ? sideNavStyles.active : ''}><a href= {'#/dashboard/console?connectionId='+this.props.connectionId}><div><i className={"fa fa-code " +  sideNavStyles.icon} aria-hidden="true"></i><span>CONSOLE</span></div></a></li>
            <li className ={this.props.propss.location.pathname == '/dashboard/settings' ? sideNavStyles.active : ''}><a href= {'#/dashboard/settings?connectionId='+this.props.connectionId}><div><i className={"fa fa-gear " +  sideNavStyles.icon} aria-hidden="true"></i><span>SETTINGS</span></div></a></li>
        </ul>
      </div>
    );
  }
}

export default SideNavComponent;
