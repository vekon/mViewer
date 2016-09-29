import React from 'react'
import userDetailsStyles from './userdetails.css'
import $ from 'jquery'
import Config from '../../../config.json';
import service from '../../gateway/service.js';
import DeleteComponent from '../deletecomponent/DeleteComponent.jsx'

class UserDetailsComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userDetails: [],
      selectedDB: null,
      modalIsOpen: false,
      sidebarOpen: false,
      currentUser: null
    }
  }

  openModal() {
    this.setState({modalIsOpen: true});
    this.setState({message: ''});
  }

  closeModal(successMessage) {
    this.setState({modalIsOpen: false});
    if (successMessage == true){
      this.props.refreshCollectionList(false);
    }
  }

  createUserDetails(nextProps){
    var userDetail = [];
    var sortItem = {};
    var that = this;
     if(nextProps != null && nextProps != undefined){
       sortItem = nextProps.users;
     } else {
       sortItem = this.props.users;
     }
    Object.keys(sortItem).map(function(key) {
      if(key == "roles") {
        userDetail.push({'key': 'role', 'value': sortItem[key][0].role});
      } else {
         userDetail.push({'key': key, 'value': sortItem[key]});
      }
    });
    this.setState({userDetails: userDetail});
  }

  componentDidMount(){
    this.setState({currentUser: this.props.users.user});
    this.createUserDetails();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({currentUser: nextProps.users.user});
    this.createUserDetails(nextProps);
  }

  failure() {
  }

  render () {
    var that = this;
    return(
      <div className={userDetailsStyles.mainContainer}>
          <div>
            <span className={userDetailsStyles.detailsLabel}> {this.state.currentUser} Details:</span>
              <div className={userDetailsStyles.deleteButtonGridfs} onClick={this.openModal.bind(this)}><i className="fa fa-trash" aria-hidden="true"></i><span>Delete User</span></div>
              { this.state.modalIsOpen?<DeleteComponent modalIsOpen={this.state.modalIsOpen} closeModal={this.closeModal.bind(this)} title = 'User' dbName = {this.props.currentDb} userName = {this.state.currentUser} connectionId={this.props.connectionId} ></DeleteComponent> : '' }
          </div>
        <div className={userDetailsStyles.detailsBody}>
          <table>
            <tbody>
              <tr>
                <th>Keys</th>
                <th>Values</th>
              </tr>
              { this.state.userDetails.length > 0 ?
                that.state.userDetails.map(function(item) {
                return <tr key={item.key}><td>{item.key}</td><td>{item.value}</td></tr>
              }) : null }
            </tbody>
          </table>
        </div>
    </div>
  );
 }
}

export default UserDetailsComponent;
