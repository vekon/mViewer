import React from 'react'
import dashStyles from './dashBoard.css'
import $ from 'jquery'
import SideNav from '../sidenav/SideNavComponent.jsx';
import Config from '../../../config.json';

class DashBoardComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      connectionId:this.props.location.query.connectionId,
    }
  }

  disconnect(){
    $.ajax({
      type: "GET",
      dataType: 'json',
      credentials: 'same-origin',
      crossDomain: false,
      url : Config.host+'/mViewer-0.9.2/services/disconnect?connectionId=' + this.state.connectionId,
      success: function(data) {
        if(data.response.result==='User Logged Out')
          {
              window.location.hash = '#';
          }
      }, error: function(jqXHR, exception) {
      }
    });
  }

  refreshDb(){
    this.refs.sideNav.refreshDb();
  }

  clearActiveClass(){
    this.refs.sideNav.clearActiveClass();
  }

  render() {
    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
      connectionId: this.state.connectionId,
      refreshDb: function(){
        this.refreshDb();
      }.bind(this)
     })
    );

    return (
      <div className ='row'>
        <div className = {dashStyles.mainContainer}>
          <header>
            <nav>
              <div className="row">
                <a href= "#/dashboard/home" className={dashStyles.logo} onClick={this.clearActiveClass.bind(this)}><span className={dashStyles.span1}>m</span><span className={dashStyles.span2}>Viewer</span><span className={dashStyles.span3}></span></a>
                <ul className={dashStyles.mainNav + ' ' + dashStyles.clearfix} >
                  <li><a href="#mongoGraphs"><i className={"fa fa-envira " + dashStyles.icon} aria-hidden="true"></i><span>Mongo Graph</span></a></li>
                  <li><a href="#serverStatics"><i className={"fa fa-area-chart " + dashStyles.icon} aria-hidden="true"></i><span>Server Statistics</span></a></li>
                  <li className={dashStyles.disconnect}><a href="javascript:void(0);" onClick={this.disconnect.bind(this)}><span>Disconnect</span></a></li>
                </ul>
               </div>
             </nav>
          </header>
          <SideNav ref='sideNav' connectionId = {this.state.connectionId} propss = {this.props}></SideNav>
          {childrenWithProps}
        </div>
      </div>
    );
  }
}

export default DashBoardComponent;
