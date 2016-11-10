import React from 'react'
import authPopUpStyles from './authpopup.css'
import $ from 'jquery'
import Modal from 'react-modal'
import service from '../../gateway/service.js';

class AuthPopUpComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: this.props.modalIsOpen,
      message:'',
    }
  }

  closeModal() {
    this.setState({modalIsOpen : false});
    this.props.authClose();
  }

  componentWillReceiveProps(){
    // if(this.props.db == next.props.db && this.props.collection !=nextprops.collection)
     // this.setState({modalIsOpen: this.props.modalIsOpen});
  }



  render () {
    const customStyles = {
      content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        width                 : '25%',
        minWidth              : '300px',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        zIndex                :  '4',
        borderRadius          :  '2px',
        padding               :  '0px',
        border                :  '0px'
      }
    };

    return(
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal.bind(this)}
        style = {customStyles}>
        <div className={authPopUpStyles.two}>
          <div className={authPopUpStyles.header}>
            <span className={authPopUpStyles.text}>Info</span>
          </div>
          <div className = {authPopUpStyles.popupBody}>
            <label>You don't have previleges to {this.props.action}</label>
            <div className={authPopUpStyles.buttons}>
              <span onClick={this.closeModal.bind(this)} className={authPopUpStyles.close}>CLOSE</span>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default AuthPopUpComponent;
