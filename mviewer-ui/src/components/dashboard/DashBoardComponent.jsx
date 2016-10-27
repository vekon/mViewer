import React from 'react'
import dashStyles from './dashBoard.css'
import $ from 'jquery'
import SideNav from '../sidenav/SideNavComponent.jsx';
import service from '../../gateway/service.js';

class DashBoardComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      connectionId:this.props.location.query.connectionId,
      loggedInDatabase: this.props.location.query.database
    }
  }

  disconnect(){
    var partialUrl = 'disconnect?connectionId=' + this.state.connectionId;
    var disconnectCall = service('GET', partialUrl, '');
    disconnectCall.then(this.success.bind(this), this.failure.bind(this));
  }

  success(data) {
    if(data.response.result==='User Logged Out')
      {
          window.location.hash = '#';
      }
  }

  failure() {

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
      loggedInDatabase: this.state.loggedInDatabase,
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
              <div className={"row " + dashStyles.row}>
                <a href= {"#/dashboard/home?collapsed=false&connectionId="+this.state.connectionId+'&tab=1'} className={dashStyles.logo} onClick={this.clearActiveClass.bind(this)}><img src={'./images/Logo.png'}></img></a>
                <ul className={dashStyles.mainNav + ' ' + dashStyles.clearfix} >
                  <li><a target = "_blank" href="https://venkoux.github.io/mViewer/"><span><i className="fa fa-question-circle-o"></i></span></a></li>
                  <li className={dashStyles.disconnect}><a href="javascript:void(0);" onClick={this.disconnect.bind(this)}><span><i className="fa fa-sign-out" aria-hidden="true"></i></span></a></li>
                </ul>
               </div>
             </nav>
          </header>
          <SideNav ref='sideNav' connectionId = {this.state.connectionId} loggedInDatabase ={this.state.loggedInDatabase} propss = {this.props}></SideNav>
          {childrenWithProps}
        </div>
      </div>
    );
  }
}

export default DashBoardComponent;
