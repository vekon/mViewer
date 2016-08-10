import React from 'react'
import sideNavStyles from './sideNav.css'
import $ from 'jquery'
import dbIcon from 'react-icons/lib/fa/database'
import { browserHistory, hashHistory } from 'react-router';



class SideNavComponent extends React.Component {


  render () {

    return(
      <div className={sideNavStyles.sideContainer}>
        <ul className={sideNavStyles.sideNav} >
            <li><a href= '#/dashboard/databases'><div><i className={"fa fa-database " + sideNavStyles.icon} aria-hidden="true"></i><span>DATABASE</span></div></a></li>
            <li><a href= '#/dashboard/collections'><div><i className={"fa fa-folder-open-o " +  sideNavStyles.icon} aria-hidden="true"></i><span>COLLECTION</span></div></a></li>
            <li><a href= '#/dashboard/grids'><div><i className={"fa fa-th " +  sideNavStyles.icon} aria-hidden="true"></i><span>GRIDS</span></div></a></li>
            <li><a href= '#/dashboard/help'><div><i className={"fa fa-question-circle-o " +  sideNavStyles.icon} aria-hidden="true"></i><span>HELP</span></div></a></li>
            <li><a href= '#/dashboard/console'><div><i className={"fa fa-code " +  sideNavStyles.icon} aria-hidden="true"></i><span>CONSOLE</span></div></a></li>
            <li><a href= '#/dashboard/settings'><div><i className={"fa fa-gear " +  sideNavStyles.icon} aria-hidden="true"></i><span>SETTINGS</span></div></a></li>
        </ul>

      </div>
    );
  }
}

export default SideNavComponent;
