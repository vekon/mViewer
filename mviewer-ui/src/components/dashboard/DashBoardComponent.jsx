import React from 'react'
import dashStyles from './dashBoard.css'
import $ from 'jquery'
import SideNav from '../sidenav/SideNavComponent.jsx';

class DashBoardComponent extends React.Component {

  render() {
    console.log(this.props.location.query.connectionId);
    return (
        <div className ='row'>
        <div className = {dashStyles.mainContainer}>
        <header>
           <nav>

               <div className="row">
                   <a href= "#/dashboard/home" className={dashStyles.logo}><span className={dashStyles.span1}>m</span><span className={dashStyles.span2}>Viewer</span><span className={dashStyles.span3}></span></a>
                   <ul className={dashStyles.mainNav + ' ' + dashStyles.clearfix} >
                       <li><a href="#mongoGraphs"><i className={"fa fa-envira " + dashStyles.icon} aria-hidden="true"></i><span>Mongo Graph</span></a></li>
                       <li><a href="#serverStatics"><i className={"fa fa-area-chart " + dashStyles.icon} aria-hidden="true"></i><span>Server Statistics</span></a></li>
                   </ul>
               </div>
           </nav>
        </header>
           <SideNav></SideNav>
           {React.cloneElement(this.props.children, this.props)}
        </div>



        </div>

    );
  }
}

export default DashBoardComponent;
