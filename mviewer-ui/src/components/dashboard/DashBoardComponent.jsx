import React from 'react'
import dashStyles from './dashBoard.css'
import $ from 'jquery'
import SideNav from '../sidenav/SideNavComponent.jsx';

class DashBoardComponent extends React.Component {

  componentDidMount(){
   var that = this;

    $.ajax({
        type: "GET",
        dataType: 'json',
        credentials: 'same-origin',
        crossDomain: false,
        // url: 'http://172.16.55.42:8080/mViewer-0.9.2/services/db/test?connectionId='+ that.props.location.query.connectionId +'&query=db.runCommand(%7BdbStats%3A1%7D)&limit=10&skip=0&fields=&sortBy={_id:-1}',

        url : 'http://172.16.55.42:8080/mViewer-0.9.2/services/login/details?connectionId='+ that.props.location.query.connectionId,
        success: function(data) {
          console.log(data);

        },

        error: function(jqXHR, exception) {

        }


    });

}

  render() {

    return (
        <div className ='row'>
        <div className = {dashStyles.mainContainer}>
        <header>
           <nav>

               <div className="row">
                   <a href= "#" className={dashStyles.logo}><span className={dashStyles.span1}>m</span><span className={dashStyles.span2}>Viewer</span><span className={dashStyles.span3}></span></a>
                   <ul className={dashStyles.mainNav + ' ' + dashStyles.clearfix} >
                       <li><a href="#mongoGraphs"><i className={"fa fa-envira " + dashStyles.icon} aria-hidden="true"></i><span>Mongo Graph</span></a></li>
                       <li><a href="#serverStatics"><i className={"fa fa-area-chart " + dashStyles.icon} aria-hidden="true"></i><span>Server Statistics</span></a></li>
                   </ul>
               </div>
           </nav>
        </header>
           <SideNav></SideNav>
        </div>



        </div>

    );
  }
}

export default DashBoardComponent;
